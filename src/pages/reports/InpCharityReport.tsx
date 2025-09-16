import { useState } from "react";
import Appbar from "../../components/ui/appbar";
import { fetchInpCharity } from "../../services/reportService";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";

function formatDate(date?: Date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
function formatTime(date?: Date) {
  if (!date) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InpCharityReport() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const [startDate, setStartDate] = useState<Date | undefined>(
    dayBeforeYesterday
  );
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
      const formatDateOnly = (d?: Date) =>
        d ? d.toISOString().slice(0, 10) : undefined;
      const data = await fetchInpCharity(
        formatDateOnly(startDate),
        formatDateOnly(endDate)
      );
      setReportData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalTransactions = reportData.reduce(
    (sum, row) => sum + Number(row.count || 0),
    0
  );
  const totalAmount = reportData.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  const handleDownloadPDF = () => {
    window.print();
  };

  const now = new Date();

  return (
    <>
      <Appbar />
      <section className="min-h-screen bg-background p-4 md:p-6 space-y-6">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onGenerate={handleGenerate}
          loading={loading}
        />
        {error && <div className="text-red-500">{error}</div>}
        {reportData.length > 0 && (
          <div>
            <button
              className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
            <div
              id="inp-charity-report-html"
              style={{ background: "#fff", padding: "16px" }}
            >
              <style>{`
                body{
                  font-family: Courier New; font-size: 16px; 
                }
                table {
                  width: 100%; border-collapse: collapse; padding: 0; margin: 0;border-spacing: 14px ;border-collapse: separate; vertical-align: top;
                }
                p {
                  margin: 0; padding: 0;
                }
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #inp-charity-report-html, #inp-charity-report-html * {
                    visibility: visible;
                  }
                  #inp-charity-report-html {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100vw;
                  }
                  th, td, tr.charge-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  @page { margin: 8px; page-break-inside: avoid;}
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
                      <p>Adjustments By Transaction Type</p>
                      <p>L.A. DOWNTOWN MEDICAL CENTER</p>
                    </td>
                    <td style={{ width: "20%", textAlign: "right" }}>
                      <p>Page:1</p>
                      <p>adj/o_padjt</p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: 0 }}>
                      <p>
                        Processing Dates From: {formatDate(startDate)} Through{" "}
                        {formatDate(endDate)}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Divider */}
              <table style={{ borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td colSpan={3} style={{ borderBottom: "2px dashed #888" }}>
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Data */}
              <table>
                <tbody>
                  {reportData.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        HOS Transaction Type: {row.type} - {row.description}
                      </td>
                      <td align="right" style={{ width: "40%" }}>
                        Total Transactions : {row.count}
                      </td>
                      <td align="right">
                        {Number(row.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>&nbsp;</td>
                  </tr>
                  {/* Total */}
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      Total Adjustments By Processing Date For All Facilities
                      Selected
                    </td>
                    <td align="right" style={{ borderTop: "2px dashed #888" }}>
                      {totalTransactions.toLocaleString("en-US")}
                    </td>
                    <td align="right" style={{ borderTop: "2px dashed #888" }}>
                      {totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!loading && reportData.length === 0 && (
          <div className="text-muted-foreground">No data to display.</div>
        )}
      </section>
    </>
  );
}
