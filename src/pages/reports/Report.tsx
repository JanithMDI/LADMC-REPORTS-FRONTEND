"use client"

import { useState } from "react"
import { DateRangeFilter } from "../../components/ui/DateRangeFilter"
import { ReportTable } from "./ReportTable"
import Appbar from "../../components/ui/appbar"
import { fetchReportPr1,fetchReportPayor } from "../../services/reportService"
import { useParams } from "react-router-dom"
import BillReport from "./BillReport"
import PayorReportTable from "./PayorReportTable"

export default function Report() {
  // Default dates: yesterday and day before yesterday
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  const [startDate, setStartDate] = useState<Date | undefined>(dayBeforeYesterday)
  const [endDate, setEndDate] = useState<Date | undefined>(yesterday)
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { reportType } = useParams()
  
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
      setError("End date should be greater than or equal to start date")
      return
    }
    setLoading(true)
    setError("")
    try {
      const formatDateOnly = (d?: any) =>
        d ? d.toISOString().slice(0, 10) : undefined
      let data
      if (reportType === "payor") {
        data = await fetchReportPayor(formatDateOnly(startDate), formatDateOnly(endDate))
      } else {
        data = await fetchReportPr1(formatDateOnly(startDate), formatDateOnly(endDate))
      }
      setReportData(data)
      console.log("Report data:", data)
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch report")
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
        <Appbar/>
        <section className="min-h-screen bg-background p-4 md:p-6 space-y-6">
            {/* Date Range Filters */}
            {reportType !== "bill" && (
                <>
              {/* Date Range Filters */}
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onGenerate={handleGenerate}
                loading={loading}
              />
            {error && <div className="text-red-500">{error}</div>}

            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Total Records: <span className="font-medium text-foreground">
                    {reportData?.totalCount ? reportData.totalCount.toLocaleString("en-US", { minimumFractionDigits: 0 }) : "0"}
                    </span>
                </div>
    
            </div>
            </>
            )}

            {/* Report Summary */}

            {/* Show error */}

            {reportType === "bill" && <BillReport />}
            {reportType === "report" && <ReportTable data={reportData} loading={loading} startDate={startDate} endDate={endDate} />}
            {reportType === "payor" && <PayorReportTable data={reportData} loading={loading} startDate={startDate} endDate={endDate} />}
        </section>
    </>
  )
}