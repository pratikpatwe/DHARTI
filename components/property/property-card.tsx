import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Building, Calendar, FileCheck, Home, Landmark, Map, MapPin, Ruler, User } from "lucide-react"
import { forwardRef } from "react"

export type PropertyData = {
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

interface PropertyCardProps {
  property: PropertyData
}

export const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(({ property }, ref) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div ref={ref} className="print:shadow-none print:max-w-full">
      <Card className="print:shadow-none print:border-none">
        <CardHeader className={`${property.disputed ? "bg-red-50" : "bg-[#00008B]/5"} print:bg-white`}>
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
              </div>
              <p className="text-sm text-gray-500">
                {property.property_id} • {property.source}
              </p>
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
                This property is currently under legal dispute. The information provided is for reference purposes only
                and should not be considered as legal advice.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2 text-[#00008B]" />
                  Owner
                </h3>
                <p className="text-lg font-semibold">{property.owner}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-[#00008B]" />
                  Address
                </h3>
                <p className="text-base">{property.address}</p>
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
                <p className="text-base">{property.area_sq_m} sq. meters</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Home className="h-4 w-4 mr-2 text-[#00008B]" />
                  Land Use
                </h3>
                <p className="text-base">{property.land_use}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#00008B]" />
                  Registration Date
                </h3>
                <p className="text-base">{formatDate(property.registration_date)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-[#00008B]" />
                  Encumbrance
                </h3>
                <p className="text-base">
                  {property.encumbrance.status}: {property.encumbrance.details || "No encumbrance"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-[#00008B]" />
                  Location Details
                </h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">State:</span> {property.state}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">District:</span> {property.district}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Taluka:</span> {property.taluka}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Village:</span> {property.village}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  <Landmark className="h-4 w-4 mr-2 text-[#00008B]" />
                  Source
                </h3>
                <p className="text-base">{property.source}</p>
              </div>
            </div>
          </div>

          <Separator className="my-8 print:hidden" />
        </CardContent>
      </Card>
    </div>
  )
})

PropertyCard.displayName = "PropertyCard"
