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

export async function fetchReportPayor(startDate: any, endDate: any) {
  const response = await api.get("/report/payor", {
    params: {
      startDate,
      endDate,
    },
  })
  return response.data
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


export async function fetchPaymentByTransactionType(startDate: any, endDate: any) {
  const response = await api.get("/report/payment-by-transaction-type", {
    params: { startDate, endDate },
  });
  return response.data;
}

export async function fetchAdjustmentByTransactionType(startDate: any, endDate: any) {
  const response = await api.get("/report/adjustment-by-transaction-type", {
    params: { startDate, endDate },
  });
  return response.data;
}

export async function fetchInpCharity(startDate: any, endDate: any) {
  const response = await api.get("/report/inp-charity", {
    params: { startDate, endDate },
  });
  return response.data;
}