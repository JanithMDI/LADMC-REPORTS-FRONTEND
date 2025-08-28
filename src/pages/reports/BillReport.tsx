import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { exportReportPDF } from "../../services/reportService"
import { Label } from "../../components/ui/label"


interface BillReportProps {
  startDate?: Date
  endDate?: Date
}

export default function BillReport({ startDate, endDate }: BillReportProps) {
  const [downloading, setDownloading] = useState(false)
  const [dots, setDots] = useState(1)
  const [reference, setReference] = useState("")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (downloading) {
      interval = setInterval(() => {
        setDots((prev) => (prev < 5 ? prev + 1 : 1))
      }, 400)
    } else {
      setDots(1)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [downloading])


  const handleDownloadPDF = async () => {
    if (!reference) return
    setDownloading(true)
    setError("")
    try {
      await exportReportPDF(reference)
    } catch {
      setError("No record found on this id")
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="reference">Visit Number</Label>
          <input
            id="reference"
            type="text"
            placeholder="Enter Visit Number"
            value={reference}
            onChange={e => setReference(e.target.value)}
            className="border rounded px-3 py-2 mb-2 w-64"
          />
        </div>
        <Button
          onClick={handleDownloadPDF}
          className="bg-primary h-10 text-primary-foreground"
          disabled={downloading || !reference}
          style={{marginBottom: "8px"}}
        >
          {downloading ? `Downloading${'.'.repeat(dots)}` : "Download PDF"}
        </Button>
      </div>
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      {pdfUrl && (
        <div className="border rounded mt-4 w-full" style={{ height: "600px" }}>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  )
}
