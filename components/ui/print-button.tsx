"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>
  fileName?: string
}

export function PrintButton({ contentRef, fileName = "property-details" }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: fileName,
    onAfterPrint: () => console.log("Printed successfully"),
  })

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`${fileName}.pdf`)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
      <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download PDF</span>
      </Button>
    </div>
  )
}
