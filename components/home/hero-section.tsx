"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { FileCheck, ShieldCheck, BookOpen, Building, MapPin } from "lucide-react"

export function HeroSection() {
  // Function for smooth scrolling
  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <section className="relative bg-white py-16 md:py-20 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 lg:pr-6">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex items-center">
                <Badge className="px-3 py-1 text-sm font-semibold bg-[#FF9933] hover:bg-[#FF8C00] text-white">
                  Official Government Portal
                </Badge>
                <div className="ml-4 h-px flex-1 bg-gray-200"></div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-[#00008B]">Digitized Housing &</span>{" "}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-[#138808]"
                >
                  Asset Registry
                </motion.span>
              </h1>

              <p className="text-gray-700 text-lg">
                Access comprehensive property information through our secure and efficient digital platform. Enabling
                transparency and accountability in property records across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-[#00008B] hover:bg-blue-900 text-white px-6 text-base"
                  onClick={() => scrollToSection("property-search")}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#00008B] text-[#00008B] hover:bg-blue-50 px-6 text-base"
                  onClick={() => scrollToSection("about")}
                >
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-gray-100 mt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <ShieldCheck className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <span className="text-gray-700 font-medium">Secure Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <FileCheck className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <span className="text-gray-700 font-medium">Verified Data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <BookOpen className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <span className="text-gray-700 font-medium">Public Records</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Building className="h-5 w-5 text-[#00008B]" />
                  </div>
                  <span className="text-gray-700 font-medium">Property Details</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-5 rounded-xl shadow-md">
                <div className="relative h-[300px] md:h-[380px] w-full overflow-hidden rounded-lg">
                  <Image
                    src="https://media.istockphoto.com/id/1194292436/photo/city-lights-india.jpg?s=2048x2048&w=is&k=20&c=3DPQ8q7vA8zf3a2c76NudOeI9gGVlQIYVRsjvdtw6gE="
                    alt="Digital Property Registry"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00008B]/30 via-transparent to-[#FF9933]/10"></div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#138808] flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#00008B]">Digital India Initiative</h3>
                      <p className="text-sm text-gray-600">Transforming governance through technology</p>
                    </div>
                  </div>

                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#FF9933]"></div>
                        <div className="h-3 w-3 rounded-full bg-white border border-gray-300"></div>
                        <div className="h-3 w-3 rounded-full bg-[#138808]"></div>
                      </div>
                      <p className="text-xs font-bold text-gray-700 mt-1">GOVT OF INDIA</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-[#ffffff] to-[#138808]"></div>
    </section>
  )
}
