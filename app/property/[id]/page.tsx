"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Share2,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  MapIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"
import { PropertyCard, type PropertyData } from "@/components/property/property-card"
import { PropertyPDFGenerator } from "@/components/property/property-pdf-generator"
import { PropertyChartRenderer } from "@/components/property/property-chart-renderer"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/ui/error-boundary"

// A reusable error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Card className="border-red-200">
      <CardContent className="pt-6 text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
        <p className="text-gray-600">{error.message || "There was an error loading this content."}</p>
        <div className="mt-6 space-x-2">
          <Button onClick={resetErrorBoundary} className="bg-[#00008B] hover:bg-blue-900">
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Update the property details page to be more visually appealing and responsive

// First, update the PropertyDetailsContent component to be more visually appealing
function PropertyDetailsContent({ property }: { property: PropertyData }) {
  return (
    <Tabs defaultValue="details" className="mb-6">
      <TabsList className="mb-4 flex w-full overflow-x-auto no-scrollbar">
        <TabsTrigger value="details" className="flex-1 min-w-[120px]">
          Property Details
        </TabsTrigger>
        <TabsTrigger value="ownership" className="flex-1 min-w-[120px]">
          Ownership
        </TabsTrigger>
        <TabsTrigger value="legal" className="flex-1 min-w-[120px]">
          Legal Status
        </TabsTrigger>
        <TabsTrigger value="location" className="flex-1 min-w-[120px]">
          Location
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-full mr-4">
                <FileText className="h-5 w-5 text-[#00008B]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Property ID</p>
                <p className="font-medium">{property.property_id}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-[#00008B]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Registration Date</p>
                <p className="font-medium">{formatDate(property.registration_date)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-full mr-4">
                <Clock className="h-5 w-5 text-[#00008B]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Source</p>
                <Badge className="mt-0.5 bg-[#00008B]">{property.source}</Badge>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced property card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6"
        >
          <PropertyCard property={property} />
        </motion.div>
      </TabsContent>

      <TabsContent value="ownership">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 mb-4">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">Last updated: {formatDate(property.registration_date)}</span>
            </div>

            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
              <h3 className="text-xl font-bold mb-2">{property.owner}</h3>
              <p className="text-gray-600">Current Owner</p>
              <div className="mt-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  Verified Owner
                </Badge>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-2">Registration Details</h4>
              <p className="text-sm">Registered on {formatDate(property.registration_date)}</p>
              <p className="text-sm mt-1">{property.property_id}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h4 className="text-sm font-medium text-gray-500 mb-2">Property Rights</h4>
              <p className="text-sm">Full ownership rights with transferable title</p>
            </motion.div>
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="legal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Legal Status</h3>
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Encumbrance Status</span>
                  <span
                    className={`text-sm ${property.encumbrance.status === "No" ? "text-green-700" : "text-amber-700"}`}
                  >
                    {property.encumbrance.status}
                  </span>
                </div>
                {property.encumbrance.details && (
                  <p className="text-sm text-gray-600">{property.encumbrance.details}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-50 p-3 rounded-md"
              >
                <h4 className="text-sm font-medium mb-2">Legal Verification</h4>
                <div className="flex items-center">
                  <div className="h-2 flex-grow bg-green-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-green-600"
                    ></motion.div>
                  </div>
                  <span className="ml-2 text-sm text-green-700">Verified</span>
                </div>
              </motion.div>

              {property.disputed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-red-50 p-4 rounded-md border border-red-100"
                >
                  <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Dispute Information
                  </h3>
                  <p className="text-sm text-red-700">
                    This property is currently under legal dispute. The information provided is for reference purposes
                    only and should not be considered as legal advice. For more information, please contact the local
                    revenue office.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="location">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Location Details</h3>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start mt-4 mb-6"
            >
              <MapPin className="h-5 w-5 text-[#00008B] mt-1 mr-3" />
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-gray-700 mt-1">{property.address}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-50 p-3 rounded-md hover:shadow-md transition-shadow"
              >
                <h4 className="text-xs text-gray-500 uppercase">State</h4>
                <p className="font-medium mt-1">{property.state}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-gray-50 p-3 rounded-md hover:shadow-md transition-shadow"
              >
                <h4 className="text-xs text-gray-500 uppercase">District</h4>
                <p className="font-medium mt-1">{property.district}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-gray-50 p-3 rounded-md hover:shadow-md transition-shadow"
              >
                <h4 className="text-xs text-gray-500 uppercase">Taluka</h4>
                <p className="font-medium mt-1">{property.taluka}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-gray-50 p-3 rounded-md hover:shadow-md transition-shadow"
              >
                <h4 className="text-xs text-gray-500 uppercase">Village</h4>
                <p className="font-medium mt-1">{property.village}</p>
              </motion.div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Map</h4>
                <Button variant="link" size="sm" className="text-[#00008B]">
                  <MapIcon className="h-4 w-4 mr-1" />
                  View in Map Search
                </Button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="h-[200px] bg-gray-100 rounded-md flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-200"></div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <MapIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-gray-500">Interactive map preview loading...</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

// Main property details page component
export default function PropertyDetails() {
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [fetchRetries, setFetchRetries] = useState(0)
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      if (fetchRetries > 3) {
        setError("Failed to load property after multiple attempts")
        setIsLoading(false)
        return
      }

      try {
        // Add a delay only for retries to implement exponential backoff
        if (fetchRetries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, fetchRetries - 1)))
        }

        // Use the unified search API to get property details
        const response = await fetch(`/api/unified-search/${propertyId}`)

        if (!response.ok) {
          throw new Error(`Server returned error status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setProperty(null)
        } else if (data.property) {
          setProperty(data.property)

          // Log successful data fetch
          console.log("Property data fetched successfully:", {
            id: data.property.property_id,
            timestamp: new Date().toISOString(),
          })
        } else {
          throw new Error("Invalid data format received from server")
        }
      } catch (err) {
        console.error("Error fetching property:", err)

        // Increment retry counter and try again
        setFetchRetries((prev) => prev + 1)

        // Show toast notification only on first error to avoid spamming
        if (fetchRetries === 0) {
          toast.error("Connection issue", {
            description: "Attempting to reconnect...",
            duration: 3000,
          })
        }

        return fetchProperty() // Retry immediately with incremented counter
      } finally {
        if (fetchRetries >= 3 || !error) {
          setIsLoading(false)
        }
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId, error])

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

  const retryFetch = () => {
    setIsLoading(true)
    setError("")
    setFetchRetries(0)
  }

  return (
    <SearchLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <nav className="text-sm text-gray-500">
            <ol className="flex items-center">
              <li className="flex items-center">
                <Link href="/" className="hover:text-[#00008B]">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 mx-2" />
              <li className="flex items-center">
                <Link href="/search-results" className="hover:text-[#00008B]">
                  Search Results
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 mx-2" />
              <li className="text-gray-700 font-medium">Property Details</li>
            </ol>
          </nav>
        </div>

        {isLoading ? (
          <LoadingState fetchRetries={fetchRetries} />
        ) : error ? (
          <ErrorState error={error} onRetry={retryFetch} router={router} />
        ) : property ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Document Control Panel */}
            <Card className="overflow-hidden border-t-4 border-t-[#00008B]">
              <div className="bg-gradient-to-r from-[#00008B]/10 to-white p-4 flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#00008B]/10 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#00008B]">Property Card #{property.property_id}</h2>
                    <p className="text-sm text-gray-600">Last updated: {formatDate(property.registration_date)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>

                  {/* Use the enhanced PDF generator component */}
                  <PropertyPDFGenerator property={property} contentRef={contentRef} />
                </div>
              </div>
            </Card>

            {/* Main Property Detail Card */}
            <div ref={contentRef}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PropertyDetailsContent property={property} />
              </ErrorBoundary>

              {/* Add chart renderer component */}
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-semibold text-[#00008B] mb-4">Property Analytics</h2>
                    <PropertyChartRenderer
                      property={property}
                      onChartsRendered={(success) => {
                        if (!success) {
                          toast.warning("Some visualizations may not display correctly")
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </ErrorBoundary>
            </div>

            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-0">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>

              {/* Use the enhanced PDF generator component */}
              <PropertyPDFGenerator property={property} contentRef={contentRef} />
            </CardFooter>
          </motion.div>
        ) : (
          <NotFoundState router={router} />
        )}
      </div>
    </SearchLayout>
  )
}

// Loading state component
function LoadingState({ fetchRetries }: { fetchRetries: number }) {
  return (
    <div className="flex flex-col justify-center items-center py-10 bg-white rounded-lg shadow-sm">
      <svg
        className="animate-spin h-12 w-12 text-[#00008B]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-gray-600">Loading property details...</p>
      {fetchRetries > 0 && <p className="mt-2 text-amber-600">Retry attempt {fetchRetries}/3</p>}
    </div>
  )
}

// Error state component
function ErrorState({ error, onRetry, router }: { error: string; onRetry: () => void; router: any }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
        <div className="mt-6 space-x-3">
          <Button onClick={onRetry} className="bg-[#00008B] hover:bg-blue-900">
            Try Again
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Not found state component
function NotFoundState({ router }: { router: any }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Property Not Found</h3>
        <p className="text-gray-600">The property you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/")} className="mt-6 bg-[#00008B] hover:bg-blue-900">
          Return to Home
        </Button>
      </CardContent>
    </Card>
  )
}

function formatDate(dateString: string) {
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
