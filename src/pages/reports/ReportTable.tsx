"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ClaimData {
  visitNumber: string
  adjustmentDate: string
  description: string
  amount: string
  source: string
  transactionNumber: string
  transactionType: string
  financialClass: string
  patientStatus: string
}

const sampleData: ClaimData[] = [
  {
    visitNumber: "7148320",
    adjustmentDate: "2024-05-01T09:15:22",
    description: "CLAIM REVIEW",
    amount: "-11432.76",
    source: "DIRECT",
    transactionNumber: "618",
    transactionType: "adj",
    financialClass: "MC",
    patientStatus: "IC",
  },
  {
    visitNumber: "7148321",
    adjustmentDate: "2024-05-01T10:02:45",
    description: "CLAIM APPROVED",
    amount: "-11211.88",
    source: "DIRECT",
    transactionNumber: "619",
    transactionType: "adj",
    financialClass: "MC",
    patientStatus: "IY",
  },
  {
    visitNumber: "7148322",
    adjustmentDate: "2024-05-01T10:30:10",
    description: "",
    amount: "-10991.00",
    source: "MCO50353",
    transactionNumber: "620",
    transactionType: "adj",
    financialClass: "WC",
    patientStatus: "AIS",
  },
  {
    visitNumber: "7148323",
    adjustmentDate: "2024-05-01T11:45:55",
    description: "",
    amount: "-10770.12",
    source: "MCO50353",
    transactionNumber: "621",
    transactionType: "adj",
    financialClass: "WC",
    patientStatus: "AIS",
  },
  {
    visitNumber: "7148324",
    adjustmentDate: "2024-05-01T12:03:37",
    description: "",
    amount: "-10549.24",
    source: "MCO50353",
    transactionNumber: "622",
    transactionType: "adj",
    financialClass: "SP",
    patientStatus: "OM",
  },
  {
    visitNumber: "7148325",
    adjustmentDate: "2024-05-01T13:22:18",
    description: "",
    amount: "-10328.36",
    source: "MCO50353",
    transactionNumber: "623",
    transactionType: "adj",
    financialClass: "AC",
    patientStatus: "AOR",
  },
  {
    visitNumber: "7148326",
    adjustmentDate: "2024-05-01T14:40:41",
    description: "",
    amount: "-10107.48",
    source: "MCO50353",
    transactionNumber: "624",
    transactionType: "adj",
    financialClass: "AC",
    patientStatus: "AIC",
  },
  {
    visitNumber: "7148327",
    adjustmentDate: "2024-05-01T15:55:30",
    description: "",
    amount: "-9896.60",
    source: "DIRECT",
    transactionNumber: "625",
    transactionType: "adj",
    financialClass: "A1",
    patientStatus: "AIY",
  },
  {
    visitNumber: "7148328",
    adjustmentDate: "2024-05-01T16:10:05",
    description: "",
    amount: "-9675.72",
    source: "DIRECT",
    transactionNumber: "626",
    transactionType: "adj",
    financialClass: "A1",
    patientStatus: "AIY",
  },
  {
    visitNumber: "7148329",
    adjustmentDate: "2024-05-01T17:25:15",
    description: "",
    amount: "-9454.84",
    source: "DIRECT",
    transactionNumber: "627",
    transactionType: "adj",
    financialClass: "MC",
    patientStatus: "AIS",
  },
  {
    visitNumber: "7148330",
    adjustmentDate: "2024-05-01T18:11:59",
    description: "CLAIM REOPENED",
    amount: "-9233.96",
    source: "MCO50353",
    transactionNumber: "628",
    transactionType: "adj",
    financialClass: "MD",
    patientStatus: "IC",
  },
  {
    visitNumber: "7148331",
    adjustmentDate: "2024-05-01T19:45:25",
    description: "",
    amount: "-9013.08",
    source: "MCO50353",
    transactionNumber: "629",
    transactionType: "adj",
    financialClass: "MD",
    patientStatus: "IC",
  },
  {
    visitNumber: "7148332",
    adjustmentDate: "2024-05-01T20:33:16",
    description: "",
    amount: "-8792.20",
    source: "DIRECT",
    transactionNumber: "630",
    transactionType: "adj",
    financialClass: "MD",
    patientStatus: "AIS",
  },
  {
    visitNumber: "7148333",
    adjustmentDate: "2024-05-01T21:22:08",
    description: "CLAIM ADJUSTED",
    amount: "-8571.32",
    source: "DIRECT",
    transactionNumber: "631",
    transactionType: "adj",
    financialClass: "MM",
    patientStatus: "IC",
  },
  {
    visitNumber: "7148334",
    adjustmentDate: "2024-05-01T22:15:44",
    description: "CLAIM DENIED",
    amount: "-8350.44",
    source: "MCO50353",
    transactionNumber: "632",
    transactionType: "adj",
    financialClass: "WC",
    patientStatus: "DN",
  },
  {
    visitNumber: "7148335",
    adjustmentDate: "2024-05-01T23:08:12",
    description: "CLAIM PENDING",
    amount: "-8129.56",
    source: "DIRECT",
    transactionNumber: "633",
    transactionType: "adj",
    financialClass: "SP",
    patientStatus: "PD",
  },
  {
    visitNumber: "7148336",
    adjustmentDate: "2024-05-02T08:30:45",
    description: "",
    amount: "-7908.68",
    source: "MCO50353",
    transactionNumber: "634",
    transactionType: "adj",
    financialClass: "AC",
    patientStatus: "AOR",
  },
  {
    visitNumber: "7148337",
    adjustmentDate: "2024-05-02T09:22:33",
    description: "CLAIM PROCESSED",
    amount: "-7687.80",
    source: "DIRECT",
    transactionNumber: "635",
    transactionType: "adj",
    financialClass: "A1",
    patientStatus: "PR",
  },
  {
    visitNumber: "7148338",
    adjustmentDate: "2024-05-02T10:14:21",
    description: "",
    amount: "-7466.92",
    source: "MCO50353",
    transactionNumber: "636",
    transactionType: "adj",
    financialClass: "MC",
    patientStatus: "AIS",
  },
  {
    visitNumber: "7148339",
    adjustmentDate: "2024-05-02T11:06:09",
    description: "CLAIM REVIEW",
    amount: "-7246.04",
    source: "DIRECT",
    transactionNumber: "637",
    transactionType: "adj",
    financialClass: "MD",
    patientStatus: "IC",
  },
]

export function ReportTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = 125 // Based on the image showing "Page 1 of 125"

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sampleData.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 19).replace("T", " ")
  }

  const formatAmount = (amount: string) => {
    return Number.parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit number</TableHead>
                <TableHead>Adjustment date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Transaction number</TableHead>
                <TableHead>Transaction type</TableHead>
                <TableHead>Financial class</TableHead>
                <TableHead>Patient status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.visitNumber}>
                  <TableCell>{row.visitNumber}</TableCell>
                  <TableCell>{formatDate(row.adjustmentDate)}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{formatAmount(row.amount)}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>{row.transactionNumber}</TableCell>
                  <TableCell>{row.transactionType}</TableCell>
                  <TableCell>{row.financialClass}</TableCell>
                  <TableCell>{row.patientStatus}</TableCell>
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
