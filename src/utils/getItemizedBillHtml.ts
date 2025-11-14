import { getDomainConfig } from './domainConfig'

  const config = getDomainConfig();


function getItemizedBillHtml(data: any[]): string {
  // Use first record for patient info
  const patient = data && data.length > 0 ? data[0] : {};
  // const chargesTotal = data ? data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0) : 0;
  // const roomCharge = parseFloat(patient.room_chg) || 0;
  // const adjustment_total = parseFloat(patient.adjustment_total) || 0;
  
  // Parse insurance fields
  const [primaryInsName = "", plan = "", primaryPolicyNo = ""] = (patient.primary_insurance_data || "").split(":");
  const [secondaryInsName = "", secondaryPlan = "", secondaryPolicyNo = ""] = (patient.secondary_insurance_data || "").split(":");

  // Parse adjustment details
  const parseAdjustmentDetail = (adjustmentStr?: string) => {
    if (!adjustmentStr) return [];
    return adjustmentStr.split(",").map(item => {
      const [date, description, amount] = item.split(":");
      return {
        date: date?.trim() || "",
        description: description?.trim() || "",
        amount: amount?.trim() || ""
      };
    });
  };
   const adjustmentDetails = parseAdjustmentDetail(patient.adjustment_detail);
// console.log('====================================');
// console.log(adjustmentDetails);
// console.log('====================================');
  const totalAmount = patient?.total_charge || 0;
  const payment_total = patient?.payment_total || 0;
  const amount_due = patient?.amount_due || 0;


  // Format amount with thousand separator
  const formatAmount = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Format units to remove trailing zeros and unnecessary decimals
  const formatUnits = (units: string | number) => {
    if (!units) return "";
    const num = parseFloat(units.toString());
    return isNaN(num) ? "" : num % 1 === 0 ? num.toString() : num.toString();
  };

  // Helper for date formatting: MM-DD-YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${month}-${day}-${year}`;
  };

  // Helper for date formatting: MM-DD-YY
  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('T')[0].split('-');
    const yy = year.slice(-2);
    return `${month}-${day}-${yy}`;
  };




  // Group by Department
  const grouped: Record<string, any[]> = {};
  (data || []).forEach(row => {
    if (!grouped[row.Department]) grouped[row.Department] = [];
    // Add parsed adjustment details to each row
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
          <td style="width: 7%; padding-bottom: 0;">${formatUnits(row.units)}</td>
          <td style="width: 10%; padding-bottom: 0; text-align: right;"></td>
          <td style="width: 10%; padding-bottom: 0; text-align: right;">${row.amount != null ? formatAmount(parseFloat(row.amount)) : ""}</td>
        </tr>
      `;
    }).join("");

    chargesRows += `<tr style="font-family: Courier New; font-size: 16px;">
            <td> ${rows[0]?.location || ""}</td>
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
<body style=" font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.2; padding-bottom: 40px;">
    <table>
        <tr>
            <td style="width: 40%;">
                <img src="${config.reportLogo}" style="width: 280px;" alt="ladmc-logo">
            </td>
            <td style="width: 20%;">
                <p style="font-size: 14px;"> 
                  ${config.address}
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
                        <td style="width: 50%; border: 1px solid black; border-top: 0;">${patient?.pat_status || "N/A"}</td>
                        <td style="width: 50%; border: 1px solid black; border-top: 0;">${patient?.fin_class || "N/A"}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table>
        <tr>
             <td style="width: 30%; padding:0 10px; border: 1px solid black;  border-bottom: 0;  vertical-align: middle;">
                <p style="font-size: 14px; margin: 0; display: flex; flex-direction: column; justify-content: center; height: 100%;">
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
            <td style="width: 20%; padding: 0;  vertical-align: top;">
                <table>
                    <tr style="background-color: #B7B7B7; border-bottom: 1px solid black;">
                        <td>Primary Contact Number</td>
                    </tr>
                    <tr>
                        <td>${patient.patient_phone || ""}</td>
                    </tr>
                    <tr style="background-color: #B7B7B7; border: 1px solid black; border-left: 0; border-right: 0;">
                        <td>Secondary Contact Number</td>
                    </tr>
                    <tr>
                         <td>${patient.nextkin_phone || ""}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%;  padding: 0; border: 1px solid black; border-top: 0; vertical-align: top;">
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
            <td> <b>1. </b>${primaryInsName}</td>
            <td>${plan}</td>
            <td>${primaryPolicyNo}</td>
        </tr>
        ${
          secondaryInsName
            ? `<tr>
                <td> <b>2. </b>${secondaryInsName}</td>
                <td>${secondaryPlan}</td>
                <td>${secondaryPolicyNo}</td>
              </tr>`
            : ""
        }
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
        
    ${ patient?.room_days && patient?.room_chg != 0 ? `
            <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 13%; padding-bottom: 0;">${formatDateShort(patient?.room_chg_date)}</td>
            <td style="width: 10%; padding-bottom: 0;">${ ""}</td>
            <td style="width: 40%; padding-bottom: 0;">${patient?.room_type || ""}</td>
            <td style="width: 7%; padding-bottom: 0;">${patient?.room_days || ""}</td>
            <td style="width: 10%; padding-bottom: 0; text-align: right;">${patient?.room_rate || ""}</td>
            <td style="width: 10%; padding-bottom: 0; text-align: right;">${patient.room_chg != null ? formatAmount(parseFloat(patient.room_chg)) : ""}</td>
            </tr>

            <tr style="font-family: Courier New; font-size: 16px;">
                <td colspan="5">Room and Care Charge Totals </td>
                <td  style="border-top: 1px solid black; text-align: right;">${formatAmount(parseFloat(patient.room_chg))}</td>
            </tr>
        ` : "" }
       
        ${chargesRows}

        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="5">Total Charges</td>
            <td style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">${formatAmount(totalAmount)}</td>
        </tr>

        ${adjustmentDetails.length > 0 ? adjustmentDetails.map(adj => `
            <tr style="font-family: Courier New; font-size: 16px;">
              <td style="width: 13%; padding-bottom: 0;">${formatDateShort(adj.date)}</td>
              <td style="width: 10%; padding-bottom: 0;">${""}</td>
              <td style="width: 40%; padding-bottom: 0;">${adj.description}</td>
              <td style="width: 7%; padding-bottom: 0;">${""}</td>
              <td style="width: 10%; padding-bottom: 0; text-align: right;">${""}</td>
              <td style="width: 10%; padding-bottom: 0; text-align: right;">${adj.amount != null ? formatAmount(parseFloat(adj.amount)) : ""}</td>
            </tr>
        `).join("")+
        `<tr style="font-family: Courier New; font-size: 16px;">
            <td>Total Adjustments:</td>
            <td colspan="4" style="text-align: center; "></td>
            <td  style="border-top: 1px solid black; text-align: right;">${formatAmount(parseFloat(patient?.adjustment_total) || 0)}</td>
        </tr>` : "" }


        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="4">Total Payment:</td>
            <td colspan="2" style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">${formatAmount(parseFloat(payment_total))}</td>
        </tr>

          <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="4">Amount Due:</td>
            <td colspan="2" style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">${formatAmount(parseFloat(amount_due))}</td>
        </tr>

    </table>
</body>
</html>
    `;
}

export default getItemizedBillHtml;