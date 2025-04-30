"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertTriangle, FileText, Map, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function SearchOptions() {
  const searchOptions = [
    { name: "Search by ID", icon: FileText, color: "#00008B", href: "/search-by-id" },
    { name: "Search by Name", icon: Users, color: "#FF9933", href: "/search-by-name" },
    { name: "Search by Maps", icon: Map, color: "#138808", href: "/search-by-map" },
    { name: "Search by Locality", icon: MapPin, color: "#6B46C1", href: "/search-by-locality" },
    {
      name: "Disputed Property",
      icon: AlertTriangle,
      color: "#E53E3E",
      href: "/search-by-disputed-property",
    },
  ]

  return (
    <section id="property-search" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[#00008B] mb-4">Property Search</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access comprehensive property information through our multiple search options.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {searchOptions.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex flex-col items-center"
                >
                  <Link href={item.href} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 px-2 flex flex-col gap-3 border-2 hover:border-[#00008B] hover:bg-[#00008B]/5"
                    >
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon className="h-6 w-6" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm font-medium text-center">{item.name}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
