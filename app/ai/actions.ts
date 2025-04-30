"use server"

// Function to fetch data from the mock-data API
async function fetchMockData() {
  try {
    const response = await fetch('http://localhost:3000/api/mock-data')
    if (!response.ok) {
      throw new Error(`Failed to fetch mock data: ${response.status}`)
    }
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error fetching mock data:", error)
    return []
  }
}

// Function to fetch data from the CERSAI API
async function fetchCersaiData() {
  try {
    const response = await fetch('http://localhost:3000/api/cersai')
    if (!response.ok) {
      throw new Error(`Failed to fetch CERSAI data: ${response.status}`)
    }
    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching CERSAI data:", error)
    return []
  }
}

// Function to fetch data from the MCA21 API
async function fetchMca21Data() {
  try {
    const response = await fetch('http://localhost:3000/api/mca21')
    if (!response.ok) {
      throw new Error(`Failed to fetch MCA21 data: ${response.status}`)
    }
    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching MCA21 data:", error)
    return []
  }
}

// Function to fetch data from all APIs
async function fetchAllPropertyData() {
  // Fetch data from all three endpoints
  const [mockData, cersaiData, mca21Data] = await Promise.all([
    fetchMockData(),
    fetchCersaiData(),
    fetchMca21Data()
  ])

  return {
    mockData,
    cersaiData,
    mca21Data
  }
}

// Function to search properties based on criteria
function searchProperties(allData: any, query: string) {
  const combinedData = [...allData.mockData, ...allData.cersaiData, ...allData.mca21Data]

  // Convert query to lowercase for case-insensitive search
  const lowerQuery = query.toLowerCase()

  // Search in all fields
  return combinedData.filter((property) => {
    return (
      property.property_id?.toLowerCase().includes(lowerQuery) ||
      property.owner_name?.toLowerCase().includes(lowerQuery) ||
      property.address?.toLowerCase().includes(lowerQuery) ||
      property.state?.toLowerCase().includes(lowerQuery) ||
      property.district?.toLowerCase().includes(lowerQuery) ||
      property.taluka?.toLowerCase().includes(lowerQuery) ||
      property.village?.toLowerCase().includes(lowerQuery) ||
      property.land_use?.toLowerCase().includes(lowerQuery)
    )
  })
}

// Function to format property data as markdown table
function formatPropertyAsMarkdown(property: any) {
  // Create a table header
  let markdown = `## Property Details: ${property.property_id}\n\n`;

  // Basic property information table
  markdown += `### Property Information\n`;
  markdown += `| Field | Value |\n`;
  markdown += `| --- | --- |\n`;
  markdown += `| Property ID | ${property.property_id} |\n`;
  markdown += `| Owner | ${property.owner_name} |\n`;
  markdown += `| Address | ${property.address} |\n`;
  markdown += `| Survey Number | ${property.survey_number} |\n`;
  markdown += `| Area | ${property.area_sq_m} sq. m |\n`;
  markdown += `| Land Use | ${property.land_use} |\n`;
  markdown += `| Registration Date | ${property.registration_date} |\n`;
  markdown += `| Valuation | ₹${property.valuation?.toLocaleString() || 'N/A'} |\n`;

  // Location details table
  markdown += `\n### Location Details\n`;
  markdown += `| Field | Value |\n`;
  markdown += `| --- | --- |\n`;
  markdown += `| State | ${property.state} |\n`;
  markdown += `| District | ${property.district} |\n`;
  markdown += `| Taluka | ${property.taluka} |\n`;
  markdown += `| Village | ${property.village} |\n`;

  // Legal status
  markdown += `\n### Legal Status\n`;
  markdown += `| Field | Value |\n`;
  markdown += `| --- | --- |\n`;
  markdown += `| Disputed | ${property.disputed ? 'Yes' : 'No'} |\n`;
  markdown += `| Encumbrance | ${property.encumbrance?.status || 'N/A'} |\n`;
  if (property.encumbrance?.details) {
    markdown += `| Encumbrance Details | ${property.encumbrance.details} |\n`;
  }

  // Source and last updated
  markdown += `\n### Source Information\n`;
  markdown += `| Field | Value |\n`;
  markdown += `| --- | --- |\n`;
  markdown += `| Data Source | ${property.source} |\n`;
  markdown += `| Last Updated | ${property.last_updated} |\n`;

  return markdown;
}

// Function to format multiple properties as summary table
function formatPropertiesSummary(properties: any[]) {
  if (properties.length === 0) return "No properties found matching your criteria.";

  let markdown = `## Found ${properties.length} Properties\n\n`;
  markdown += `| Property ID | Owner | Location | Land Use | Area (sq.m) |\n`;
  markdown += `| --- | --- | --- | --- | --- |\n`;

  properties.forEach(property => {
    const location = `${property.district}, ${property.state}`;
    markdown += `| ${property.property_id} | ${property.owner_name} | ${location} | ${property.land_use} | ${property.area_sq_m} |\n`;
  });

  markdown += `\n*Type the Property ID to view more details.*`;
  return markdown;
}

export async function sendMessage(userMessage: string) {
  try {
    // Fetch property data from all APIs
    const allData = await fetchAllPropertyData();

    // Check if it's a request for a specific property ID
    const propertyIdMatch = userMessage.match(/[A-Z]+-\d{4}-\d{4}/i);
    if (propertyIdMatch) {
      const propertyId = propertyIdMatch[0];
      const combinedData = [...allData.mockData, ...allData.cersaiData, ...allData.mca21Data];
      const property = combinedData.find(p => p.property_id === propertyId);

      if (property) {
        return formatPropertyAsMarkdown(property);
      }
    }

    // Extract search terms from user message
    const searchTerms = userMessage.toLowerCase();

    // Search for relevant properties
    const relevantProperties = searchProperties(allData, searchTerms);

    if (relevantProperties.length === 0) {
      return "I couldn't find any properties matching your search criteria. Please try with different terms or check if you're using the correct property ID format (e.g., DLR-2024-0932).";
    }

    if (relevantProperties.length === 1) {
      // If only one property found, return detailed view
      return formatPropertyAsMarkdown(relevantProperties[0]);
    } else {
      // If multiple properties found, return summary table
      return formatPropertiesSummary(relevantProperties);
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
}