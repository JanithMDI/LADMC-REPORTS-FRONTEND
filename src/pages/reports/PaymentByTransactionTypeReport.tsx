import { useState } from "react";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import Appbar from "../../components/ui/appbar";
import { fetchPaymentByTransactionType } from "../../services/reportService";

export default function PaymentByTransactionTypeReport() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const [startDate, setStartDate] = useState<Date | undefined>(dayBeforeYesterday);
  const [endDate, setEndDate] = useState<Date | undefined>(yesterday);
  const [reportData, setReportData] = useState<any>(null);
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
      const formatDateOnly = (d?: any) =>
        d ? d.toISOString().slice(0, 10) : undefined;
      const data = await fetchPaymentByTransactionType(
        formatDateOnly(startDate),
        formatDateOnly(endDate)
      );
      setReportData(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // PDF download logic here
  };

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
            style={{ alignSelf: "flex-end", cursor: reportData && Array.isArray(reportData) && reportData.length > 0 ? "pointer" : "not-allowed" }}
            onClick={handleDownloadPDF}
            disabled={!reportData || !Array.isArray(reportData) || reportData.length === 0}
          >
            Download PDF
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="mt-6">
          {reportData && Array.isArray(reportData) && (
            <table className="min-w-full border">
              <thead>
                <tr>
                  {Object.keys(reportData[0] || {}).map((key) => (
                    <th key={key} className="border px-2 py-1 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row: any, idx: number) => (
                  <tr key={idx}>
                    {Object.values(row).map((val:any, i) => (
                      <td key={i} className="border px-2 py-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && reportData && !Array.isArray(reportData) && (
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          )}
        </div>
      </section>
    </>
  );
}
