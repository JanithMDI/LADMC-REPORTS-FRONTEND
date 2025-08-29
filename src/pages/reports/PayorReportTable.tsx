"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { exportReportCSV } from "../../services/reportService"

interface PayorReportRow {
  pat_ty_ds: string
  Description: string
  AHD_Patient_Type: string
  pat_nm: string
  fin_class: string
  med_rec_no: string
  acct_id: number
  adm_dt: string
  dschrg_dt: string | null
  revised_dischrg: string | null
  bill_dt: string | null
  sta_cd: string | null
  chg: string
  pmt: string
  adj: string
  balance: string
  chg_old: string
  pmt_old: string
  adj_old: string
  balance_old: string
  LOS: number
  AHD_Days_OS: number
  AHD_Open_AR: number
  AHR_OPEN_DAYS: string
  Primary_Carrier_Name: string | null
  Primary_Policy_No: string | null
  Secondary_Carrier_Name: string | null
  Secondary_Policy_No: string | null
  Tertiary_Carrier_Name: string | null
  Tertiary_Policy_No: string | null
  birth_date: string
}

interface PayorReportTableProps {
  data?: PayorReportRow[]
  loading?: boolean
  startDate?: Date
  endDate?: Date
}

export function PayorReportTable({ data, loading, startDate, endDate }: PayorReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [exporting, setExporting] = useState(false)
  const [exportDots, setExportDots] = useState(1)

  const isArray = Array.isArray(data)
  const totalPages = isArray && data && data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 1

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (exporting) {
      interval = setInterval(() => {
        setExportDots((prev) => (prev < 5 ? prev + 1 : 1))
      }, 400)
    } else {
      setExportDots(1)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [exporting])

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const formatDateOnly = (d?: any) =>
        d ? d.toISOString().slice(0, 10) : undefined
      await exportReportCSV(formatDateOnly(startDate), formatDateOnly(endDate))
    } catch {
      alert("Failed to export CSV")
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    // ...existing skeleton code...
    return (
      <div className="space-y-4">
        {/* ...skeleton UI... */}
      </div>
    )
  }

  if (!isArray || !data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No record to show</div>
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().slice(0, 19).replace("T", " ")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button
          variant="link"
          onClick={handleExportCSV}
          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
          disabled={exporting}
        >
          {exporting ? `Exporting${'.'.repeat(exportDots)}` : "Export CSV"}
        </Button>
      </div>
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Financial Class</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Discharge Date</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Medical Record No</TableHead>
                <TableHead>LOS</TableHead>
                <TableHead>Open Days</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Primary Carrier</TableHead>
                <TableHead>Primary Policy</TableHead>
                <TableHead>Charge</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Adjustment</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.acct_id}>
                  <TableCell>{row.pat_nm || "N/A"}</TableCell>
                  <TableCell>{row.pat_ty_ds || "N/A"}</TableCell>
                  <TableCell>{row.Description || "N/A"}</TableCell>
                  <TableCell>{row.fin_class || "N/A"}</TableCell>
                  <TableCell>{row.adm_dt ? formatDate(row.adm_dt) : "N/A"}</TableCell>
                  <TableCell>{row.dschrg_dt ? formatDate(row.dschrg_dt) : "N/A"}</TableCell>
                  <TableCell>{row.acct_id ?? "N/A"}</TableCell>
                  <TableCell>{row.med_rec_no ?? "N/A"}</TableCell>
                  <TableCell>{row.LOS ?? "N/A"}</TableCell>
                  <TableCell>{row.AHR_OPEN_DAYS || "N/A"}</TableCell>
                  <TableCell>{row.birth_date || "N/A"}</TableCell>
                  <TableCell>{row.Primary_Carrier_Name || "N/A"}</TableCell>
                  <TableCell>{row.Primary_Policy_No || "N/A"}</TableCell>
                  <TableCell>{row.chg ?? "N/A"}</TableCell>
                  <TableCell>{row.pmt ?? "N/A"}</TableCell>
                  <TableCell>{row.adj ?? "N/A"}</TableCell>
                  <TableCell>{row.balance ?? "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1 ">
            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            <span className="px-2 text-sm text-muted-foreground">...</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 p-0">
              {totalPages}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">/ Page</span>
        </div>
      </div>
    </div>
  )
}
