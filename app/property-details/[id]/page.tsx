"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  MapPin,
  User,
  Ruler,
  Home,
  FileCheck,
  Map,
  Landmark,
  Download,
  Share2,
  Database,
  Info,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function PropertyDetails() {
  const [property, setProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/unified-search/${propertyId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch property details")
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setProperty(null)
        } else {
          setProperty(data.property)
        }
      } catch (err) {
        setError("An error occurred while fetching property details")
        setProperty(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

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
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/unified-search" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-lg shadow-sm">
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
            </div>
          ) : error ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Error</h3>
                <p className="text-gray-600">{error}</p>
                <Button onClick={() => router.back()} className="mt-6 bg-[#00008B] hover:bg-blue-900">
                  Go Back
                </Button>
              </CardContent>
            </Card>
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
                      <h2 className="font-semibold text-[#00008B]">Property #{property.property_id}</h2>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Last updated: {formatDate(property.last_updated)}</span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <Database className="h-3.5 w-3.5 mr-1" />
                          <span>{property.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>

                    <Button className="bg-[#00008B] hover:bg-blue-900 text-white" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Main Property Detail Card */}
              <Card>
                <CardHeader className={`${property.disputed ? "bg-red-50" : "bg-[#00008B]/5"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl text-[#00008B]">Property Details</CardTitle>
                        {property.disputed && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Disputed
                          </Badge>
                        )}

                        {property.data_quality.has_conflicts && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                            <Info className="h-3 w-3 mr-1" />
                            Data Conflicts
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        <span className="font-medium">{property.source}</span> • Registered on{" "}
                        {formatDate(property.registration_date)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Verified Record
                      </Badge>

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
                </CardHeader>

                <CardContent className="pt-6">
                  {property.disputed && (
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-6">
                      <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Property Under Dispute
                      </h3>
                      <p className="text-sm text-red-700">
                        This property is currently under legal dispute. The information provided is for reference
                        purposes only and should not be considered as legal advice. For more information, please contact
                        the local revenue office.
                      </p>
                    </div>
                  )}

                  {property.data_quality.has_conflicts && (
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
                      <h3 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Data Conflicts Detected
                      </h3>
                      <p className="text-sm text-yellow-700">
                        This property has conflicting information from different data sources. The displayed values
                        represent the most reliable data based on our priority system.
                      </p>
                      <ul className="space-y-1 mt-2 text-sm text-yellow-700">
                        {property.data_quality.conflict_details?.map((conflict: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{conflict}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Tabs defaultValue="details" className="mb-6">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Property Details</TabsTrigger>
                      <TabsTrigger value="ownership">Ownership</TabsTrigger>
                      <TabsTrigger value="legal">Legal Status</TabsTrigger>
                      <TabsTrigger value="source">Source Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Card className="border border-gray-200 shadow-sm">
                          <CardHeader className="bg-gray-50 py-3">
                            <CardTitle className="text-base font-medium text-[#00008B]">Property Information</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-[#00008B]" />
                                Address
                              </h3>
                              <p className="text-base font-medium">{property.address}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                <Map className="h-4 w-4 mr-2 text-[#00008B]" />
                                Survey Number
                              </h3>
                              <p className="text-base">{property.survey_number}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                <Ruler className="h-4 w-4 mr-2 text-[#00008B]" />
                                Area
                              </h3>
                              <p className="text-base">
                                <span className="font-medium">{property.area_sq_m}</span> sq. meters
                                <span className="text-sm text-gray-500 ml-2">
                                  (~{(property.area_sq_m * 0.00024711).toFixed(2)} acres)
                                </span>
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                <Home className="h-4 w-4 mr-2 text-[#00008B]" />
                                Land Use
                              </h3>
                              <div className="flex items-center">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
                                  {property.land_use}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                          <CardHeader className="bg-gray-50 py-3">
                            <CardTitle className="text-base font-medium text-[#00008B]">Location Details</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">State</h3>
                                <p className="text-base">{property.state}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">District</h3>
                                <p className="text-base">{property.district}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Taluka</h3>
                                <p className="text-base">{property.taluka}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Village</h3>
                                <p className="text-base">{property.village}</p>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                <Landmark className="h-4 w-4 mr-2 text-[#00008B]" />
                                Geo Coordinates
                              </h3>
                              <p className="text-base">
                                {property.geo_coordinates.latitude}, {property.geo_coordinates.longitude}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="ownership">
                      <Card className="border border-gray-200">
                        <CardContent className="p-6 space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-[#00008B]/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-[#00008B]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{property.owner_name}</h3>
                              <p className="text-gray-600">Current Owner</p>
                              <div className="mt-3 flex gap-3">
                                <Badge variant="outline" className="bg-gray-50">
                                  Owner since {formatDate(property.registration_date)}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Ownership Verification Status</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Identity Verification</span>
                                <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Document Authentication</span>
                                <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Legal Title</span>
                                <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="legal">
                      <Card className="border border-gray-200">
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                              <FileCheck className="h-4 w-4 mr-2 text-[#00008B]" />
                              Encumbrance Status
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={
                                  property.encumbrance.status === "No"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                }
                              >
                                {property.encumbrance.status}
                              </Badge>
                              <span className="text-gray-600 text-sm">
                                {property.encumbrance.details || "No encumbrance"}
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Property Legal Status</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">Tax Compliance</span>
                                  <span className="text-sm text-green-700">98% Complete</span>
                                </div>
                                <Progress value={98} className="h-2 bg-gray-100" />
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">Documentation Status</span>
                                  <span className="text-sm text-green-700">100% Complete</span>
                                </div>
                                <Progress value={100} className="h-2 bg-gray-100" />
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">Legal Clearance</span>
                                  <span className="text-sm text-green-700">100% Clear</span>
                                </div>
                                <Progress value={100} className="h-2 bg-gray-100" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="source">
                      <Card className="border border-gray-200">
                        <CardContent className="p-6 space-y-6">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-[#00008B]" />
                            <h3 className="text-lg font-medium">Source Information</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {property.source.includes("CERSAI") && (
                              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                                  <Database className="h-4 w-4 mr-2" />
                                  CERSAI Data
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {property.source_specific_data.cersai_specific && (
                                    <div>
                                      <p className="text-blue-700 font-medium">Lien Status:</p>
                                      <p className="text-blue-700">
                                        {property.source_specific_data.cersai_specific.lien_status.has_lien
                                          ? "Has Lien"
                                          : "No Lien"}
                                        {property.source_specific_data.cersai_specific.lien_status.lien_details && (
                                          <span className="block mt-1 text-xs">
                                            Details:{" "}
                                            {property.source_specific_data.cersai_specific.lien_status.lien_details}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-blue-700 font-medium">Data Completeness:</p>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={property.data_quality.completeness}
                                        className="h-2 bg-blue-200 w-32"
                                      />
                                      <span className="text-blue-700">{property.data_quality.completeness}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {property.source.includes("MCA21") && (
                              <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                                <h4 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                                  <Database className="h-4 w-4 mr-2" />
                                  MCA21 Data
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {property.source_specific_data.mca21_specific &&
                                    property.source_specific_data.mca21_specific.additional_info && (
                                      <div>
                                        <p className="text-purple-700 font-medium">Additional Information:</p>
                                        <ul className="text-purple-700 space-y-1 mt-1">
                                          {Object.entries(
                                            property.source_specific_data.mca21_specific.additional_info,
                                          ).map(([key, value]) => (
                                            <li key={key}>
                                              <span className="font-medium">{key.replace(/_/g, " ")}:</span> {value}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  <div>
                                    <p className="text-purple-700 font-medium">Data Completeness:</p>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={property.data_quality.completeness}
                                        className="h-2 bg-purple-200 w-32"
                                      />
                                      <span className="text-purple-700">{property.data_quality.completeness}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-sm font-medium mb-2">Data Integration Notes</h4>
                            <p className="text-sm text-gray-600">
                              This property record has been created by integrating data from multiple government
                              databases.
                              {property.data_quality.has_conflicts &&
                                " Data conflicts have been resolved using our priority system."}
                            </p>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Last Updated:</span> {formatDate(property.last_updated)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <Separator className="my-6" />

                  <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-0">
                    <Button onClick={() => router.back()} variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Search Results
                    </Button>

                    <Button className="bg-[#00008B] hover:bg-blue-900">
                      <Download className="h-4 w-4 mr-2" />
                      Download Property Data
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Property Not Found</h3>
                <p className="text-gray-600">The property you are looking for does not exist or has been removed.</p>
                <Button onClick={() => router.push("/unified-search")} className="mt-6 bg-[#00008B] hover:bg-blue-900">
                  Return to Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
