"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"

// Sample data for dropdowns
const states = [
  "Maharashtra",
  "Delhi",
  "Gujarat",
  "Himachal Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Rajasthan",
  "Uttar Pradesh",
  "Jharkhand",
  "Uttarakhand",
  "West Bengal",
]

const districts = {
  Maharashtra: ["Pune", "Mumbai"],
  Delhi: ["South Delhi"],
  Gujarat: ["Ahmedabad"],
  "Himachal Pradesh": ["Shimla"],
  Karnataka: ["Bangalore"],
  "Tamil Nadu": ["Chennai"],
  Rajasthan: ["Jaipur"],
  "Uttar Pradesh": ["Lucknow"],
  Jharkhand: ["Dhanbad"],
  Uttarakhand: ["Dehradun"],
  "West Bengal": ["Darjeeling"],
}

const talukas = {
  Pune: ["Haveli"],
  Mumbai: ["Andheri"],
  "South Delhi": ["Defence Colony"],
  Ahmedabad: ["Sabarmati"],
  Shimla: ["Shimla Urban"],
  Bangalore: ["Electronic City"],
  Chennai: ["Mylapore"],
  Jaipur: ["Amber"],
  Lucknow: ["Gomti Nagar"],
  Dhanbad: ["Jharia"],
  Dehradun: ["Mussoorie"],
  Darjeeling: ["Siliguri"],
}

export default function SearchByName() {
  const [ownerName, setOwnerName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleStateChange = (value: string) => {
    setSelectedState(value)
    setSelectedDistrict("")
    setSelectedTaluka("")
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setSelectedTaluka("")
  }

  // Update the handleSubmit function to correctly handle the API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ownerName.trim()) {
      setError("Please enter an owner name")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("owner", ownerName)

      if (selectedState) {
        params.append("state", selectedState)
      }

      if (selectedDistrict) {
        params.append("district", selectedDistrict)
      }

      if (selectedTaluka) {
        params.append("taluka", selectedTaluka)
      }

      // Ensure we're using the correct parameters for the unified search
      if (selectedState) {
        params.append("state", selectedState)
      }

      if (selectedDistrict) {
        params.append("district", selectedDistrict)
      }

      if (selectedTaluka) {
        params.append("taluka", selectedTaluka)
      }

      // Redirect to search results with the correct parameters
      router.push(`/search-results?${params.toString()}`)
    } catch (err) {
      setError("An error occurred while searching")
      setIsLoading(false)
    }
  }

  return (
    <SearchLayout>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-[#00008B] hover:text-[#FF9933] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-2 border-[#FF9933]/10">
            <CardHeader className="bg-[#FF9933]/5">
              <CardTitle className="text-2xl text-[#00008B]">Search by Owner Name</CardTitle>
              <CardDescription>Enter the property owner's name and location details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="owner-name" className="text-sm font-medium">
                    Owner Name
                  </label>
                  <Input
                    id="owner-name"
                    placeholder="e.g. Ramesh Kumar"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="h-12"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      State
                    </label>
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="district" className="text-sm font-medium">
                      District
                    </label>
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState}>
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedState &&
                          districts[selectedState as keyof typeof districts]?.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="taluka" className="text-sm font-medium">
                      Taluka
                    </label>
                    <Select value={selectedTaluka} onValueChange={setSelectedTaluka} disabled={!selectedDistrict}>
                      <SelectTrigger id="taluka">
                        <SelectValue placeholder="Select taluka" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDistrict &&
                          talukas[selectedDistrict as keyof typeof talukas]?.map((taluka) => (
                            <SelectItem key={taluka} value={taluka}>
                              {taluka}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="bg-[#FF9933] hover:bg-[#FF8C00] w-full md:w-auto px-8"
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
                  </motion.div>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium mb-2">Sample owner names for testing:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Ramesh Kumar (Maharashtra, Pune)</li>
                  <li>Suresh Patel (Maharashtra, Mumbai)</li>
                  <li>Priya Singh (Delhi, South Delhi)</li>
                  <li>Anil Sharma (Gujarat, Ahmedabad)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SearchLayout>
  )
}
