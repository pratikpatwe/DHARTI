"use client"

import type React from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SearchOptions } from "@/components/home/search-options"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FileText, Users, BarChart3, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

// Import chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMobile()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search-results?address=${encodeURIComponent(searchQuery)}`)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const navItems = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#about" },
    { name: "Resources", href: "#resources" },
  ]

  // Chart data
  const registrationData = [
    { month: "Jan", count: 1200 },
    { month: "Feb", count: 1900 },
    { month: "Mar", count: 2400 },
    { month: "Apr", count: 1800 },
    { month: "May", count: 2800 },
    { month: "Jun", count: 3200 },
    { month: "Jul", count: 3800 },
    { month: "Aug", count: 3100 },
    { month: "Sep", count: 2700 },
    { month: "Oct", count: 3500 },
    { month: "Nov", count: 3900 },
    { month: "Dec", count: 4200 },
  ]

  const propertyTypeData = [
    { name: "Residential", value: 65 },
    { name: "Commercial", value: 20 },
    { name: "Industrial", value: 10 },
    { name: "Agricultural", value: 5 },
  ]

  const COLORS = ["#00008B", "#FF9933", "#138808", "#6B46C1"]

  const transactionData = [
    { month: "Jan", transactions: 8500 },
    { month: "Feb", transactions: 9200 },
    { month: "Mar", transactions: 11000 },
    { month: "Apr", transactions: 10500 },
    { month: "May", transactions: 12800 },
    { month: "Jun", transactions: 14200 },
    { month: "Jul", transactions: 15800 },
    { month: "Aug", transactions: 16100 },
    { month: "Sep", transactions: 17700 },
    { month: "Oct", transactions: 18500 },
    { month: "Nov", transactions: 19900 },
    { month: "Dec", transactions: 21200 },
  ]

  const stats = [
    { label: "Registered Users", value: "2.4M+", icon: Users, color: "#00008B" },
    { label: "Documents Processed", value: "18M+", icon: FileText, color: "#FF9933" },
    { label: "Daily Transactions", value: "50K+", icon: BarChart3, color: "#138808" },
    { label: "Success Rate", value: "99.8%", icon: TrendingUp, color: "#6B46C1" },
  ]

  const news = [
    {
      title: "New Online Services Launched",
      date: "15 Apr 2025",
      description: "Three new online services have been added to the portal for citizen convenience.",
    },
    {
      title: "System Maintenance Notice",
      date: "20 Apr 2025",
      description: "Scheduled maintenance on 20th April from 2:00 AM to 5:00 AM IST.",
    },
    {
      title: "Updated Guidelines Released",
      date: "10 Apr 2025",
      description: "New guidelines for document submission have been published.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <HeroSection />
        <SearchOptions />

        {/* Statistics Section with Dynamic Charts */}
        <section className="py-16 bg-[#00008B]">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Real-time insights into our digital property registry system
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                  className="text-center"
                >
                  <motion.div
                    className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ backgroundColor: `${stat.color}30` }}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Property Registrations Chart */}
              <motion.div
                className="col-span-1 lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Property Registrations (2024)</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={registrationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value} registrations`, "Count"]}
                          />
                          <Legend />
                          <Bar
                            dataKey="count"
                            name="Registrations"
                            fill="#00008B"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Property Types Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Property Types</h3>
                    <div className="h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartPieChart>
                          <Pie
                            data={propertyTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            animationDuration={1500}
                          >
                            {propertyTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Legend />
                        </RechartPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Transactions Line Chart */}
              <motion.div
                className="col-span-1 lg:col-span-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Transactions (2024)</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={transactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value.toLocaleString()}`, "Transactions"]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="transactions"
                            name="Transactions"
                            stroke="#FF9933"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={2000}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src="https://media.istockphoto.com/id/1300746302/photo/agriculture-and-technology-agritech-environment-communication-network.jpg?s=2048x2048&w=is&k=20&c=CqsVkUSTbhkQMlrTXgA2uLoCkrP87NpQpe4FAP1SAN8="
                    alt="About Digital India"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <Badge className="bg-[#138808] hover:bg-[#0F6606]">About Us</Badge>
                <h2 className="text-3xl font-bold text-[#00008B]">Transforming Governance Through Technology</h2>
                <p className="text-gray-600">
                  Our mission is to ensure that government services are accessible to citizens through digital
                  platforms, reducing paperwork, eliminating physical queues, and enhancing transparency in processes.
                </p>
                <p className="text-gray-600">
                  Through this portal, we aim to bridge the digital divide and promote inclusive growth by leveraging
                  technology for the benefit of all citizens.
                </p>
                <div className="pt-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-[#00008B] hover:bg-blue-900">Learn More About Our Mission</Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[#00008B] mb-4">Resources</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Access guides, tutorials, and documentation to help you navigate our services effectively.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                className="bg-white rounded-lg p-6 border border-gray-200"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-12 w-12 bg-[#FF9933]/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#FF9933]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#00008B]">User Guides</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Step-by-step instructions on how to use our digital services.
                </p>
                <Button variant="outline" className="w-full">
                  View Guides
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-6 border border-gray-200"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="h-12 w-12 bg-[#138808]/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#138808]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#00008B]">Forms & Documents</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download necessary forms and documents for various services.
                </p>
                <Button variant="outline" className="w-full">
                  Download Forms
                </Button>
              </motion.div>

              <motion.div
                className="bg-white rounded-lg p-6 border border-gray-200"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="h-12 w-12 bg-[#00008B]/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#00008B]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#00008B]">FAQs</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find answers to commonly asked questions about our services.
                </p>
                <Button variant="outline" className="w-full">
                  View FAQs
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
