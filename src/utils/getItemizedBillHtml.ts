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
                        <td style="border: 1px solid black;">RODRICK D. WOODS</td>
                        <td style="border: 1px solid black;font-weight: bold; background-color: #B7B7B7;">Date</td>
                        <td style="border: 1px solid black; border-right: 0;">05-08-2024</td>
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
                <p style="font-size: 16px;">RODRICK D. WOODS <br> 4333 TORRANCE BLVD <br> TORRANCE CARE CTR W <br> TORRANCE, CA 90503 0</p>
            </td>
            <td style="width: 50%;  padding:0; border: 1px solid black; border-top: 0; vertical-align: top;">
                <table>
                    <tr style="background-color: #B7B7B7;">
                        <td style="padding: 10px; border: 1px solid black; border-top: 0; border-left: 0; font-weight: bold;">Visit number</td>
                        <td style="padding: 10px; border: 1px solid black; border-top: 0; font-weight: bold;" >Admit Date</td>
                        <td style="width: 40%; padding: 10px; border: 1px solid black; border-top: 0; font-weight: bold;">Discharge Date</td>
                    </tr>
                    <tr>
                        <td>7155066</td>
                        <td>03-04-2024</td>
                        <td>03-04-2024</td>
                    </tr>
                    <tr style="background-color: #B7B7B7;">
                        <td style="padding: 10px; border: 1px solid black; border-left: 0; font-weight: bold;">Date of Birth</td>
                        <td colspan="2" style="padding: 10px; border: 1px solid black; font-weight: bold;">Physician</td>
                    </tr>
                    <tr>
                        <td>10-02-1950</td>
                        <td>MISCELLANEOUS MD</td>
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
            <td style="padding-bottom: 0;">1. HEALTH NET - MEDI-CAL</td>
            <td style="padding-bottom: 0;">HEALTH NET MCAL DIRE</td>
            <td style="padding-bottom: 0;">98941518E</td>
        </tr>
        <tr>
            <td style="border-bottom: 0;">2. MEDICARE O/P</td>
            <td style="border-bottom: 0;">MEDICARE PART B ONLY</td>
            <td style="border-bottom: 0; ">2FD7HN1WU46</td>
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
        <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 15%; padding-bottom: 0; ">03-04-24</td>
            <td style="width: 10%; padding-bottom: 0; ">750301150</td>
            <td style="width: 35%; padding-bottom: 0; ">VALPROIC ACID</td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: center;">1</td>
            <td style="width: 10%; padding-bottom: 0; "></td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: right;">196.35</td>
        </tr>
        <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 10%; padding-bottom: 0; ">03-04-24</td>
            <td style="width: 10%; padding-bottom: 0; ">750301543</td>
            <td style="width: 40%; padding-bottom: 0; ">HGB A1C</td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: center;">1</td>
            <td style="width: 10%; padding-bottom: 0; "></td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: right;">155.93</td>
        </tr>
        <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 10%; padding-bottom: 0; ">03-04-24</td>
            <td style="width: 10%; padding-bottom: 0; ">750301543</td>
            <td style="width: 40%; padding-bottom: 0; ">HGB A1C</td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: center;">1</td>
            <td style="width: 10%; padding-bottom: 0; "></td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: right;">155.93</td>
        </tr>
        
        <tr style="font-family: Courier New; font-size: 16px;">
            <td>LAB</td>
            <td colspan="4" style="text-align: center; ">DEPT 750 TOTALS</td>
            <td  style="border-top: 1px solid black; text-align: right;">1,589.90</td>
        </tr>

        <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 10%; padding-bottom: 0; ">03-04-24</td>
            <td style="width: 10%; padding-bottom: 0; ">750301150</td>
            <td style="width: 40%; padding-bottom: 0; ">VALPROIC ACID</td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: center;">1</td>
            <td style="width: 10%; padding-bottom: 0; "></td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: right;">196.35</td>
        </tr>
        <tr style="font-family: Courier New; font-size: 16px;">
            <td style="width: 10%; padding-bottom: 0; ">03-04-24</td>
            <td style="width: 10%; padding-bottom: 0; ">750301543</td>
            <td style="width: 40%; padding-bottom: 0; ">HGB A1C</td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: center;">1</td>
            <td style="width: 10%; padding-bottom: 0; "></td>
            <td style="width: 10%; padding-bottom: 0; ; text-align: right;">155.93</td>
        </tr>
        
        <tr style="font-family: Courier New; font-size: 16px;">
            <td>LAB - 2</td>
            <td colspan="4" style="text-align: center; ">DEPT 750 TOTALS</td>
            <td style="border-top: 1px solid black; text-align: right;">1,589.90</td>
        </tr>
        
        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="5">Total Charges</td>
            <td style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">1,589.90</td>
        </tr>
        <tr style="font-family: Courier New; font-size: 16px;">
            <td colspan="4" style="text-align: center;">Amount Due:</td>
            <td colspan="2" style="border: 1px solid black; border-left: 0px; border-right: 0px; text-align: right;">1,589.90</td>
        </tr>
    </table>
</body>
</html>
    `;
}

export default getItemizedBillHtml;