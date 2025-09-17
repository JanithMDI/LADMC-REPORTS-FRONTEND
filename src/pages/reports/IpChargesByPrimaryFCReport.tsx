import { useState } from "react";
import Appbar from "../../components/ui/appbar";
import { fetchIpChargesByPrimaryFC } from "../../services/reportService";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";

export default function IpChargesByPrimaryFCReport() {
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
      const formatDateOnly = (d?: any) => d ? d.toISOString().slice(0, 10) : undefined;
      const data = await fetchIpChargesByPrimaryFC(formatDateOnly(startDate), formatDateOnly(endDate));
      setReportData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mt-6">
          {reportData.length > 0 && (
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
          {!loading && reportData.length === 0 && (
            <div className="text-muted-foreground">No data to display.</div>
          )}
        </div>
      </section>
    </>
  );
}
