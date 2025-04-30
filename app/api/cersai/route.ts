import { NextResponse } from "next/server"

// CERSAI mock data with unique key names
export const cersaiData = [
  {
    cersai_id: "CERSAI-2023-1045",
    owner_name: "Suresh Patel",
    property_address: "45 Lake View Road, Mumbai, Maharashtra",
    survey_no: "SN-789/12",
    property_area: 200.75,
    property_type: "Commercial",
    registration_dt: "22-07-2023", // DD-MM-YYYY format
    lien_status: {
      has_lien: false,
      lien_details: "",
    },
    data_source: "CERSAI",
    state_name: "Maharashtra",
    district_name: "Mumbai",
    taluka_name: "Andheri",
    village_name: "Lake View",
    is_disputed: false,
    last_updated: "15-01-2024",
    valuation: 12500000,
    geo_coordinates: {
      latitude: 19.1136,
      longitude: 72.8697,
    },
  },
  {
    cersai_id: "CERSAI-2020-2468",
    owner_name: "Rajesh Gupta",
    property_address: "89 Tech Park, Bangalore, Karnataka",
    survey_no: "SN-345/67",
    property_area: 500.0,
    property_type: "Commercial",
    registration_dt: "10-12-2020", // DD-MM-YYYY format
    lien_status: {
      has_lien: false,
      lien_details: "",
    },
    data_source: "CERSAI",
    state_name: "Karnataka",
    district_name: "Bangalore",
    taluka_name: "Electronic City",
    village_name: "Tech Park",
    is_disputed: false,
    last_updated: "20-03-2024",
    valuation: 35000000,
    geo_coordinates: {
      latitude: 12.8698,
      longitude: 77.6697,
    },
  },
  {
    cersai_id: "CERSAI-2019-7531",
    owner_name: "Harish Verma",
    property_address: "23 Coal Mine Road, Dhanbad, Jharkhand",
    survey_no: "SN-456/78",
    property_area: 400.0,
    property_type: "Industrial",
    registration_dt: "15-11-2019", // DD-MM-YYYY format
    lien_status: {
      has_lien: true,
      lien_details: "Property under legal dispute",
    },
    data_source: "CERSAI",
    state_name: "Jharkhand",
    district_name: "Dhanbad",
    taluka_name: "Jharia",
    village_name: "Coal Mine Road",
    is_disputed: true,
    last_updated: "05-02-2024",
    valuation: 18000000,
    geo_coordinates: {
      latitude: 23.7957,
      longitude: 86.4304,
    },
  },
  {
    cersai_id: "CERSAI-2023-8642",
    owner_name: "Priya Singh",
    property_address: "78 Hillside Avenue, Delhi",
    survey_no: "SN-123/45",
    property_area: 300.25,
    property_type: "Mixed Use",
    registration_dt: "05-11-2022", // DD-MM-YYYY format
    lien_status: {
      has_lien: true,
      lien_details: "Property under legal dispute",
    },
    data_source: "CERSAI",
    state_name: "Delhi",
    district_name: "South Delhi",
    taluka_name: "Defence Colony",
    village_name: "Hillside",
    is_disputed: true,
    last_updated: "10-04-2024",
    valuation: 22000000,
    geo_coordinates: {
      latitude: 28.5921,
      longitude: 77.229,
    },
  },
]

// Get CERSAI data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Filter by ID
  const id = searchParams.get("id")
  if (id) {
    const property = cersaiData.find((p) => p.cersai_id === id)
    return NextResponse.json(property || { error: "Property not found in CERSAI database" })
  }

  // Filter by owner name
  const owner = searchParams.get("owner")
  if (owner) {
    const filtered = cersaiData.filter((p) => p.owner_name.toLowerCase().includes(owner.toLowerCase()))
    return NextResponse.json(filtered)
  }

  // Filter by address
  const address = searchParams.get("address")
  if (address) {
    const filtered = cersaiData.filter(
      (p) =>
        p.property_address.toLowerCase().includes(address.toLowerCase()) ||
        p.village_name.toLowerCase().includes(address.toLowerCase()) ||
        p.taluka_name.toLowerCase().includes(address.toLowerCase()) ||
        p.district_name.toLowerCase().includes(address.toLowerCase()) ||
        p.state_name.toLowerCase().includes(address.toLowerCase()),
    )
    return NextResponse.json(filtered)
  }

  // Filter by state
  const state = searchParams.get("state")
  if (state) {
    const filtered = cersaiData.filter((p) => p.state_name === state)
    return NextResponse.json(filtered)
  }

  // Return all properties if no filters
  return NextResponse.json(cersaiData)
}
