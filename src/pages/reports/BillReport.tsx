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

  const handlePreviewPDF = async () => {
    if (!reference) return
    setDownloading(true)
    try {
      const response = await fetch(`/report/pdf?reference=${reference}`, {
        headers: { Accept: "application/pdf" }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch {
      alert("Failed to preview PDF")
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!reference) return
    setDownloading(true)
    try {
      await exportReportPDF( reference)
    } catch {
      alert("Failed to download PDF")
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
          <Label htmlFor="reference">Reference number</Label>
          <input
            id="reference"
            type="text"
            placeholder="Enter reference number"
            value={reference}
            onChange={e => setReference(e.target.value)}
            className="border rounded px-3 py-2 mb-2 w-64"
          />
        </div>
        <Button
          onClick={handlePreviewPDF}
          className="bg-secondary h-10 text-secondary-foreground"
          disabled={downloading || !reference}
        >
          {downloading ? `Loading${'.'.repeat(dots)}` : "Preview PDF"}
        </Button>
        <Button
          onClick={handleDownloadPDF}
          className="bg-primary h-10 text-primary-foreground"
          disabled={downloading || !reference}
        >
          {downloading ? `Downloading${'.'.repeat(dots)}` : "Download PDF"}
        </Button>
      </div>
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
