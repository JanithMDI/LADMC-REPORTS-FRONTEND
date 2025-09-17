import api from "../lib/axios"

async function fetchReportWithDates(endpoint: string, startDate: Date, endDate: Date) {
  const response = await api.get(endpoint, {
    params: { startDate, endDate },
  })
  return response.data
}

export async function fetchReportPr1(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/pr1", startDate, endDate)
}

export async function fetchReportPayor(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/payor", startDate, endDate)
}

export async function exportReportCSV(startDate: Date, endDate: Date) {
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
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const randomNum = Math.floor(Math.random() * 1000000);
    const filename = `${randomNum}-${timestamp}.csv`;
    link.setAttribute("download", filename);
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function exportReportPDF(reference?: string) {
  const response = await api.get("/report/pdf", {
    params: { reference },
  })
  return response.data
}

export async function downloadReportPDF(reference?: string) {
  const response = await api.get("/report/pdf", {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
    params: { reference },
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${reference || "report"}-${timestamp}.pdf`;
  link.setAttribute("download", filename);
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}


export async function fetchPaymentByTransactionType(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/payment-by-transaction-type", startDate, endDate)
}

export async function fetchAdjustmentByTransactionType(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/adjustment-by-transaction-type", startDate, endDate)
}

export async function fetchInpCharity(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/inp-charity", startDate, endDate)
}

export async function fetchOpChargesByPrimaryFC(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/op-charges-by-primary-fc", startDate, endDate)
}

export async function fetchIpChargesByPrimaryFC(startDate: Date, endDate: Date) {
  return fetchReportWithDates("/report/ip-charges-by-primary-fc", startDate, endDate)
}