function getItemizedBillHtml(data: any[]): string {
  // Use first record for patient info
  const patient = data && data.length > 0 ? data[0] : {};
  const totalAmount = data ? data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0) : 0;

  // Parse insurance fields
  const [primaryInsName = "", plan = "", primaryPolicyNo = ""] = (patient.primary_insurance_data || "").split(":");
  const [secondaryInsName = "", secondaryPlan = "", secondaryPolicyNo = ""] = (patient.secondary_insurance_data || "").split(":");

  // Format amount with thousand separator
  const formatAmount = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Helper for date formatting: MM-DD-YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  // Group by Department
  const grouped: Record<string, any[]> = {};
  (data || []).forEach(row => {
    if (!grouped[row.Department]) grouped[row.Department] = [];
    grouped[row.Department].push(row);
  });

  // Build grouped rows with subtotals
  let chargesRows = "";
  Object.entries(grouped).forEach(([dept, rows]) => {
    let deptTotal = 0;
    chargesRows += rows.map(row => {
    const date = row.chg_date
      ? (() => {
        const d = new Date(row.chg_date);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yy = String(d.getFullYear()).slice(-2);
        return `${mm}-${dd}-${yy}`;
        })()
      : "";
      deptTotal += parseFloat(row.amount) || 0;
      return `
        <tr style="font-family: Courier New; font-size: 16px;">
          <td style="width: 13%; padding-bottom: 0;">${date}</td>
          <td style="width: 10%; padding-bottom: 0;">${row.price_code || ""}</td>
          <td style="width: 40%; padding-bottom: 0;">${row.Description || ""}</td>
          <td style="width: 7%; padding-bottom: 0;">${row.units || ""}</td>
          <td style="width: 10%; padding-bottom: 0; text-align: right;"></td>
          <td style="width: 10%; padding-bottom: 0; text-align: right;">${row.amount != null ? formatAmount(parseFloat(row.amount)) : ""}</td>
        </tr>
      `;
    }).join("");

    chargesRows += `<tr style="font-family: Courier New; font-size: 16px;">
            <td>LAB</td>
            <td colspan="4" style="text-align: center; ">DEPT ${dept} TOTALS</td>
            <td  style="border-top: 1px solid black; text-align: right;">${formatAmount(deptTotal)}</td>
        </tr>`;
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LADMC Medical Invoice</title>
    <style>
        table { width: 100%; border-collapse: collapse;}
        th, td {
            padding: 10px;
            text-align: left;
        }
      /* Ensure background colors are printed */
      @media print {
        th, td, tr.charge-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
</head>
<body style=" font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.2;">
    <table>
        <tr>
            <td style="width: 40%;">
                <img src="https://ladowntownmc.com/wp-content/uploads/2019/06/copy-of-logo.png" style="width: 280px;" alt="ladmc-logo">
            </td>
            <td style="width: 20%;">
                <p style="font-size: 14px;"> 
                    1711 West Temple Street <br>
                    Los Angeles CA 90026 5421 <br>
                    213-989-6100 <br>
                </p>
            </td>
            <td style="width: 20%; vertical-align: bottom; ">
                <p>FEDERAL ID: 82-4157363</p>
            </td>
            <td style="width: 20%; vertical-align: bottom; padding: 0;">
                <table style="width: 100%; border-collapse: collapse">
                    <tr>
                        <td style="width: 50%; border: 1px solid black; font-weight: bold; background-color: #B7B7B7;">Page</td>
                        <td style="width: 50%; border: 1px solid black;">1</td>
                    </tr>
                    <tr>
                        <td style="width: 50%; border: 1px solid black;font-weight: bold; background-color: #B7B7B7;">P/S</td>
                        <td style="width: 50%; border: 1px solid black;font-weight: bold; background-color: #B7B7B7;">F/C</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table >
        <tr>
            <td style="width: 80%; padding: 0;">
                <table>
                    <tr>
                        <td style="border: 1px solid black;">DISCHARGE BILL</td>
                        <td style="border: 1px solid black;font-weight: bold; background-color: #B7B7B7;">Statement Of Account Of</td>
                        <td style="border: 1px solid black;">${patient.pat_name || ""}</td>
                        <td style="border: 1px solid black;font-weight: bold; background-color: #B7B7B7;">Date</td>
                        <td style="border: 1px solid black; border-right: 0;">${formatDate(new Date().toISOString().slice(0, 10))}</td>
                    </tr>
                </table>
            </td>
            
            <td style="width: 20%; padding: 0;">
                <table>
                    <tr>
                        <td style="width: 50%; border: 1px solid black; border-top: 0;">OL</td>
                        <td style="width: 50%; border: 1px solid black; border-top: 0;">MC</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td style="width: 50%; padding:0 10px; border: 1px solid black; border-top: 0; vertical-align: top;">
                <p style="font-size: 15px;">
                  ${patient.pat_name || ""}
                  <br>
                  ${
                    patient.pat_address
                      ? patient.pat_address
                          .split(",")
                          .map((line: string, idx: number, arr: string[]) =>
                            line.trim()
                              ? idx < arr.length - 1
                                ? `${line.trim()},<br>`
                                : `${line.trim()}<br>`
                              : ""
                          )
                          .filter(Boolean)
                          .join("")
                      : ""
                  }
                </p>
            </td>
            <td style="width: 50%;  padding:0; border: 1px solid black; border-top: 0; vertical-align: top;">
                <table>
                    <tr style="background-color: #B7B7B7;">
                        <td style="padding: 10px; border: 1px solid black; border-top: 0; border-left: 0; font-weight: bold;">Visit number</td>
                        <td style="padding: 10px; border: 1px solid black; border-top: 0; font-weight: bold;" >Admit Date</td>
                        <td style="width: 40%; padding: 10px; border: 1px solid black; border-top: 0; font-weight: bold;">Discharge Date</td>
                    </tr>
                    <tr>
                        <td>${patient.visit_no || ""}</td>
                        <td>${formatDate(patient.admit_date)}</td>
                        <td>${formatDate(patient.dischg_date)}</td>
                    </tr>
                    <tr style="background-color: #B7B7B7;">
                        <td style="padding: 10px; border: 1px solid black; border-left: 0; font-weight: bold;">Date of Birth</td>
                        <td colspan="2" style="padding: 10px; border: 1px solid black; font-weight: bold;">Physician</td>
                    </tr>
                    <tr>
                        <td>${formatDate(patient.birth_date)}</td>
                        <td>${patient.phy_name || ""}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table style="border: 1px solid black;">
        <tr style="background-color: #B7B7B7; border: 1px solid black; border-top: 0;">
            <td style="width: 40%; font-weight: bold;">Insurance Company</td>
            <td style="width: 30%; border-left: 1px solid black; font-weight: bold;">Plan</td>
            <td style="width: 30%; border-left: 1px solid black; font-weight: bold;">Policy Number</td>
        </tr>
        <tr>
            <td>${primaryInsName}</td>
            <td>${plan}</td>
            <td>${primaryPolicyNo}</td>
        </tr>
             <tr>
            <td>${secondaryInsName}</td>
            <td>${secondaryPlan}</td>
            <td>${secondaryPolicyNo}</td>
        </tr>
    </table>

    <table>
        <tr style="background-color: #B7B7B7; border: 1px solid black; border-top: 0;">
            <td style="border-left: 1px solid black; font-weight: bold;">Date</td>
            <td style="border-left: 1px solid black; font-weight: bold;">Code</td>
            <td style="border-left: 1px solid black; font-weight: bold;">Description</td>
            <td style="border-left: 1px solid black; font-weight: bold; text-align: center;">Units</td>
            <td style="border-left: 1px solid black; font-weight: bold;">Rate</td>
            <td style="border-left: 1px solid black; font-weight: bold; text-align: center;">Amount</td>
        </tr>
        ${chargesRows}
        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="5">Total Charges</td>
            <td style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">${formatAmount(totalAmount)}</td>
        </tr>
        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="4" style="text-align: center;">Amount Due:</td>
            <td colspan="2" style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">${formatAmount(totalAmount)}</td>
        </tr>
    </table>
</body>
</html>
    `;
}

export default getItemizedBillHtml;