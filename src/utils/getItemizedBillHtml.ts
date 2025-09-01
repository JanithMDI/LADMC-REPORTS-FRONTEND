function getItemizedBillHtml(data: any[]): string {
  // Use first record for patient info
  const patient = data && data.length > 0 ? data[0] : {};
  const totalAmount = data ? data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0) : 0;

  // Parse insurance fields
  const [primaryInsName = "", primaryPolicyNo = ""] = (patient.primary_insurance_data || "").split("::");

  // Format amount with thousand separator
  const formatAmount = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Charges table rows from data
  const chargesRows = (data || []).map((row) => `
    <tr class="charge-row" style="border:none;">
      <td>${row.chg_date || ""}</td>
      <td>${row.price_code || ""}</td>
      <td style="border-left:none; border-right:none;">${row.Description || ""}</td>
      <td style="text-align:center;">${row.units || ""}</td>
      <td style="text-align:right;">${row.amount != null ? formatAmount(parseFloat(row.amount)) : ""}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LADMC Medical Invoice</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.2; }
      table { border-collapse: collapse; }
      th, td { padding: 6px; font-size: 12px; border: 1px solid #000; }
      td:nth-child(3) { border-left: none !important; border-right: none !important; }
      tr.charge-row { border: none !important; }
      th { background-color: #999 !important; color: #000; font-weight: bold; }
      .charge-row:nth-child(even) { background-color: #f9f9f9 !important; }
      .charge-row:nth-child(odd) { background-color: #e6e6e6 !important; }
      .no-border td, .no-border th { border: none !important; }
      /* Ensure background colors are printed */
      @media print {
        th, td, tr.charge-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
</head>
<body>
    <!-- Top Section with Federal ID and Page Info -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:10px;" class="no-border">
        <tr>
            <td style="width:33%; vertical-align:top;">
                <img src="https://ladowntownmc.com/wp-content/uploads/2019/06/copy-of-logo.png" style="width: 280px;" alt="ladmc-logo">
            </td>
            <td style="width:34%; vertical-align:top;">
                <div style="font-size: 11px; font-weight: bold; margin-right: 20px; padding-bottom: 15px;">
                    LOS ANGELES DOWNTOWN MEDICAL CENTER<br>
                    1720 E. CESAR E. CHAVEZ AVE.<br>
                    LOS ANGELES, CA 90033<br>
                    (323) 980-2000
                </div>
            </td>
            <td style="width:33%; vertical-align:top;">
                <table style="float:right; border-collapse: collapse; border: 2px solid #000;">
                    <tr>
                        <td colspan="2" style="text-align:right; font-size: 11px; font-weight: bold; border:none; padding-bottom:8px;">
                            FEDERAL ID: 82-4157363
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #999; padding: 8px 15px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center;">Page</td>
                        <td style="background-color: white; padding: 8px 15px; font-size: 11px; border: 1px solid #000; text-align: center;">1</td>
                    </tr>
                    <tr>
                        <td style="background-color: #999; padding: 8px 15px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center;">P/S</td>
                        <td style="background-color: #999; padding: 8px 15px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center;">F/C</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- Main Header Row -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
        <tr>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 15%;">DISCHARGE BILL</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 20%; text-align: center;">Statement Of Account Of</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 25%; text-align: center;">${patient.pat_name || ""}</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 10%; text-align: center;">Date</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; width: 12%; text-align: center;">${new Date().toISOString().slice(0, 10)}</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 10%; text-align: center;">OL</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 8%; text-align: center;">MC</td>
        </tr>
    </table>

    <!-- Patient Details and Visit Info Section -->
    <table style="width: 100%; border-collapse: collapse; border-left: 2px solid #000; border-right: 2px solid #000; margin-bottom: 0;">
        <tr>
            <td rowspan="4" style="background-color: white; padding: 12px; font-size: 11px; border: 1px solid #000; width: 35%; vertical-align: top;">
                <div>${patient.pat_name || ""}</div>
                <div>${patient.pat_address || ""}</div>
            </td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center; width: 15%;">Visit Number</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center; width: 15%;">Admit Date</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center; width: 17.5%;">Discharge Date</td>
        </tr>
        <tr>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; text-align: center;">${patient.visit_no || ""}</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; text-align: center;">${patient.admit_date || ""}</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; text-align: center;">${patient.dischg_date || ""}</td>
        </tr>
        <tr>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center;">Date of Birth</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; text-align: center;">Physician</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000;"></td>
        </tr>
        <tr>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; text-align: center;">${patient.birth_date || ""}</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000; text-align: center;">${patient.phy_name || ""}</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000;"></td>
        </tr>
    </table>

    <!-- Insurance Information -->
    <table style="width: 100%; border-collapse: collapse; border-left: 2px solid #000; border-right: 2px solid #000; margin-bottom: 0;">
        <tr>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 35%;">Insurance Company</td>
            <td style="background-color: #999; padding: 8px; font-size: 11px; font-weight: bold; border: 1px solid #000; width: 35%; text-align: center;">Policy Number</td>
        </tr>
        <tr>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000;">${primaryInsName}</td>
            <td style="background-color: white; padding: 8px; font-size: 11px; border: 1px solid #000;text-align: center;">${primaryPolicyNo}</td>
        </tr>
    </table>

    <!-- Charges Table -->
    <table style="width: 100%; margin-top: 0;" class="no-border">
        <tr>
            <th style="width: 12%;">Date</th>
            <th style="width: 15%;">Code</th>
            <th style="width: 40%;">Description</th>
            <th style="width: 10%;">Units</th>
            <th style="width: 13%; text-align: center;">Amount</th>
        </tr>
        ${chargesRows}
    </table>

    <table class="no-border" style="width: 100%; margin: 15px 0; font-size: 11px;">
        <tr>
            <td style="font-weight: bold; padding: 6px;"></td>
            <td style="font-weight: bold; padding: 6px; text-align: center;"></td>
            <td style="width: 120px; font-weight: bold; padding: 6px; text-align: right; border-top: 1px solid #000;">${formatAmount(totalAmount)}</td>
        </tr>
    </table>

    <!-- Total Charges -->
    <table class="no-border" style="width: 100%; margin: 15px 0; font-size: 11px;">
        <tr>
            <td style="font-weight: bold; padding: 6px;">Total Charges</td>
            <td style="width: 120px; font-weight: bold; padding: 6px; text-align: right; border-top: 1px solid #000;">${formatAmount(totalAmount)}</td>
        </tr>
    </table>

    <!-- Amount Due -->
    <table class="no-border" style="width: 100%; margin: 20px 0; font-size: 11px;">
        <tr>
            <td style="font-weight: bold; padding: 6px;">Amount Due:</td>
            <td style="width: 120px; font-weight: bold; padding: 6px; text-align: right; border-top: 1px solid #000;">${formatAmount(totalAmount)}</td>
        </tr>
    </table>
</body>
</html>
    `;
}

export default getItemizedBillHtml;