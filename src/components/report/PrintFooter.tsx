export function PrintFooter({
  left = "PROGNOSIS HEALTH INFORMATION SYS.",
  right = "Requested By: pedro.merc Page counter(page)/counter(pages)",
  fontFamily = "Courier New, Courier, monospace",
  borderColor = "#888",
  borderWidth = "2px",
  marginBottom = "40px"
}) {
  return (
    <style>{`
      @media print {
        @page {
          margin: 8px 8px ${marginBottom} 8px;
          page-break-inside: avoid;
          @bottom-left {
            content: "${left}";
            padding-left: 40px;
            border-top: ${borderWidth} dotted ${borderColor};
            font-family: ${fontFamily};
          }
          @bottom-right {
            content: "${right.replace(/counter\(page\)/g, '" counter(page) "').replace(/counter\(pages\)/g, '" counter(pages) "')}";
            padding-right: 40px;
            border-top: ${borderWidth} dotted ${borderColor};
            font-family: ${fontFamily};
          }
        }
      }
    `}</style>
  );
}
