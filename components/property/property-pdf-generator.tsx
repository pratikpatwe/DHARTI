"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Check, Loader2, AlertCircle } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { PropertyData } from "./property-card"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import * as ReactDOM from "react-dom/client"

interface PropertyPDFGeneratorProps {
  property: PropertyData
  contentRef: React.RefObject<HTMLDivElement>
}

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export function PropertyPDFGenerator({ property, contentRef }: PropertyPDFGeneratorProps) {
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success" | "error">("idle")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [chartData, setChartData] = useState<any>(null)
  const [chartCanvases, setChartCanvases] = useState<{ [key: string]: HTMLCanvasElement | null }>({
    propertyValue: null,
    propertyType: null,
    propertyTrend: null,
  })
  const { toast } = useToast()

  // Colors for charts
  const COLORS = ["#00008B", "#FF9933", "#138808", "#6B46C1"]

  // Generate sample chart data based on property
  useEffect(() => {
    if (property) {
      // Property value comparison data (comparing with average in the area)
      const valueData = [
        { name: "This Property", value: property.valuation || 10000000 },
        { name: "Area Average", value: Math.round((property.valuation || 10000000) * 0.85) },
        { name: "District Average", value: Math.round((property.valuation || 10000000) * 0.7) },
      ]

      // Property type distribution in the area
      const typeData = [
        { name: "Residential", value: property.land_use === "Residential" ? 65 : 55 },
        { name: "Commercial", value: property.land_use === "Commercial" ? 30 : 20 },
        { name: "Industrial", value: property.land_use === "Industrial" ? 20 : 10 },
        { name: "Agricultural", value: property.land_use === "Agricultural" ? 15 : 5 },
      ]

      setChartData({
        valueData,
        typeData,
      })
    }
  }, [property])

  // Improve chart rendering in PDF generator
  // Update the renderChartsToCanvas function for better reliability

  const renderChartsToCanvas = async () => {
    try {
      // Create container divs for charts with improved styling
      const valueChartContainer = document.createElement("div")
      valueChartContainer.style.width = "600px" // Increased size for better quality
      valueChartContainer.style.height = "400px" // Increased size for better quality
      valueChartContainer.style.position = "absolute"
      valueChartContainer.style.left = "-9999px"
      valueChartContainer.style.border = "1px solid #eee"
      valueChartContainer.style.background = "white"
      valueChartContainer.style.padding = "20px" // Add padding for better rendering
      valueChartContainer.style.fontFamily = "Arial, sans-serif" // Specify font for consistency
      document.body.appendChild(valueChartContainer)

      const typeChartContainer = document.createElement("div")
      typeChartContainer.style.width = "600px" // Increased size for better quality
      typeChartContainer.style.height = "400px" // Increased size for better quality
      typeChartContainer.style.position = "absolute"
      typeChartContainer.style.left = "-9999px"
      typeChartContainer.style.border = "1px solid #eee"
      typeChartContainer.style.background = "white"
      typeChartContainer.style.padding = "20px" // Add padding for better rendering
      typeChartContainer.style.fontFamily = "Arial, sans-serif" // Specify font for consistency
      document.body.appendChild(typeChartContainer)

      // Add a third chart for property value trend
      const trendChartContainer = document.createElement("div")
      trendChartContainer.style.width = "600px" // Increased size for better quality
      trendChartContainer.style.height = "400px" // Increased size for better quality
      trendChartContainer.style.position = "absolute"
      trendChartContainer.style.left = "-9999px"
      trendChartContainer.style.border = "1px solid #eee"
      trendChartContainer.style.background = "white"
      trendChartContainer.style.padding = "20px" // Add padding for better rendering
      trendChartContainer.style.fontFamily = "Arial, sans-serif" // Specify font for consistency
      document.body.appendChild(trendChartContainer)

      // Render charts to containers using createRoot with improved error handling
      const renderValueChart = () => {
        return new Promise<void>((resolve, reject) => {
          try {
            // Format currency values for better readability
            const formatCurrency = (value) => {
              return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(value)
            }

            const chart = (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.valueData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Value"]} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Bar dataKey="value" name="Property Value (₹)" fill="#00008B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )

            // Use createRoot instead of ReactDOM.render
            const root = ReactDOM.createRoot(valueChartContainer)
            root.render(chart)

            // Give more time for chart to render
            setTimeout(() => resolve(), 1500)
          } catch (err) {
            console.error("Error rendering value chart:", err)
            // Resolve anyway to continue with other charts
            resolve()
          }
        })
      }

      const renderTypeChart = () => {
        return new Promise<void>((resolve, reject) => {
          try {
            const chart = (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                </PieChart>
              </ResponsiveContainer>
            )

            // Use createRoot instead of ReactDOM.render
            const root = ReactDOM.createRoot(typeChartContainer)
            root.render(chart)

            // Give more time for chart to render
            setTimeout(() => resolve(), 1500)
          } catch (err) {
            console.error("Error rendering type chart:", err)
            // Resolve anyway to continue with other charts
            resolve()
          }
        })
      }

      // Add a new function to render the trend chart
      const renderTrendChart = () => {
        return new Promise<void>((resolve, reject) => {
          try {
            // Create trend data if it doesn't exist
            if (!chartData.trendData) {
              const currentYear = new Date().getFullYear()
              const baseValue = property.valuation || 10000000
              chartData.trendData = [
                { year: currentYear - 4, value: Math.round(baseValue * 0.7) },
                { year: currentYear - 3, value: Math.round(baseValue * 0.8) },
                { year: currentYear - 2, value: Math.round(baseValue * 0.85) },
                { year: currentYear - 1, value: Math.round(baseValue * 0.95) },
                { year: currentYear, value: baseValue },
              ]
            }

            // Format currency values for better readability
            const formatCurrency = (value) => {
              return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(value)
            }

            const chart = (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.trendData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 14 }} />
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                    width={80}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Value"]} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Property Value"
                    stroke="#00008B"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )

            // Use createRoot instead of ReactDOM.render
            const root = ReactDOM.createRoot(trendChartContainer)
            root.render(chart)

            // Give more time for chart to render
            setTimeout(() => resolve(), 1500)
          } catch (err) {
            console.error("Error rendering trend chart:", err)
            // Resolve anyway to continue
            resolve()
          }
        })
      }

      // Render charts with better error handling
      if (chartData) {
        try {
          await renderValueChart()
          await renderTypeChart()
          await renderTrendChart()

          // Wait a bit longer to ensure charts are fully rendered
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Convert charts to canvas with improved settings
          const valueCanvas = await html2canvas(valueChartContainer, {
            logging: false,
            useCORS: true,
            scale: 2,
            allowTaint: true,
            backgroundColor: "#ffffff",
            onclone: (document) => {
              // Additional preprocessing for better rendering
              const container = document.body.querySelector('[style*="left: -9999px"]') as HTMLElement
              if (container) {
                container.style.width = "600px"
                container.style.height = "400px"
              }
              return document
            },
          })

          const typeCanvas = await html2canvas(typeChartContainer, {
            logging: false,
            useCORS: true,
            scale: 2,
            allowTaint: true,
            backgroundColor: "#ffffff",
            onclone: (document) => {
              // Additional preprocessing for better rendering
              const container = document.body.querySelector('[style*="left: -9999px"]') as HTMLElement
              if (container) {
                container.style.width = "600px"
                container.style.height = "400px"
              }
              return document
            },
          })

          const trendCanvas = await html2canvas(trendChartContainer, {
            logging: false,
            useCORS: true,
            scale: 2,
            allowTaint: true,
            backgroundColor: "#ffffff",
            onclone: (document) => {
              // Additional preprocessing for better rendering
              const container = document.body.querySelector('[style*="left: -9999px"]') as HTMLElement
              if (container) {
                container.style.width = "600px"
                container.style.height = "400px"
              }
              return document
            },
          })

          // Store canvases
          setChartCanvases({
            propertyValue: valueCanvas,
            propertyType: typeCanvas,
            propertyTrend: trendCanvas,
          })

          // Clean up
          document.body.removeChild(valueChartContainer)
          document.body.removeChild(typeChartContainer)
          document.body.removeChild(trendChartContainer)

          return true
        } catch (err) {
          console.error("Error in chart rendering process:", err)
          logError("Chart rendering process failed", err)

          // Clean up in case of error
          if (document.body.contains(valueChartContainer)) {
            document.body.removeChild(valueChartContainer)
          }
          if (document.body.contains(typeChartContainer)) {
            document.body.removeChild(typeChartContainer)
          }
          if (document.body.contains(trendChartContainer)) {
            document.body.removeChild(trendChartContainer)
          }

          // Even if chart rendering fails, we'll still allow PDF generation
          // Just without the charts
          return true
        }
      }
      return false
    } catch (err) {
      console.error("Error in overall chart rendering:", err)
      logError("Chart rendering failed", err)

      // Even if chart rendering fails, we'll still allow PDF generation
      // Just without the charts
      return true
    }
  }

  // Function to log errors with detailed information
  const logError = (message: string, error: any) => {
    const errorTime = new Date().toISOString()
    const errorObj = {
      timestamp: errorTime,
      message,
      propertyId: property?.property_id || "unknown",
      error: error?.toString() || "Unknown error",
      stack: error?.stack || "No stack trace",
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
      },
    }

    // Log to console for development
    console.error("PDF Generation Error:", errorObj)

    // In a production environment, you would send this to your logging service
    // Example: sendToLoggingService(errorObj)

    return `${message} (${errorTime})`
  }

  // Retry mechanism with exponential backoff
  const retryWithBackoff = async (fn: () => Promise<any>, retryCount: number) => {
    try {
      return await fn()
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
        console.log(`Retrying PDF generation in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`)

        await new Promise((resolve) => setTimeout(resolve, delay))
        setRetryCount(retryCount + 1)
        return retryWithBackoff(fn, retryCount + 1)
      } else {
        throw err
      }
    }
  }

  // Update the handleDownloadPDF function to be more resilient to chart rendering failures
  const handleDownloadPDF = async () => {
    if (!contentRef.current || !property) {
      toast({
        title: "Error",
        description: "Cannot generate PDF: Missing content or property data",
        variant: "destructive",
      })
      return
    }

    setDownloadStatus("downloading")
    setErrorDetails(null)
    setRetryCount(0)

    try {
      // First render charts to canvas
      let chartsRendered = false
      try {
        chartsRendered = await renderChartsToCanvas()
      } catch (chartErr) {
        console.error("Chart rendering failed but continuing with PDF generation:", chartErr)
        // Continue with PDF generation even if charts fail
      }

      // Then generate PDF with retry mechanism
      await retryWithBackoff(async () => {
        // Create a new PDF document
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        // Add header with logo and title
        pdf.setFillColor(0, 0, 139) // Deep blue color
        pdf.rect(0, 0, 210, 20, "F")
        pdf.setTextColor(255, 255, 255)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(16)
        pdf.text("DHARTI - Property Details Report", 105, 12, { align: "center" })

        // Add property ID and date
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(12)
        pdf.text(`Property ID: ${property.property_id}`, 15, 30)
        pdf.text(`Report Date: ${new Date().toLocaleDateString("en-IN")}`, 15, 37)

        // Add disputed warning if applicable
        if (property.disputed) {
          pdf.setFillColor(255, 240, 240)
          pdf.rect(15, 42, 180, 15, "F")
          pdf.setTextColor(220, 0, 0)
          pdf.setFontSize(11)
          pdf.text("WARNING: This property is currently under legal dispute.", 20, 50)
        }

        // Set starting y position for content
        let yPos = property.disputed ? 65 : 50

        // Add property details section
        pdf.setFillColor(240, 240, 250)
        pdf.rect(15, yPos, 180, 10, "F")
        pdf.setTextColor(0, 0, 139)
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
        pdf.text("Property Details", 20, yPos + 7)
        yPos += 15

        // Property details content
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")

        const addPropertyDetail = (label: string, value: string | number | undefined) => {
          const displayValue = value !== undefined && value !== null ? String(value) : "N/A"
          pdf.setFont("helvetica", "bold")
          pdf.text(`${label}:`, 20, yPos)
          pdf.setFont("helvetica", "normal")
          pdf.text(displayValue, 70, yPos)
          yPos += 7
        }

        addPropertyDetail("Owner", property.owner)
        addPropertyDetail("Address", property.address)
        addPropertyDetail("Survey Number", property.survey_number)
        addPropertyDetail("Area", `${property.area_sq_m} sq. meters`)
        addPropertyDetail("Land Use", property.land_use)
        addPropertyDetail("Registration Date", formatDate(property.registration_date))
        yPos += 5

        // Add location details section
        pdf.setFillColor(240, 240, 250)
        pdf.rect(15, yPos, 180, 10, "F")
        pdf.setTextColor(0, 0, 139)
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
        pdf.text("Location Details", 20, yPos + 7)
        yPos += 15

        // Location details content
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")

        addPropertyDetail("State", property.state)
        addPropertyDetail("District", property.district)
        addPropertyDetail("Taluka", property.taluka)
        addPropertyDetail("Village", property.village)
        yPos += 5

        // Add legal status section
        pdf.setFillColor(240, 240, 250)
        pdf.rect(15, yPos, 180, 10, "F")
        pdf.setTextColor(0, 0, 139)
        pdf.setFontSize(12)
        pdf.setFont("helvetica", "bold")
        pdf.text("Legal Status", 20, yPos + 7)
        yPos += 15

        // Legal status content
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")

        const encumbranceDetails = property.encumbrance?.details ? `: ${property.encumbrance.details}` : ""

        addPropertyDetail("Encumbrance Status", `${property.encumbrance?.status || "N/A"}${encumbranceDetails}`)
        addPropertyDetail("Source", property.source)
        yPos += 10

        // Add property valuation chart if available
        if (chartCanvases.propertyValue) {
          // Add chart section header
          pdf.setFillColor(240, 240, 250)
          pdf.rect(15, yPos, 180, 10, "F")
          pdf.setTextColor(0, 0, 139)
          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text("Property Valuation Analysis", 20, yPos + 7)
          yPos += 15

          // Add chart
          try {
            const imgData = chartCanvases.propertyValue.toDataURL("image/png")
            pdf.addImage(imgData, "PNG", 25, yPos, 160, 80)
            yPos += 85
          } catch (err) {
            console.error("Error adding valuation chart to PDF:", err)
            // Continue without the chart
            pdf.setTextColor(100, 100, 100)
            pdf.setFontSize(9)
            pdf.text("* Property valuation chart could not be generated", 20, yPos)
            yPos += 10
          }
        }

        // Add property type distribution chart if available
        if (chartCanvases.propertyType) {
          // Add chart section header
          pdf.setFillColor(240, 240, 250)
          pdf.rect(15, yPos, 180, 10, "F")
          pdf.setTextColor(0, 0, 139)
          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text("Property Type Distribution in Area", 20, yPos + 7)
          yPos += 15

          // Add chart
          try {
            const imgData = chartCanvases.propertyType.toDataURL("image/png")
            pdf.addImage(imgData, "PNG", 25, yPos, 160, 80)
            yPos += 85
          } catch (err) {
            console.error("Error adding property type chart to PDF:", err)
            // Continue without the chart
            pdf.setTextColor(100, 100, 100)
            pdf.setFontSize(9)
            pdf.text("* Property type distribution chart could not be generated", 20, yPos)
            yPos += 10
          }
        }

        // Add property value trend chart if available
        if (chartCanvases.propertyTrend) {
          // Add chart section header
          pdf.setFillColor(240, 240, 250)
          pdf.rect(15, yPos, 180, 10, "F")
          pdf.setTextColor(0, 0, 139)
          pdf.setFontSize(12)
          pdf.setFont("helvetica", "bold")
          pdf.text("Property Value Trend", 20, yPos + 7)
          yPos += 15

          // Add chart
          try {
            const imgData = chartCanvases.propertyTrend.toDataURL("image/png")
            pdf.addImage(imgData, "PNG", 25, yPos, 160, 80)
            yPos += 85
          } catch (err) {
            console.error("Error adding property trend chart to PDF:", err)
            // Continue without the chart
            pdf.setTextColor(100, 100, 100)
            pdf.setFontSize(9)
            pdf.text("* Property value trend chart could not be generated", 20, yPos)
            yPos += 10
          }
        }

        // Check if we need a new page for the disclaimer
        if (yPos > 240) {
          pdf.addPage()
          yPos = 20
        }

        // Add disclaimer
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(
          "Disclaimer: This document is for informational purposes only and does not constitute legal proof of ownership.",
          15,
          yPos + 5,
        )
        pdf.text("Please verify all information with the relevant government authorities.", 15, yPos + 10)

        // Add footer with DHARTI attribution
        pdf.setFillColor(0, 0, 139) // Deep blue color
        pdf.rect(0, 280, 210, 15, "F")
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(10)
        pdf.text("Report generated by DHARTI - Digital Housing & Asset Registry", 105, 288, { align: "center" })
        pdf.setFontSize(8)
        pdf.text(`Government of India • ${new Date().toISOString().split("T")[0]}`, 105, 292, { align: "center" })

        // Save the PDF
        pdf.save(`property-${property.property_id}.pdf`)
      }, retryCount)

      setDownloadStatus("success")
      toast({
        title: "Success",
        description: "Property report has been downloaded successfully.",
      })

      // Reset status after showing success
      setTimeout(() => {
        setDownloadStatus("idle")
      }, 2000)
    } catch (err) {
      const errorMessage = logError("Failed to generate PDF", err)
      setErrorDetails(errorMessage)
      setDownloadStatus("error")

      toast({
        title: "PDF Generation Failed",
        description:
          "There was an error generating your PDF. Please try again or contact support if the issue persists.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateString || "N/A"
    }
  }

  // Render troubleshooting tips when error occurs
  const renderTroubleshootingTips = () => {
    return (
      <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
        <h4 className="font-medium flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" /> Troubleshooting Tips:
        </h4>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Check your internet connection and try again</li>
          <li>Refresh the page and attempt the download again</li>
          <li>Try using a different browser</li>
          <li>
            If the issue persists, please contact support with error code:{" "}
            {errorDetails?.split(" (")[1]?.replace(")", "") || "unknown"}
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      {errorDetails && renderTroubleshootingTips()}

      <Button
        onClick={handleDownloadPDF}
        className={`${downloadStatus === "error" ? "bg-red-600 hover:bg-red-700" : "bg-[#00008B] hover:bg-blue-900"}`}
        disabled={downloadStatus === "downloading"}
      >
        {downloadStatus === "idle" ? (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Property Report
          </>
        ) : downloadStatus === "downloading" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {retryCount > 0 ? `Retrying (${retryCount}/${MAX_RETRIES})...` : "Generating PDF..."}
          </>
        ) : downloadStatus === "success" ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            PDF Downloaded
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            Try Again
          </>
        )}
      </Button>
    </div>
  )
}
