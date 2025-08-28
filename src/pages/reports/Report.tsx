"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { DatePicker } from "../../components/ui/date-picker"
import { ReportTable } from "./ReportTable"
import Appbar from "../../components/ui/appbar"

export default function Report() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 7, 10)) // Aug 10, 2025
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 7, 27)) // Aug 27, 2025

  const handleGenerate = () => {
    console.log("Generating report for:", { startDate, endDate })
  }

  const handleExportCSV = () => {
    console.log("Exporting CSV...")
  }

  return (
    <>
        <Appbar/>
        <section className="min-h-screen bg-background p-4 md:p-6 space-y-6">
            {/* Date Range Filters */}
            <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start-date">Start date</Label>
                    <DatePicker date={startDate} onDateChange={setStartDate} placeholder="Select start date" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="end-date">End date</Label>
                    <DatePicker date={endDate} onDateChange={setEndDate} placeholder="Select end date" />
                </div>

                <Button onClick={handleGenerate}  className="bg-primary h-10 text-primary-foreground ">
                    Generate
                </Button>
            </div>

            {/* Report Summary */}
            <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    Total report: <span className="font-medium text-foreground">1,245</span>
                </div>
                <Button variant="link" onClick={handleExportCSV} className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                    Export CSV
                </Button>
            </div>

            <ReportTable />
            
        </section>
    </>
  )
}