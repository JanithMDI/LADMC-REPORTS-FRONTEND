import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { exportReportPDF } from "../../services/reportService"
import { Label } from "../../components/ui/label"
import Loader from "../../components/ui/Loader"
import getItemizedBillHtml from "../../utils/getItemizedBillHtml"
import { getDomainConfig } from '../../utils/domainConfig'

export default function BillReport() {

  const [downloading, setDownloading] = useState(false)
  const [dots, setDots] = useState(1)
  const [reference, setReference] = useState("")
  const [error, setError] = useState("")
  const [records, setRecords] = useState<any[]>([])
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const config = getDomainConfig();

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
    // Custom footer: page number right with extra margin, report name center
    const now = new Date();
    const dateTimeStr = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const reportName = `${config.domain?.toUpperCase()} Medical Invoices`;
    const portraitCss = `
      <style>
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm 0mm 16mm 0mm;
          }
          body {
            margin: 0;
          }
          .custom-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100vw;
            height: 28px;
            background: #fff;
            z-index: 9999;
            border-top: 1px solid #888;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 500;
            padding-bottom: 0;
          }
          .footer-content {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 0 40px; /* Increased padding for page number space */
          }
          .footer-report {
            flex: 1;
            text-align: center;
            font-weight: 500;
          }
          .footer-page {
            position: absolute;
            right: 40px; /* Increased margin right */
            font-weight: 400;
          }
          body {
            padding-bottom: 28px;
          }
          .page-break {
            page-break-before: always;
            margin-top: 60px !important;
          }
        }
        @page {
          @bottom-center {
            content: "${reportName}";
          }
          @bottom-right {
            content: "Page " counter(page) " / " counter(pages);
            padding-right: 40px; /* Increased margin right */
          }
          @bottom-left { 
            content: "${dateTimeStr}";
            padding-left: 40px; /* Increased margin right */
         }
        }
      </style>
    `;
    // Optionally, you can add <div class="page-break"></div> in your HTML template where you want a new page with margin-top.
    // Or, if you want to add margin-top after every page except the first, you can add this class to your template logic.

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(portraitCss + previewHtml);
      printWindow.document.close();
      printWindow.focus();
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

