"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  MapPin,
  MapIcon,
  Search,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  MapIcon as MapIcon2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"
import dynamic from "next/dynamic"
import { useToast } from "@/components/ui/use-toast"

// Define a type for property data
interface PropertyData {
  property_id: string
  owner_name: string
  address: string
  area_sq_m: number
  land_use: string
  registration_date: string
  source: string
  disputed: boolean
  geo_coordinates: {
    latitude: number
    longitude: number
  }
}

// Define a type for map markers
interface MapMarker {
  id: string
  position: [number, number]
  title: string
  owner: string
  address: string
  disputed: boolean
}

// Dynamically import Leaflet components with no SSR to avoid hydration issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
})
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })
const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false })

// Loading placeholder for the map
function MapLoadingPlaceholder() {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-md flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 text-[#00008B] animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading map...</p>
      <p className="text-gray-500 text-sm mt-1">Please wait while we initialize the map</p>
    </div>
  )
}

// Error placeholder for the map
function MapErrorPlaceholder({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="w-full h-[400px] bg-gray-50 rounded-md border border-gray-200 flex flex-col items-center justify-center p-6">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">Map could not be loaded</h3>
      <p className="text-gray-600 text-center mb-4">{error}</p>
      <Button onClick={onRetry} className="bg-[#00008B] hover:bg-blue-900">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Loading Map
      </Button>
    </div>
  )
}

// Network status indicator component
function NetworkStatusIndicator({ online }: { online: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${online ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
    >
      {online ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}

// Map updater component with error handling
const MapUpdater = ({ position, zoom }: { position: [number, number]; zoom: number }) => {
  const map = useMap()
  const [updateError, setUpdateError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Only update view if map exists and setView is a function
      if (map && typeof map.setView === "function") {
        map.setView(position, zoom)
        setUpdateError(null)
      }
    } catch (err) {
      console.error("Error updating map view:", err)
      setUpdateError("Failed to update map view")
    }
  }, [map, position, zoom])

  // If there's an error, render a small error indicator
  if (updateError) {
    return (
      <div className="absolute bottom-20 right-4 z-[1000] bg-red-50 text-red-800 px-3 py-1 rounded-md text-xs border border-red-200">
        <AlertTriangle className="h-3 w-3 inline mr-1" />
        {updateError}
      </div>
    )
  }

  return null
}

// Map click handler component with error handling
const MapClickHandler = ({ onMapClick }: { onMapClick: (position: [number, number]) => void }) => {
  const map = useMap()

  // Use useEffect with proper cleanup
  useEffect(() => {
    if (!map) return

    const handleClick = (e: any) => {
      try {
        const { lat, lng } = e.latlng
        onMapClick([lat, lng])
      } catch (err) {
        console.error("Error handling map click:", err)
      }
    }

    // Check if map and map.on exist before using
    if (map && typeof map.on === "function") {
      map.on("click", handleClick)

      return () => {
        // Clean up event listener
        if (map && typeof map.off === "function") {
          map.off("click", handleClick)
        }
      }
    }
  }, [map, onMapClick])

  return null
}

// Sample property data for demonstration
const sampleProperties: PropertyData[] = [
  {
    property_id: "DLR-2024-0932",
    owner_name: "Ramesh Kumar",
    address: "45 Valley View, Dehradun, Uttarakhand",
    area_sq_m: 325.75,
    land_use: "Residential",
    registration_date: "2023-02-28",
    source: "CERSAI",
    disputed: false,
    geo_coordinates: {
      latitude: 30.3165,
      longitude: 78.0322,
    },
  },
  {
    property_id: "CERSAI-2023-1045",
    owner_name: "Suresh Patel",
    address: "45 Lake View Road, Mumbai, Maharashtra",
    area_sq_m: 200.75,
    land_use: "Commercial",
    registration_date: "2023-07-22",
    source: "CERSAI",
    disputed: false,
    geo_coordinates: {
      latitude: 19.1136,
      longitude: 72.8697,
    },
  },
  {
    property_id: "MCA21-2022-5678",
    owner_name: "Priya Singh",
    address: "78 Hillside Avenue, Delhi",
    area_sq_m: 300.25,
    land_use: "Mixed Use",
    registration_date: "2022-11-05",
    source: "MCA21",
    disputed: true,
    geo_coordinates: {
      latitude: 28.5921,
      longitude: 77.229,
    },
  },
  {
    property_id: "CERSAI-2019-7531",
    owner_name: "Harish Verma",
    address: "23 Coal Mine Road, Dhanbad, Jharkhand",
    area_sq_m: 400.0,
    land_use: "Industrial",
    registration_date: "2019-11-15",
    source: "CERSAI",
    disputed: true,
    geo_coordinates: {
      latitude: 23.7957,
      longitude: 86.4304,
    },
  },
]

export default function SearchByMap() {
  // State variables
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")
  const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]) // Default to center of India
  const [zoom, setZoom] = useState(5) // Default zoom level
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<PropertyData[]>([])
  const [propertyMarkers, setPropertyMarkers] = useState<MapMarker[]>([])
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [leafletLoadAttempts, setLeafletLoadAttempts] = useState(0)
  const [showFallbackSearch, setShowFallbackSearch] = useState(false)
  const [selectedSampleAddress, setSelectedSampleAddress] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Add a function to use a sample address
  const useSampleAddress = (address: string) => {
    setSelectedSampleAddress(address)
  }

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You are back online",
        description: "Map functionality has been restored.",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You are offline",
        description: "Map functionality may be limited. Please check your connection.",
        variant: "destructive",
      })
    }

    // Set initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  // Function to load Leaflet with retry mechanism
  const loadLeaflet = useCallback(async () => {
    if (typeof window === "undefined") return

    try {
      setMapError(null)

      // Check if Leaflet is already loaded
      if (window.L) {
        setLeafletLoaded(true)
        return
      }

      // Dynamically load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)

      // Dynamically load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""

      // Set up load and error handlers
      script.onload = () => {
        setLeafletLoaded(true)
        setMapError(null)
      }

      script.onerror = () => {
        setMapError("Failed to load map library. Please check your internet connection.")
        // Show fallback search after 3 failed attempts
        if (leafletLoadAttempts >= 2) {
          setShowFallbackSearch(true)
        } else {
          setLeafletLoadAttempts((prev) => prev + 1)
        }
      }

      document.body.appendChild(script)

      return () => {
        // Clean up
        document.head.removeChild(link)
        document.body.removeChild(script)
      }
    } catch (err) {
      console.error("Error loading Leaflet:", err)
      setMapError("Failed to initialize map. Please try again later.")

      // Show fallback search after 3 failed attempts
      if (leafletLoadAttempts >= 2) {
        setShowFallbackSearch(true)
      } else {
        setLeafletLoadAttempts((prev) => prev + 1)
      }
    }
  }, [leafletLoadAttempts, toast])

  // Initialize map
  useEffect(() => {
    // This ensures map components are only rendered client-side
    setMapLoaded(true)

    // Load Leaflet
    loadLeaflet()
  }, [loadLeaflet])

  useEffect(() => {
    if (selectedSampleAddress) {
      setAddress(selectedSampleAddress)
      toast({
        title: "Sample address selected",
        description: "Click the map icon to search for this location.",
      })
      setSelectedSampleAddress(null)
    }
  }, [selectedSampleAddress, toast])

  // Handle map click with error handling
  const handleMapClick = useCallback(
    (newPosition: [number, number]) => {
      try {
        setPosition(newPosition)
        setZoom(12) // Zoom in when a location is selected

        // Reverse geocode to get address from coordinates
        reverseGeocode(newPosition[0], newPosition[1])
      } catch (err) {
        console.error("Error handling map click:", err)
        toast({
          title: "Error",
          description: "Failed to process map click. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Reverse geocode function with retry and error handling
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!isOnline) {
      toast({
        title: "You are offline",
        description: "Cannot perform reverse geocoding while offline.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        // Add a delay between requests to avoid rate limiting
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
          {
            headers: {
              // Add proper user agent to comply with Nominatim usage policy
              "User-Agent": "DHARTI_PropertyPortal/1.0",
              "Accept-Language": "en-US,en;q=0.9",
            },
            // Add cache control to avoid cached responses
            cache: "no-cache",
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.display_name) {
          setAddress(data.display_name)
          setError("")
          setIsLoading(false)
          return
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error(`Reverse geocoding attempt ${retries + 1} failed:`, err)
        retries++

        // If we've reached max retries, show error but still set a basic address
        if (retries >= maxRetries) {
          // Set a basic address based on coordinates even if geocoding fails
          setAddress(`Location at coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
          toast({
            title: "Address lookup limited",
            description: "Could not retrieve detailed address. Using coordinates instead.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }
    }

    setIsLoading(false)
  }

  // Handle search by address with error handling and retry
  const handleSearchByAddress = async () => {
    if (!address.trim()) {
      setError("Please enter an address to locate on map")
      return
    }

    if (!isOnline) {
      toast({
        title: "You are offline",
        description: "Cannot search by address while offline. Please check your connection.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError("")
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        // Add a delay between requests to avoid rate limiting
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retries)))
        }

        // Use a more reliable query format for the Nominatim API
        const encodedAddress = encodeURIComponent(address)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&addressdetails=1&limit=1`,
          {
            headers: {
              // Add proper user agent to comply with Nominatim usage policy
              "User-Agent": "DHARTI_PropertyPortal/1.0",
              "Accept-Language": "en-US,en;q=0.9",
            },
            // Add cache control to avoid cached responses
            cache: "no-cache",
          },
        )

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`)
          throw new Error(`Geocoding service returned status: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.length > 0) {
          const { lat, lon } = data[0]
          const newPosition: [number, number] = [Number.parseFloat(lat), Number.parseFloat(lon)]
          setPosition(newPosition)
          setZoom(12) // Zoom in when a location is found

          toast({
            title: "Location found",
            description: "Map has been centered on the searched location.",
          })
          setIsLoading(false)
          return
        } else {
          // No results found, try next attempt or show error
          throw new Error("Location not found")
        }
      } catch (err) {
        console.error(`Search by address attempt ${retries + 1} failed:`, err)
        retries++

        // If we've reached max retries, show error
        if (retries >= maxRetries) {
          setError("Location not found. Please try a different address or use one of the sample addresses below.")
          toast({
            title: "Location not found",
            description: "Please try a different address or use one of the sample addresses below.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }
    }

    setIsLoading(false)
  }

  // Add this after the handleSearchByAddress function
  // Sample addresses that are known to work with the Nominatim API
  const sampleAddresses = [
    "Mumbai, Maharashtra, India",
    "Delhi, India",
    "Bangalore, Karnataka, India",
    "Chennai, Tamil Nadu, India",
    "Kolkata, West Bengal, India",
  ]

  // Handle property search with error handling
  const handleSearchProperties = async () => {
    setIsSearching(true)
    setSearchResults([])

    try {
      // For demonstration purposes, we'll use the sample data
      // In a real implementation, we would call the API with the coordinates

      // Filter properties based on proximity to the selected position
      // For this demo, we'll simulate this by checking if properties are within a certain distance
      const nearbyProperties = sampleProperties.filter((property) => {
        if (!property.geo_coordinates) return false

        // Calculate rough distance (this is a simplified calculation)
        const latDiff = Math.abs(property.geo_coordinates.latitude - position[0])
        const lngDiff = Math.abs(property.geo_coordinates.longitude - position[1])

        // If we're zoomed out (India level), show all properties
        if (zoom <= 6) return true

        // If we're zoomed in, only show properties within a certain range
        // The threshold depends on the zoom level
        const threshold = zoom <= 8 ? 2 : zoom <= 10 ? 1 : 0.5

        return latDiff < threshold && lngDiff < threshold
      })

      if (nearbyProperties.length > 0) {
        setSearchResults(nearbyProperties)

        // Create property markers for the map
        const markers = nearbyProperties.map((property) => {
          return {
            id: property.property_id,
            position: [property.geo_coordinates.latitude, property.geo_coordinates.longitude] as [number, number],
            title: property.property_id,
            owner: property.owner_name,
            address: property.address,
            disputed: property.disputed,
          }
        })

        setPropertyMarkers(markers)

        toast({
          title: "Properties found",
          description: `Found ${nearbyProperties.length} properties in this area.`,
        })
      } else {
        toast({
          title: "No properties found",
          description: "No properties were found in this location. Try a different area.",
        })
      }
    } catch (err) {
      console.error("Error searching properties:", err)
      toast({
        title: "Error",
        description: "Failed to search for properties. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle view property details
  const handleViewPropertyDetails = (propertyId: string) => {
    router.push(`/property/${propertyId}`)
  }

  // Create a custom icon for markers with error handling
  const createCustomIcon = useCallback(
    (isDisputed = false) => {
      try {
        if (!leafletLoaded || typeof window === "undefined" || !window.L) {
          // Return null if Leaflet is not loaded
          return null
        }

        return window.L.divIcon({
          html: `<div class="${isDisputed ? "bg-red-600" : "bg-[#00008B]"} w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })
      } catch (err) {
        console.error("Error creating custom icon:", err)
        // Return a default icon or null
        return null
      }
    },
    [leafletLoaded],
  )

  // Function to handle zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  // Function to retry loading the map
  const handleRetryMapLoad = () => {
    setMapError(null)
    setLeafletLoadAttempts(0)
    setShowFallbackSearch(false)
    loadLeaflet()
  }

  // Fallback search function when map is not available
  const handleFallbackSearch = () => {
    if (!address.trim()) {
      setError("Please enter an address to search")
      return
    }

    // Redirect to the search-by-locality page with the address
    router.push(`/search-by-locality?address=${encodeURIComponent(address)}`)
  }

  return (
    <SearchLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <NetworkStatusIndicator online={isOnline} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-2 border-[#138808]/10 mb-6">
            <CardHeader className="bg-[#138808]/5">
              <CardTitle className="text-2xl text-[#00008B]">Search by Map</CardTitle>
              <CardDescription>Find properties by selecting a location on the map</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Add this sample addresses section after the address input field in the JSX */}
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address or Locality
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="address"
                      placeholder="e.g. Mumbai, Maharashtra, India"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 flex-1"
                    />
                    {showFallbackSearch ? (
                      <Button
                        type="button"
                        onClick={handleFallbackSearch}
                        className="bg-[#138808] hover:bg-[#0F6606]"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                        Search
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSearchByAddress}
                        variant="outline"
                        className="border-[#138808] text-[#138808] hover:bg-[#138808]/10"
                        disabled={isLoading || !isOnline}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapIcon className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-xs text-gray-500">
                    {showFallbackSearch
                      ? "Enter an address to search for properties"
                      : "You can search by typing an address or click directly on the map to select a location"}
                  </p>

                  {/* Sample addresses section */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Sample addresses you can try:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleAddresses.map((sampleAddress) => (
                        <Badge
                          key={sampleAddress}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => useSampleAddress(sampleAddress)}
                        >
                          {sampleAddress}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map container with error handling */}
                <div
                  className="w-full h-[400px] relative rounded-md overflow-hidden border border-gray-200"
                  ref={mapContainerRef}
                >
                  {mapLoaded && !mapError && leafletLoaded ? (
                    <MapContainer
                      center={position}
                      zoom={zoom}
                      className="h-full w-full"
                      zoomControl={false}
                      ref={mapRef}
                      whenReady={(map) => {
                        // Set up zoom change listener with null checks
                        try {
                          if (map && map.target && typeof map.target.on === "function") {
                            map.target.on("zoomend", () => {
                              if (map.target && typeof map.target.getZoom === "function") {
                                handleZoomChange(map.target.getZoom())
                              }
                            })
                          }
                        } catch (err) {
                          console.error("Error setting up map event listeners:", err)
                        }
                      }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ZoomControl position="bottomright" />

                      {/* Map updater component */}
                      <MapUpdater position={position} zoom={zoom} />

                      {/* Map click handler */}
                      <MapClickHandler onMapClick={handleMapClick} />

                      {/* Current selected position marker */}
                      {leafletLoaded && (
                        <Marker position={position} icon={createCustomIcon()}>
                          <Popup>
                            <div className="text-sm">
                              <strong>Selected Location</strong>
                              <p className="mt-1">Latitude: {position[0].toFixed(6)}</p>
                              <p>Longitude: {position[1].toFixed(6)}</p>
                              {address && <p className="mt-1 text-xs">{address}</p>}
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Display property markers */}
                      {leafletLoaded &&
                        propertyMarkers.map((marker) => (
                          <Marker key={marker.id} position={marker.position} icon={createCustomIcon(marker.disputed)}>
                            <Popup>
                              <div className="text-sm">
                                <strong>{marker.title}</strong>
                                <p className="mt-1">Owner: {marker.owner}</p>
                                <p className="mt-1">{marker.address}</p>
                                <Button
                                  size="sm"
                                  className="mt-2 bg-[#00008B] hover:bg-blue-900 w-full"
                                  onClick={() => handleViewPropertyDetails(marker.id)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                    </MapContainer>
                  ) : mapError ? (
                    <MapErrorPlaceholder error={mapError} onRetry={handleRetryMapLoad} />
                  ) : (
                    <MapLoadingPlaceholder />
                  )}

                  {/* Location info overlay */}
                  {mapLoaded && leafletLoaded && !mapError && (
                    <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-md shadow-md">
                      <div className="text-sm">
                        <p className="font-medium">Selected Location:</p>
                        <div className="mt-1">
                          <p className="text-xs text-gray-600">Lat: {position[0].toFixed(6)}</p>
                          <p className="text-xs text-gray-600">Lng: {position[1].toFixed(6)}</p>
                          {address && <p className="text-xs text-gray-600 mt-1 max-w-[200px] truncate">{address}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Show fallback search alert when map fails to load */}
                {showFallbackSearch && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Map functionality unavailable</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      The map could not be loaded. You can still search for properties by address using the search box
                      above.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Search button */}
                {!showFallbackSearch && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleSearchProperties}
                      className="bg-[#138808] hover:bg-[#0F6606] w-full md:w-auto px-8"
                      disabled={isSearching || !isOnline || !!mapError}
                    >
                      {isSearching ? (
                        <span className="flex items-center">
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Search className="mr-2 h-4 w-4" />
                          Search Properties in This Area
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                {/* Offline mode notice */}
                {!isOnline && (
                  <Alert className="bg-red-50 border-red-200">
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">You are offline</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Map functionality is limited while offline. Please check your internet connection and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="bg-[#00008B]/5">
                  <CardTitle className="text-xl text-[#00008B]">Properties Near This Location</CardTitle>
                  <CardDescription>Found {searchResults.length} properties in this area</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {searchResults.map((property, index) => (
                      <motion.div
                        key={property.property_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className="p-4 md:p-6 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-[#00008B]">{property.property_id}</h3>
                                  {property.disputed && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Disputed
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <span className="font-medium">{property.owner_name}</span>
                                  <span className="mx-2">•</span>
                                  <span>{property.source}</span>
                                </div>

                                <div className="flex items-start gap-1 text-sm text-gray-600 mb-1">
                                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                                  <span>{property.address}</span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    {property.land_use}
                                  </Badge>
                                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                    {property.area_sq_m} sq.m
                                  </Badge>
                                </div>
                              </div>

                              <div className="bg-gray-50 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-200">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500 mb-1">Distance</p>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    {calculateDistance(
                                      position[0],
                                      position[1],
                                      property.geo_coordinates.latitude,
                                      property.geo_coordinates.longitude,
                                    ).toFixed(1)}{" "}
                                    km
                                  </Badge>
                                </div>

                                <Button
                                  onClick={() => handleViewPropertyDetails(property.property_id)}
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
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                  <Button variant="outline" onClick={() => setSearchResults([])}>
                    Clear Results
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Help section */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Info className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-800 mb-2">Map Search Tips</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <MapIcon2 className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Click directly on the map to select a location or search by entering an address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Search className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      After selecting a location, click "Search Properties in This Area" to find nearby properties
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>If the map doesn't load, you can still search by address using the search box</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SearchLayout>
  )
}

// Function to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
