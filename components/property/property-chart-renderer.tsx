"use client"

import { useEffect, useRef, useState } from "react"
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
import type { PropertyData } from "./property-card"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, BarChart2, PieChartIcon, TrendingUp } from "lucide-react"

interface PropertyChartRendererProps {
  property: PropertyData
  onChartsRendered?: (success: boolean) => void
}

export function PropertyChartRenderer({ property, onChartsRendered }: PropertyChartRendererProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [renderAttempts, setRenderAttempts] = useState(0)
  const [renderSuccess, setRenderSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeChart, setActiveChart] = useState<"value" | "type" | "trend">("value")
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const valueChartRef = useRef<HTMLDivElement>(null)
  const typeChartRef = useRef<HTMLDivElement>(null)
  const trendChartRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const [fallbackMode, setFallbackMode] = useState(false)

  // Colors for charts
  const COLORS = ["#00008B", "#FF9933", "#138808", "#6B46C1"]

  // Generate sample chart data based on property
  useEffect(() => {
    if (property) {
      try {
        setIsLoading(true)

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

        // Property value trend data (simulated historical data)
        const currentYear = new Date().getFullYear()
        const baseValue = property.valuation || 10000000
        const trendData = [
          { year: currentYear - 4, value: Math.round(baseValue * 0.7) },
          { year: currentYear - 3, value: Math.round(baseValue * 0.8) },
          { year: currentYear - 2, value: Math.round(baseValue * 0.85) },
          { year: currentYear - 1, value: Math.round(baseValue * 0.95) },
          { year: currentYear, value: baseValue },
        ]

        setChartData({
          valueData,
          typeData,
          trendData,
        })

        // Simulate loading time for better UX
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error generating chart data:", err)
        setIsLoading(false)
        setFallbackMode(true)
        if (onChartsRendered) onChartsRendered(false)
      }
    }
  }, [property, onChartsRendered])

  // Check if charts rendered successfully with a more reliable approach
  useEffect(() => {
    if (!chartData || isLoading) return

    // Function to check if charts are rendered
    const checkChartsRendered = () => {
      try {
        // Force a small delay to ensure DOM is updated
        setTimeout(() => {
          // First, check if our refs have content
          const valueChartHasContent = valueChartRef.current?.querySelector(".recharts-surface")
          const typeChartHasContent = typeChartRef.current?.querySelector(".recharts-surface")
          const trendChartHasContent = trendChartRef.current?.querySelector(".recharts-surface")

          console.log("Chart refs check:", {
            valueChart: !!valueChartHasContent,
            typeChart: !!typeChartHasContent,
            trendChart: !!trendChartHasContent,
          })

          if (valueChartHasContent || typeChartHasContent || trendChartHasContent) {
            console.log("Charts rendered successfully via refs")
            setRenderSuccess(true)
            if (onChartsRendered) onChartsRendered(true)
            return
          }

          // Fallback to container check
          if (chartContainerRef.current) {
            const svgElements = chartContainerRef.current.querySelectorAll("svg")
            const chartElements = chartContainerRef.current.querySelectorAll(".recharts-wrapper")
            const surfaceElements = chartContainerRef.current.querySelectorAll(".recharts-surface")

            console.log("Chart render check:", {
              svgCount: svgElements.length,
              wrapperCount: chartElements.length,
              surfaceCount: surfaceElements.length,
              chartData: !!chartData,
            })

            if (svgElements.length >= 1 || chartElements.length >= 1 || surfaceElements.length >= 1) {
              console.log("Charts rendered successfully via container")
              setRenderSuccess(true)
              if (onChartsRendered) onChartsRendered(true)
            } else if (renderAttempts < 3) {
              setRenderAttempts((prev) => prev + 1)
              const delay = 1000 * (renderAttempts + 1) // Longer delays between attempts
              console.log(`Chart render attempt ${renderAttempts + 1}/3, checking again in ${delay}ms`)
              setTimeout(checkChartsRendered, delay)
            } else {
              console.error("Failed to render charts after multiple attempts", {
                svgElements: svgElements.length,
                chartElements: chartElements.length,
                chartData: !!chartData,
              })

              // Switch to fallback mode after failed attempts
              setFallbackMode(true)

              // Even if charts didn't render properly, we'll still allow PDF generation
              if (onChartsRendered) onChartsRendered(true)
            }
          }
        }, 500)
      } catch (err) {
        console.error("Error checking chart rendering:", err)
        setFallbackMode(true)
        // If there's an error in the check, we'll still allow PDF generation
        if (onChartsRendered) onChartsRendered(true)
      }
    }

    // Start checking after a longer initial delay
    setTimeout(checkChartsRendered, 1500)
  }, [chartData, renderAttempts, onChartsRendered, isLoading])

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-8 mt-6">
        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="text-center py-4 text-gray-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
        <p>Unable to prepare charts. Please try refreshing the page.</p>
      </div>
    )
  }

  // Fallback mode renders static tables instead of charts
  if (fallbackMode) {
    return (
      <div className="space-y-8 mt-6">
        <div>
          <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Valuation Comparison</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {chartData.valueData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Type Distribution in Area</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Property Type</th>
                  <th className="px-4 py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {chartData.typeData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{item.value}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Value Trend</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {chartData.trendData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
          <p className="font-medium text-blue-800">Interactive charts are currently unavailable.</p>
          <p className="text-blue-700 mt-1">
            The data is displayed in table format instead. You can still download the PDF report with this information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={chartContainerRef} className="space-y-8 mt-6">
      {/* Chart selector for mobile */}
      {isMobile && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveChart("value")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeChart === "value" ? "bg-[#00008B] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
            >
              <BarChart2 className="h-4 w-4 inline mr-1" />
              <span className="hidden sm:inline">Valuation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveChart("type")}
              className={`px-4 py-2 text-sm font-medium ${
                activeChart === "type" ? "bg-[#00008B] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              } border-t border-b border-gray-200`}
            >
              <PieChartIcon className="h-4 w-4 inline mr-1" />
              <span className="hidden sm:inline">Types</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveChart("trend")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeChart === "trend" ? "bg-[#00008B] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
            >
              <TrendingUp className="h-4 w-4 inline mr-1" />
              <span className="hidden sm:inline">Trend</span>
            </button>
          </div>
        </div>
      )}

      {/* Property Valuation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isMobile && activeChart !== "value" ? 0 : 1,
          y: isMobile && activeChart !== "value" ? 20 : 0,
        }}
        transition={{ duration: 0.4 }}
        className={`${isMobile && activeChart !== "value" ? "hidden" : "block"}`}
      >
        <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Valuation Comparison</h3>
        <div ref={valueChartRef} className="h-[300px] w-full border border-gray-100 rounded-md p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.valueData} margin={{ top: 20, right: 30, left: isTablet ? 0 : 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: isTablet ? 10 : 12 }} />
              <YAxis
                tickFormatter={(value) =>
                  isTablet ? `₹${(value / 1000000).toFixed(0)}M` : `₹${(value / 1000000).toFixed(1)}M`
                }
                width={isTablet ? 50 : 80}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Value"]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #f0f0f0",
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Property Value"
                fill="#00008B"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Property Type Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isMobile && activeChart !== "type" ? 0 : 1,
          y: isMobile && activeChart !== "type" ? 20 : 0,
        }}
        transition={{ duration: 0.4, delay: isMobile ? 0 : 0.2 }}
        className={`${isMobile && activeChart !== "type" ? "hidden" : "block"}`}
      >
        <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Type Distribution in Area</h3>
        <div ref={typeChartRef} className="h-[300px] w-full border border-gray-100 rounded-md p-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.typeData}
                cx="50%"
                cy="50%"
                labelLine={!isTablet}
                outerRadius={isTablet ? 70 : 80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={isTablet ? undefined : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationDuration={1500}
                animationBegin={300}
              >
                {chartData.typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #f0f0f0",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Property Value Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isMobile && activeChart !== "trend" ? 0 : 1,
          y: isMobile && activeChart !== "trend" ? 20 : 0,
        }}
        transition={{ duration: 0.4, delay: isMobile ? 0 : 0.4 }}
        className={`${isMobile && activeChart !== "trend" ? "hidden" : "block"}`}
      >
        <h3 className="text-lg font-medium mb-4 text-[#00008B]">Property Value Trend</h3>
        <div ref={trendChartRef} className="h-[300px] w-full border border-gray-100 rounded-md p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.trendData} margin={{ top: 20, right: 30, left: isTablet ? 0 : 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: isTablet ? 10 : 12 }} />
              <YAxis
                tickFormatter={(value) =>
                  isTablet ? `₹${(value / 1000000).toFixed(0)}M` : `₹${(value / 1000000).toFixed(1)}M`
                }
                width={isTablet ? 50 : 80}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Value"]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #f0f0f0",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Property Value"
                stroke="#00008B"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationBegin={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
