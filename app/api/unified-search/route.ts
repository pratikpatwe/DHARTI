import { NextResponse } from "next/server"
import { mockProperties } from "../mock-data/route"

// Unified search function
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
  const query = searchParams.get("query")

  // Filter properties based on search parameters
  let filteredProperties = [...mockProperties]

  // Generic query parameter for flexible searching
  if (query) {
    filteredProperties = mockProperties.filter(
      (p) =>
        p.property_id.toLowerCase().includes(query.toLowerCase()) ||
        p.owner_name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase()) ||
        p.village.toLowerCase().includes(query.toLowerCase()) ||
        p.taluka.toLowerCase().includes(query.toLowerCase()) ||
        p.district.toLowerCase().includes(query.toLowerCase()) ||
        p.state.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Filter by ID
  if (id) {
    filteredProperties = filteredProperties.filter((p) => p.property_id.toLowerCase().includes(id.toLowerCase()))
  }

  // Filter by owner name
  if (owner) {
    filteredProperties = filteredProperties.filter((p) => p.owner_name.toLowerCase().includes(owner.toLowerCase()))
  }

  // Filter by address
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

  // Filter by state
  if (state) {
    filteredProperties = filteredProperties.filter((p) => p.state.toLowerCase() === state.toLowerCase())

    // Filter by district
    if (district) {
      filteredProperties = filteredProperties.filter((p) => p.district.toLowerCase() === district.toLowerCase())

      // Filter by taluka
      if (taluka) {
        filteredProperties = filteredProperties.filter((p) => p.taluka.toLowerCase() === taluka.toLowerCase())
      }
    }
  }

  // Filter by disputed status
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
