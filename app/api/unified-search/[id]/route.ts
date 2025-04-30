import { NextResponse } from "next/server"
import { mockProperties } from "../../mock-data/route"

// Get property by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the property with the matching ID
  const property = mockProperties.find((p) => p.property_id === id)

  // If no property is found, return an error
  if (!property) {
    return NextResponse.json(
      {
        error: "Property not found in any database",
        searched_id: id,
      },
      { status: 404 },
    )
  }

  // Return the property
  return NextResponse.json({
    property,
    meta: {
      sources: [property.source],
      id_searched: id,
    },
  })
}
