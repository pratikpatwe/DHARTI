"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import SearchLayout from "@/components/layout/search-layout"

export default function SearchByLocality() {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.trim()) {
      setError("Please enter an address or locality")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("address", address)

      // Redirect to search results with the correct parameter
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
          <Card className="border-2 border-[#138808]/10">
            <CardHeader className="bg-[#138808]/5">
              <CardTitle className="text-2xl text-[#00008B]">Search by Locality</CardTitle>
              <CardDescription>Enter an address, village, taluka, district or state to find properties</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address or Locality
                  </label>
                  <Input
                    id="address"
                    placeholder="e.g. Green Valley, Pune"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-xs text-gray-500">
                    You can search by any part of the address including village, taluka, district or state
                  </p>
                </div>

                <div className="flex justify-center">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="bg-[#138808] hover:bg-[#0F6606] w-full md:w-auto px-8"
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
                          <MapPin className="mr-2 h-4 w-4" />
                          Search
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium mb-2">Sample localities for testing:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Green Valley, Pune</li>
                  <li>Lake View, Mumbai</li>
                  <li>Hillside, Delhi</li>
                  <li>River Front, Ahmedabad</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SearchLayout>
  )
}
