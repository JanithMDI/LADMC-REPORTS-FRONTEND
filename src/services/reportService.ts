import api from "../lib/axios"

export async function fetchReportPr1(startDate: any, endDate: any) {
  const response = await api.get("/report/pr1", {
    params: {
      startDate,
      endDate,
    },
  })
  return response.data
}

export async function exportReportCSV(startDate: any, endDate: any) {
  const response = await api.get("/report/pr1/csv", {
    responseType: "blob",
    headers: {
      Accept: "text/csv",
    },
    params: {
      startDate,
      endDate,
    },
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "report.csv")
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function exportReportPDF( reference?: string) {
  const response = await api.get("/report/pdf", {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
    params: {
      reference,
    },
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "report.pdf")
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
