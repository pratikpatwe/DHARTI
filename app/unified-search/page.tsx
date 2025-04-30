"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, AlertTriangle, Database, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function UnifiedSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("any")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setError("Please enter a search query")
      return
    }

    setIsLoading(true)
    setError("")
    setSearchResults(null)

    try {
      // Build query parameters based on search type
      const params = new URLSearchParams()

      if (searchType === "id") {
        params.append("id", searchQuery)
      } else if (searchType === "owner") {
        params.append("owner", searchQuery)
      } else if (searchType === "address") {
        params.append("address", searchQuery)
      } else {
        // "any" - try all search types
        // We'll let the API handle this by checking all fields
        params.append("query", searchQuery)
      }

      // Call the unified search API
      const response = await fetch(`/api/unified-search?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError("An error occurred while searching")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-2 border-[#00008B]/10 mb-8">
              <CardHeader className="bg-[#00008B]/5">
                <CardTitle className="text-2xl text-[#00008B]">Unified Property Search</CardTitle>
                <CardDescription>Search across multiple property databases (CERSAI and MCA21)</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Input
                        placeholder="Enter property ID, owner name, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Search by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Field</SelectItem>
                          <SelectItem value="id">Property ID</SelectItem>
                          <SelectItem value="owner">Owner Name</SelectItem>
                          <SelectItem value="address">Address</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="bg-[#00008B] hover:bg-blue-900 w-full md:w-auto px-8"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card>
                  <CardHeader className="bg-[#00008B]/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-[#00008B]">Search Results</CardTitle>
                        <CardDescription>
                          Found {searchResults.results.length} properties matching your search
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {searchResults.meta.sources.map((source: string) => (
                          <Badge key={source} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            <Database className="h-3 w-3 mr-1" />
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {searchResults.results.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                        <p className="text-gray-500">We couldn't find any properties matching your search criteria.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {searchResults.results.map((property: any, index: number) => (
                          <Card key={index} className="overflow-hidden border border-gray-200">
                            <div className="flex items-center justify-between bg-gray-50 px-6 py-3">
                              <h3 className="font-medium text-[#00008B]">{property.property_id}</h3>
                              <div className="flex items-center gap-2">
                                {property.source.includes(",") ? (
                                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                    Multiple Sources
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">{property.source}</Badge>
                                )}

                                {property.data_quality.has_conflicts && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Data Conflicts
                                  </Badge>
                                )}

                                {property.disputed && (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Disputed
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <CardContent className="p-6">
                              <Tabs defaultValue="basic">
                                <TabsList className="mb-4">
                                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  {property.data_quality.has_conflicts && (
                                    <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
                                  )}
                                </TabsList>

                                <TabsContent value="basic">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Owner</h4>
                                      <p className="text-base font-medium">{property.owner_name}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                                      <p className="text-base">{property.address}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Area</h4>
                                      <p className="text-base">{property.area_sq_m} sq.m</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Land Use</h4>
                                      <p className="text-base">{property.land_use}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h4>
                                      <p className="text-base flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                        {formatDate(property.registration_date)}
                                      </p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                                      <p className="text-base flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                        {formatDate(property.last_updated)}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="details">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Survey Number</h4>
                                      <p className="text-base">{property.survey_number}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Encumbrance</h4>
                                      <p className="text-base">
                                        {property.encumbrance.status}: {property.encumbrance.details || "None"}
                                      </p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                                      <p className="text-base">
                                        {property.village}, {property.taluka}, {property.district}, {property.state}
                                      </p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Valuation</h4>
                                      <p className="text-base">₹{property.valuation.toLocaleString("en-IN")}</p>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Data Quality</h4>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          className={`${
                                            property.data_quality.completeness > 80
                                              ? "bg-green-100 text-green-800 border-green-200"
                                              : property.data_quality.completeness > 60
                                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                : "bg-red-100 text-red-800 border-red-200"
                                          }`}
                                        >
                                          {property.data_quality.completeness}% Complete
                                        </Badge>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Source</h4>
                                      <p className="text-base flex items-center">
                                        <Database className="h-4 w-4 mr-1 text-gray-400" />
                                        {property.source}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>

                                {property.data_quality.has_conflicts && (
                                  <TabsContent value="conflicts">
                                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                                      <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Data Conflicts Detected
                                      </h4>
                                      <ul className="space-y-2">
                                        {property.data_quality.conflict_details?.map((conflict: string, i: number) => (
                                          <li key={i} className="text-sm text-yellow-700">
                                            • {conflict}
                                          </li>
                                        ))}
                                      </ul>
                                      <p className="text-xs text-yellow-700 mt-3">
                                        Note: Conflicts have been resolved using our priority system. The displayed
                                        values represent the most reliable data.
                                      </p>
                                    </div>
                                  </TabsContent>
                                )}
                              </Tabs>

                              <div className="mt-6 flex justify-end">
                                <Link href={`/property-details/${property.property_id}`}>
                                  <Button className="bg-[#00008B] hover:bg-blue-900">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Full Details
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
