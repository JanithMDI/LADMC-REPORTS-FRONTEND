import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { exportReportPDF } from "../../services/reportService"
import { Label } from "../../components/ui/label"
import Loader from "../../components/ui/Loader"
import getItemizedBillHtml from "../../utils/getItemizedBillHtml"

export default function BillReport() {
  const [downloading, setDownloading] = useState(false)
  const [dots, setDots] = useState(1)
  const [reference, setReference] = useState("")
  const [error, setError] = useState("")
  const [records, setRecords] = useState<any[]>([])
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)

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
      const res = await exportReportPDF(reference)
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setRecords(res.data)
        setPreviewHtml(getItemizedBillHtml(res.data))
      } else {
        setRecords([])
        setPreviewHtml(null)
        setError("No record found on this id")
      }
    } catch {
      setRecords([])
      setPreviewHtml(null)
      setError("No record found on this id")
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadPdfFile = () => {
    if (!previewHtml) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(previewHtml);
      printWindow.document.close();
      printWindow.focus();
      // Wait for content to render before printing
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (previewHtml) window.URL.revokeObjectURL(previewHtml)
    }
  }, [previewHtml])

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
          { "Show Bill" }
        </Button>
        <Button
          onClick={handleDownloadPdfFile}
          className="bg-secondary h-10 text-secondary-foreground"
          disabled={records.length === 0}
          style={{marginBottom: "8px"}}
        >
          { "Download PDF" }
        </Button>
      </div>
      {downloading && (
        <Loader message={`Loading ${'.'.repeat(dots)}`} />
      )}
      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
      {previewHtml && (
        <div className="border rounded mt-4 w-full" style={{ height: "900px" }}>
          <iframe
            srcDoc={previewHtml}
            title="Itemized Bill Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  )
}
