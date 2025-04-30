import { NextResponse } from "next/server"

// Sample property data for testing search features
export const mockProperties = [
  // Properties for search by name
  {
    property_id: "DLR-2024-0932",
    owner_name: "Ramesh Kumar",
    address: "45 Valley View, Dehradun, Uttarakhand",
    survey_number: "SN-567/89",
    area_sq_m: 325.75,
    land_use: "Residential",
    registration_date: "2023-02-28",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "MCA21",
    state: "Uttarakhand",
    district: "Dehradun",
    taluka: "Mussoorie",
    village: "Valley View",
    disputed: false,
    last_updated: "2024-01-10",
    valuation: 15000000,
    geo_coordinates: {
      latitude: 30.3165,
      longitude: 78.0322,
    },
  },
  {
    property_id: "CERSAI-2023-1045",
    owner_name: "Suresh Patel",
    address: "45 Lake View Road, Mumbai, Maharashtra",
    survey_number: "SN-789/12",
    area_sq_m: 200.75,
    land_use: "Commercial",
    registration_date: "2023-07-22",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "CERSAI",
    state: "Maharashtra",
    district: "Mumbai",
    taluka: "Andheri",
    village: "Lake View",
    disputed: false,
    last_updated: "2024-01-15",
    valuation: 12500000,
    geo_coordinates: {
      latitude: 19.1136,
      longitude: 72.8697,
    },
  },
  {
    property_id: "MCA21-2022-5678",
    owner_name: "Priya Singh",
    address: "78 Hillside Avenue, Delhi",
    survey_number: "SN-123/45",
    area_sq_m: 300.25,
    land_use: "Mixed Use",
    registration_date: "2022-11-05",
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    source: "MCA21",
    state: "Delhi",
    district: "South Delhi",
    taluka: "Defence Colony",
    village: "Hillside",
    disputed: true,
    last_updated: "2024-04-10",
    valuation: 22000000,
    geo_coordinates: {
      latitude: 28.5921,
      longitude: 77.229,
    },
  },
  {
    property_id: "CERSAI-2019-7531",
    owner_name: "Harish Verma",
    address: "23 Coal Mine Road, Dhanbad, Jharkhand",
    survey_number: "SN-456/78",
    area_sq_m: 400.0,
    land_use: "Industrial",
    registration_date: "2019-11-15",
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    source: "CERSAI",
    state: "Jharkhand",
    district: "Dhanbad",
    taluka: "Jharia",
    village: "Coal Mine Road",
    disputed: true,
    last_updated: "2024-02-05",
    valuation: 18000000,
    geo_coordinates: {
      latitude: 23.7957,
      longitude: 86.4304,
    },
  },

  // Properties for search by locality
  {
    property_id: "DLR-2024-1234",
    owner_name: "Vikram Mehta",
    address: "12 Green Valley, Pune, Maharashtra",
    survey_number: "SN-123/45",
    area_sq_m: 250.0,
    land_use: "Residential",
    registration_date: "2024-01-15",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "CERSAI",
    state: "Maharashtra",
    district: "Pune",
    taluka: "Haveli",
    village: "Green Valley",
    disputed: false,
    last_updated: "2024-03-20",
    valuation: 9500000,
    geo_coordinates: {
      latitude: 18.5204,
      longitude: 73.8567,
    },
  },
  {
    property_id: "CERSAI-2023-5678",
    owner_name: "Anjali Sharma",
    address: "34 Lake View, Mumbai, Maharashtra",
    survey_number: "SN-456/78",
    area_sq_m: 180.0,
    land_use: "Residential",
    registration_date: "2023-08-10",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "CERSAI",
    state: "Maharashtra",
    district: "Mumbai",
    taluka: "Andheri",
    village: "Lake View",
    disputed: false,
    last_updated: "2024-02-15",
    valuation: 14500000,
    geo_coordinates: {
      latitude: 19.1136,
      longitude: 72.8697,
    },
  },
  {
    property_id: "MCA21-2022-9012",
    owner_name: "Rajiv Malhotra",
    address: "56 Hillside, Delhi",
    survey_number: "SN-789/01",
    area_sq_m: 320.0,
    land_use: "Residential",
    registration_date: "2022-05-20",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "MCA21",
    state: "Delhi",
    district: "South Delhi",
    taluka: "Defence Colony",
    village: "Hillside",
    disputed: false,
    last_updated: "2023-12-10",
    valuation: 18500000,
    geo_coordinates: {
      latitude: 28.5921,
      longitude: 77.229,
    },
  },
  {
    property_id: "CERSAI-2021-3456",
    owner_name: "Sanjay Modi",
    address: "78 River Front, Ahmedabad, Gujarat",
    survey_number: "SN-234/56",
    area_sq_m: 420.0,
    land_use: "Commercial",
    registration_date: "2021-11-05",
    encumbrance: {
      status: "No",
      details: "",
    },
    source: "CERSAI",
    state: "Gujarat",
    district: "Ahmedabad",
    taluka: "Sabarmati",
    village: "River Front",
    disputed: false,
    last_updated: "2023-10-15",
    valuation: 22500000,
    geo_coordinates: {
      latitude: 23.0225,
      longitude: 72.5714,
    },
  },

  // Additional disputed properties
  {
    property_id: "DORIS-2021-8765",
    owner_name: "Meena Kumari",
    address: "45 Beach Road, Chennai, Tamil Nadu",
    survey_number: "SN-678/90",
    area_sq_m: 225.75,
    land_use: "Residential",
    registration_date: "2021-06-25",
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    source: "MCA21",
    state: "Tamil Nadu",
    district: "Chennai",
    taluka: "Mylapore",
    village: "Beach Road",
    disputed: true,
    last_updated: "2024-02-20",
    valuation: 18500000,
    geo_coordinates: {
      latitude: 13.0827,
      longitude: 80.2707,
    },
  },
  {
    property_id: "CERSAI-2020-4321",
    owner_name: "Rakesh Jha",
    address: "67 Tea Garden, Darjeeling, West Bengal",
    survey_number: "SN-345/67",
    area_sq_m: 500.0,
    land_use: "Agricultural",
    registration_date: "2020-09-15",
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    source: "CERSAI",
    state: "West Bengal",
    district: "Darjeeling",
    taluka: "Siliguri",
    village: "Tea Garden",
    disputed: true,
    last_updated: "2023-11-10",
    valuation: 7500000,
    geo_coordinates: {
      latitude: 27.041,
      longitude: 88.2663,
    },
  },
]

// API route to get mock data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get search parameters
  const owner = searchParams.get("owner")
  const address = searchParams.get("address")
  const state = searchParams.get("state")
  const district = searchParams.get("district")
  const taluka = searchParams.get("taluka")
  const disputed = searchParams.get("disputed")
  const id = searchParams.get("id")

  // Filter properties based on search parameters
  let filteredProperties = [...mockProperties]

  if (id) {
    filteredProperties = filteredProperties.filter((p) => p.property_id.toLowerCase().includes(id.toLowerCase()))
  }

  if (owner) {
    filteredProperties = filteredProperties.filter((p) => p.owner_name.toLowerCase().includes(owner.toLowerCase()))
  }

  if (address) {
    filteredProperties = filteredProperties.filter(
      (p) =>
        p.address.toLowerCase().includes(address.toLowerCase()) ||
        p.village.toLowerCase().includes(address.toLowerCase()) ||
        p.taluka.toLowerCase().includes(address.toLowerCase()) ||
        p.district.toLowerCase().includes(address.toLowerCase()) ||
        p.state.toLowerCase().includes(address.toLowerCase()),
    )
  }

  if (state) {
    filteredProperties = filteredProperties.filter((p) => p.state.toLowerCase() === state.toLowerCase())

    if (district) {
      filteredProperties = filteredProperties.filter((p) => p.district.toLowerCase() === district.toLowerCase())

      if (taluka) {
        filteredProperties = filteredProperties.filter((p) => p.taluka.toLowerCase() === taluka.toLowerCase())
      }
    }
  }

  if (disputed === "true") {
    filteredProperties = filteredProperties.filter((p) => p.disputed === true)
  }

  // Return filtered properties
  return NextResponse.json({
    results: filteredProperties,
    meta: {
      total_count: filteredProperties.length,
      sources: ["CERSAI", "MCA21", "DORIS"],
      filters_applied: {
        id: id || null,
        owner: owner || null,
        address: address || null,
        state: state || null,
        district: district || null,
        taluka: taluka || null,
        disputed: disputed || null,
      },
    },
  })
}

// API route to get a specific property by ID
export async function POST(request: Request) {
  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
  }

  const property = mockProperties.find((p) => p.property_id === id)

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json({
    property,
    meta: {
      sources: [property.source],
      id_searched: id,
    },
  })
}
