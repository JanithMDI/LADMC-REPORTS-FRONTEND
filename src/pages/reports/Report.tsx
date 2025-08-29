"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { DatePicker } from "../../components/ui/date-picker"
import { ReportTable } from "./ReportTable"
import Appbar from "../../components/ui/appbar"
import { fetchReportPr1,fetchReportPayor } from "../../services/reportService"
import { useParams } from "react-router-dom"
import BillReport from "./BillReport"
import PayorReportTable from "./PayorReportTable"

export default function Report() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 7, 10)) // Aug 10, 2025
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 7, 27)) // Aug 27, 2025
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { reportType } = useParams()
  
  const handleGenerate = async () => {
    if (startDate && endDate && endDate < startDate) {
      setError("End date should be greater than or equal to start date")
      return
    }
    setLoading(true)
    setError("")
    try {
      const formatDateOnly = (d?: Date) =>
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
              <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="start-date">Start date</Label>
                      <DatePicker date={startDate} onDateChange={setStartDate} placeholder="Select start date" />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="end-date">End date</Label>
                      <DatePicker date={endDate} onDateChange={setEndDate} placeholder="Select end date" />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    className="bg-primary h-10 text-primary-foreground "
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </Button>
              </div>
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