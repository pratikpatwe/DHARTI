"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertTriangle, FileText, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"

type Property = {
  owner: string
  property_id: string
  address: string
  survey_number: string
  area_sq_m: number
  land_use: string
  registration_date: string
  encumbrance: {
    status: string
    details: string
  }
  source: string
  state: string
  district: string
  taluka: string
  village: string
  disputed: boolean
}

export default function SearchResults() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Build the API URL with all search parameters
        const apiUrl = `/api/unified-search?${searchParams.toString()}`

        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch properties")
        }

        const data = await response.json()

        // Check if we got results from the unified search API
        if (data.results && Array.isArray(data.results)) {
          setProperties(data.results)
        } else if (Array.isArray(data)) {
          setProperties(data)
        } else if (data.property && data.property.property_id) {
          // If we got a single property, redirect to its details page
          router.push(`/property/${data.property.property_id}`)
          return
        } else if (data.error) {
          setError(data.error)
          setProperties([])
        } else {
          setProperties([])
        }
      } catch (err) {
        setError("An error occurred while fetching properties")
        setProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams, router])

  // Format the search query for display
  const getSearchDescription = () => {
    if (searchParams.has("id")) {
      return `Property ID: ${searchParams.get("id")}`
    } else if (searchParams.has("owner")) {
      let desc = `Owner: ${searchParams.get("owner")}`
      if (searchParams.has("state")) desc += `, State: ${searchParams.get("state")}`
      if (searchParams.has("district")) desc += `, District: ${searchParams.get("district")}`
      if (searchParams.has("taluka")) desc += `, Taluka: ${searchParams.get("taluka")}`
      return desc
    } else if (searchParams.has("address")) {
      return `Address/Locality: ${searchParams.get("address")}`
    } else if (searchParams.has("disputed")) {
      let desc = "Disputed Properties"
      if (searchParams.has("state")) desc += `, State: ${searchParams.get("state")}`
      if (searchParams.has("district")) desc += `, District: ${searchParams.get("district")}`
      return desc
    }
    return "All Properties"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <SearchLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <Link href="/" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-sm text-gray-500">
            Search: <span className="font-medium">{getSearchDescription()}</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader className="bg-[#00008B]/5">
              <CardTitle className="text-2xl text-[#00008B]">Search Results</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Searching for properties..."
                  : properties.length === 0
                    ? "No properties found matching your search criteria"
                    : `Found ${properties.length} ${properties.length === 1 ? "property" : "properties"} matching your search criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-[#00008B]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500">{error}</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No properties found matching your search criteria.</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search parameters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.property_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`hover:shadow-md transition-shadow ${
                          property.disputed ? "border-red-200" : "border-gray-200"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[#00008B]">{property.owner}</h3>
                                {property.disputed && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Disputed
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                <span className="font-medium">{property.property_id}</span>
                                <span className="mx-2">•</span>
                                <span>{property.source}</span>
                              </div>

                              <div className="flex items-start gap-1 text-sm text-gray-600 mb-1">
                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                                <span>{property.address}</span>
                              </div>

                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                <span>Registered: {formatDate(property.registration_date)}</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
                              <Button
                                onClick={() => router.push(`/property/${property.property_id}`)}
                                className="bg-[#00008B] hover:bg-blue-900"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SearchLayout>
  )
}
