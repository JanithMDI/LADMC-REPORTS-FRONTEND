import React, { useState } from "react";
import Appbar from "../../components/ui/appbar";
import { fetchOpChargesByPrimaryFC } from "../../services/reportService";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { PrintFooter } from "../../components/report/PrintFooter";

function groupByFinClass(data: any[]) {
  const groups: Record<string, any[]> = {};
  data.forEach((row) => {
    const key = `${row.fin_class}||${row.fin_description}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });
  return groups;
}

function calcGroupTotals(rows: any[]) {
  return {
    patient_count: rows.reduce((sum, r) => sum + Number(r.patient_count || 0), 0),
    patient_days: rows.reduce((sum, r) => sum + Number(r.patient_days || 0), 0),
    charges: rows.reduce((sum, r) => sum + Number(r.charges || 0), 0),
  };
}

export default function OpChargesByPrimaryFCReport() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const [startDate, setStartDate] = useState<Date | undefined>(dayBeforeYesterday);
  const [endDate, setEndDate] = useState<Date | undefined>(yesterday);
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate && startDate >= today) {
      setError("Start date should be before today");
      return;
    }
    if (endDate && endDate >= today) {
      setError("End date should be before today");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      setError("End date should be greater than or equal to start date");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formatDateOnly = (d?: Date) => d ? d.toISOString().slice(0, 10) : undefined;
      const data = await fetchOpChargesByPrimaryFC(formatDateOnly(startDate), formatDateOnly(endDate));
      setReportData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const reportHtml = document.getElementById("opcharges-report-html");
    if (!reportHtml) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Summary By Primary Fin Class/ PS</title>
          <style>
            body{ font-family: Courier New, Courier, monospace; font-size: 16px; }
            table { width: 100%; padding: 0; margin: 0; border-spacing: 10px; border-collapse: separate; vertical-align: top; }
            p { margin: 0; padding: 0; }
            tr,td { padding: 0; }
            @media print {
              th, td, tr.charge-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 10px; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${reportHtml.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Grand totals
  const grandTotals = {
    patient_count: reportData.reduce((sum, r) => sum + Number(r.patient_count || 0), 0),
    patient_days: reportData.reduce((sum, r) => sum + Number(r.patient_days || 0), 0),
    charges: reportData.reduce((sum, r) => sum + Number(r.charges || 0), 0),
  };

  const now = new Date();
  const grouped = groupByFinClass(reportData);

  return (
    <>
      <Appbar />
      <section className="min-h-screen bg-background p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onGenerate={handleGenerate}
            loading={loading}
          />
          <button
            className="h-10 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            style={{ alignSelf: "flex-end", cursor: reportData.length > 0 ? "pointer" : "not-allowed" }}
            onClick={handleDownloadPDF}
            disabled={reportData.length === 0}
          >
            Download PDF
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="mt-6">
          {reportData.length > 0 && (
            <div
              id="opcharges-report-html"
              style={{
                background: "#fff",
                padding: "16px",
                fontFamily: "Courier New, Courier, monospace",
                position: "relative",
                minHeight: "1100px" // Increase minHeight to move footer up
              }}
            >
              <PrintFooter marginBottom="80px" />
              <style>{`
                body{
                  font-family: Courier New; font-size: 16px; 
                }
                table {
                  width: 100%; padding: 0; margin: 0; border-spacing: 10px; border-collapse: separate; vertical-align: top;
                }
                p {
                  margin: 0; padding: 0;
                }
                tr,td {
                  padding: 0;
                }
                @media print {
                  th, td, tr.charge-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  @page { margin: 10px; page-break-inside: avoid;}
                }
              `}</style>
              {/* Header */}
              <table style={{ borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "20%" }}>
                      <p>Date: {formatDate(now)}</p>
                      <p>Time: {formatTime(now)}</p>
                    </td>
                    <td style={{ width: "40%", textAlign: "center" }}>
                      <p>Patient Summary By Primary Fin Class/ PS</p>
                      <p>L.A. DOWNTOWN MEDICAL CENTER</p>
                    </td>
                    <td style={{ width: "20%", textAlign: "right" }}>
                      {/* <p>Page:1</p> */}
                      <p>o_psum8</p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: 0 }}>
                      <p>
                        Processing Dates From: {formatDate(startDate)} Through {formatDate(endDate)}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                    <td>chmadmtr . pat stat</td>
                  </tr>
                </tbody>
              </table>
              {/* Divider */}
              <table style={{ borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: "2px dashed #888",
                        borderLeft: 0,
                        borderRight: 0,
                        padding: "8px 0",
                      }}
                    >
                      <p>Total Patients By Patient Status For Each Primary Financial Class</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Data Table */}
              <table>
                <tbody>
                  {/* Table Header */}
                  <tr>
                    <td align="center">Patient Status Code</td>
                    <td align="right">Patients</td>
                    <td align="right">Days</td>
                    <td align="right">Charges</td>
                  </tr>
                  {/* Data Groups */}
                  {Object.entries(grouped).map(([key, rows]) => {
                    const [fin_class, fin_description] = key.split("||");
                    const groupTotals = calcGroupTotals(rows);
                    return (
                      <React.Fragment key={key}>
                        {/* Group title */}
                        <tr>
                          <td colSpan={4}>Financial Class : {fin_class} {fin_description}</td>
                        </tr>
                        {/* Group Data */}
                        {rows.map((row, i) => (
                          <tr key={i}>
                            <td style={{ paddingLeft: "8%" }}>
                              {row.pat_status} - {row.ps_description}
                            </td>
                            <td align="right">{row.patient_count}</td>
                            <td align="right">{row.patient_days}</td>
                            <td align="right">{Number(row.charges).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                        {/* Group total */}
                        <tr>
                          <td></td>
                          <td align="right">------</td>
                          <td align="right">------</td>
                          <td align="right">------</td>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: "12%" }}>Financial Class Total:</td>
                          <td align="right">{groupTotals.patient_count}</td>
                          <td align="right">{groupTotals.patient_days}</td>
                          <td align="right">{groupTotals.charges.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        </tr>
                        {/* Divider between groups */}
                        <tr>
                          <td colSpan={4}>&nbsp;</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                  {/* Grand total */}
                  <tr>
                    <td></td>
                    <td align="right">------</td>
                    <td align="right">------</td>
                    <td align="right">------</td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "12%" }}>Grand Total:</td>
                    <td align="right">{grandTotals.patient_count.toLocaleString("en-US")}</td>
                    <td align="right">{grandTotals.patient_days.toLocaleString("en-US")}</td>
                    <td align="right">
                      ${grandTotals.charges.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {!loading && reportData.length === 0 && (
            <div className="text-muted-foreground">No data to display.</div>
          )}
        </div>
      </section>
    </>
  );
}
