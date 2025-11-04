"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { exportReportCSV } from "../../services/reportService"

interface ReportRow {
  pat_ty_ds: string
  Description: string
  AHD_Patient_Type: string
  pat_nm: string
  fin_class: string
  med_rec_no: number
  acct_id: number
  adm_dt: string
  dschrg_dt: string
  revised_dischrg: string
  bill_dt: string
  sta_cd: string
  AHD_Days_OS: number | null
  AHD_Open_AR: number | null
  chg: number
  pmt: number
  adj: number
  balance: number
  chg_old: number
  pmt_old: number
  adj_old: number
  balance_old: number
}

interface ReportTableProps {
  data?: {
    lastDownloaded: string
    data: ReportRow[]
  }
  loading?: boolean
    startDate?: Date
    endDate?: Date
}

export function ReportTable({ data, loading, startDate, endDate }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [exporting, setExporting] = useState(false)
  const [exportDots, setExportDots] = useState(1)

  const isArray = Array.isArray(data?.data)
  const totalPages = isArray && data?.data.length > 0 ? Math.ceil(data?.data.length / itemsPerPage) : 1

  // Reset to page 1 when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    if (isArray) {
      if (data?.data.length > 0) {
        const lastStartIndex = (totalPages - 1) * itemsPerPage
        const lastEndIndex = lastStartIndex + itemsPerPage
        const lastDownloadedObjects = data?.data.slice(lastStartIndex, lastEndIndex)
        console.log("Last downloaded objects:", lastDownloadedObjects)
      }
    }
  }, [data, isArray, itemsPerPage, totalPages])

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
    } catch (err:any) {
      alert("Failed to export CSV")
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end mb-2">
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            {/* Skeleton table header */}
            <div className="h-10 bg-muted animate-pulse rounded mb-2" />
            {/* Skeleton table rows */}
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-muted animate-pulse rounded mb-2" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isArray || data?.data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No record to show</div>
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data?.data.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().slice(0, 19).replace("T", " ")
  }

  return (
    <div className="space-y-4">
      {/* Export CSV Button */}
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
      {/* Last Downloaded */}
      <div className="text-sm text-muted-foreground mb-2">
        Last Downloaded: {data?.lastDownloaded ? formatDate(data.lastDownloaded) : "N/A"}
      </div>
      {/* Table */}
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
                <TableHead>Status Code</TableHead>
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
                  <TableCell>{row.sta_cd || "N/A"}</TableCell>
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
          Page {currentPage} of {totalPages} ({data?.data.length || 0} total items)
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

          <div className="flex items-center gap-1">
            {(() => {
              const pages = [];
              const showEllipsis = totalPages > 5;
              
              if (!showEllipsis) {
                // Show all pages if total is 5 or less
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className="w-8 h-8 p-0"
                    >
                      {i}
                    </Button>
                  );
                }
              } else {
                // Show abbreviated pagination
                if (currentPage <= 3) {
                  for (let i = 1; i <= 4; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i}
                      </Button>
                    );
                  }
                  pages.push(<span key="ellipsis" className="px-2 text-sm text-muted-foreground">...</span>);
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  );
                } else if (currentPage >= totalPages - 2) {
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      className="w-8 h-8 p-0"
                    >
                      1
                    </Button>
                  );
                  pages.push(<span key="ellipsis" className="px-2 text-sm text-muted-foreground">...</span>);
                  for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i}
                      </Button>
                    );
                  }
                } else {
                  pages.push(
                    <Button
                      key={1}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      className="w-8 h-8 p-0"
                    >
                      1
                    </Button>
                  );
                  pages.push(<span key="ellipsis1" className="px-2 text-sm text-muted-foreground">...</span>);
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i}
                      </Button>
                    );
                  }
                  pages.push(<span key="ellipsis2" className="px-2 text-sm text-muted-foreground">...</span>);
                  pages.push(
                    <Button
                      key={totalPages}
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  );
                }
              }
              
              return pages;
            })()}
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
