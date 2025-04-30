"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"

export default function SearchById() {
  const [propertyId, setPropertyId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!propertyId.trim()) {
      setError("Please enter a property ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, we would validate the property exists first
      // For this demo, we'll just redirect to the property page
      router.push(`/property/${propertyId}`)
    } catch (err) {
      setError("An error occurred while searching for the property")
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
          <Card className="border-2 border-[#00008B]/10">
            <CardHeader className="bg-[#00008B]/5">
              <CardTitle className="text-2xl text-[#00008B]">Search by Property ID</CardTitle>
              <CardDescription>Enter the property ID to view detailed information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="property-id" className="text-sm font-medium">
                    Property ID
                  </label>
                  <Input
                    id="property-id"
                    placeholder="e.g. DLR-2024-0932"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="h-12"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-xs text-gray-500">Enter the complete property ID as mentioned in your documents</p>
                </div>

                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="bg-[#00008B] hover:bg-blue-900 w-full md:w-auto px-8"
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
                <h3 className="text-sm font-medium mb-2">Sample Property IDs for testing:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>DLR-2024-0932</li>
                  <li>CERSAI-2023-1045</li>
                  <li>MCA21-2022-5678</li>
                  <li>DORIS-2021-8765</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SearchLayout>
  )
}
