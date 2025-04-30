import { NextResponse } from "next/server"

// MCA21 mock data with unique key names
export const mca21Data = [
  {
    mca_property_id: "MCA21-2022-5678",
    proprietor: "Priya Singh",
    location: "78 Hillside Avenue, Delhi",
    survey_reference: "SN-123/45",
    area_sqm: 300.25,
    usage_type: "Mixed Use",
    date_of_registry: "2022/11/05", // YYYY/MM/DD format
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    data_origin: "MCA21",
    state_code: "DL",
    district_code: "SDL",
    taluk_code: "DFC",
    village_code: "HSA",
    dispute_flag: true,
    updated_on: "2024/03/15",
    estimated_value: 23500000,
    location_data: {
      lat: 28.5921,
      long: 77.229,
    },
    additional_info: {
      zoning: "Mixed Residential-Commercial",
      floor_area_ratio: 2.5,
      building_height: "15m",
    },
  },
  {
    mca_property_id: "MCA21-2018-1357",
    proprietor: "Sunita Reddy",
    location: "34 Beach Road, Chennai, Tamil Nadu",
    survey_reference: "SN-678/90",
    area_sqm: 225.75,
    usage_type: "Residential",
    date_of_registry: "2018/06/25", // YYYY/MM/DD format
    encumbrance: {
      status: "Yes",
      details: "Property under legal dispute",
    },
    data_origin: "MCA21",
    state_code: "TN",
    district_code: "CHN",
    taluk_code: "MYL",
    village_code: "BRD",
    dispute_flag: true,
    updated_on: "2024/02/20",
    estimated_value: 18500000,
    location_data: {
      lat: 13.0827,
      long: 80.2707,
    },
    additional_info: {
      zoning: "Residential",
      floor_area_ratio: 1.8,
      building_height: "12m",
    },
  },
  {
    mca_property_id: "MCA21-2023-2468",
    proprietor: "Ramesh Kumar",
    location: "45 Valley View, Dehradun, Uttarakhand",
    survey_reference: "SN-567/89",
    area_sqm: 325.75,
    usage_type: "Residential",
    date_of_registry: "2023/02/28", // YYYY/MM/DD format
    encumbrance: {
      status: "No",
      details: "",
    },
    data_origin: "MCA21",
    state_code: "UK",
    district_code: "DDN",
    taluk_code: "MSR",
    village_code: "VVW",
    dispute_flag: false,
    updated_on: "2024/01/10",
    estimated_value: 15000000,
    location_data: {
      lat: 30.3165,
      long: 78.0322,
    },
    additional_info: {
      zoning: "Residential",
      floor_area_ratio: 1.5,
      building_height: "10m",
    },
  },
  {
    mca_property_id: "MCA21-2021-9753",
    proprietor: "Anil Sharma",
    location: "22 River Front, Ahmedabad, Gujarat",
    survey_reference: "SN-567/89",
    area_sqm: 450.0,
    usage_type: "Residential",
    date_of_registry: "2021/04/18", // YYYY/MM/DD format
    encumbrance: {
      status: "No",
      details: "",
    },
    data_origin: "MCA21",
    state_code: "GJ",
    district_code: "AMD",
    taluk_code: "SBR",
    village_code: "RFT",
    dispute_flag: false,
    updated_on: "2023/12/05",
    estimated_value: 28000000,
    location_data: {
      lat: 23.0225,
      long: 72.5714,
    },
    additional_info: {
      zoning: "Residential",
      floor_area_ratio: 2.0,
      building_height: "14m",
    },
  },
]

// Get MCA21 data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Filter by ID
  const id = searchParams.get("id")
  if (id) {
    const property = mca21Data.find((p) => p.mca_property_id === id)
    return NextResponse.json(property || { error: "Property not found in MCA21 database" })
  }

  // Filter by owner name
  const owner = searchParams.get("owner")
  if (owner) {
    const filtered = mca21Data.filter((p) => p.proprietor.toLowerCase().includes(owner.toLowerCase()))
    return NextResponse.json(filtered)
  }

  // Filter by address
  const address = searchParams.get("address")
  if (address) {
    const filtered = mca21Data.filter(
      (p) =>
        p.location.toLowerCase().includes(address.toLowerCase()) ||
        p.village_code.toLowerCase().includes(address.toLowerCase()) ||
        p.taluk_code.toLowerCase().includes(address.toLowerCase()) ||
        p.district_code.toLowerCase().includes(address.toLowerCase()) ||
        p.state_code.toLowerCase().includes(address.toLowerCase()),
    )
    return NextResponse.json(filtered)
  }

  // Filter by state code
  const state = searchParams.get("state")
  if (state) {
    const filtered = mca21Data.filter((p) => p.state_code === state)
    return NextResponse.json(filtered)
  }

  // Return all properties if no filters
  return NextResponse.json(mca21Data)
}
