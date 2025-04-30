"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu, X, Info, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { FirstVisitGuide } from "@/components/first-visit-guide"
import { useMediaQuery } from "@/hooks/use-media-query"
import { UserButton } from "@/components/auth/user-button"

export function Header() {
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBetaTooltip, setShowBetaTooltip] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  const navItems = [
    {
      name: "Home",
      href: "/#",
      elementId: "",
      dropdown: false,
    },
    {
      name: "About Us",
      href: "/#about",
      elementId: "about",
      dropdown: false,
    },
    {
      name: "Services",
      href: "#",
      elementId: "",
      dropdown: true,
      items: [
        { name: "Property Search", href: "/search-by-id" },
        { name: "Map Search", href: "/search-by-map" },
        { name: "Unified Search", href: "/unified-search" },
      ],
    },
    {
      name: "Resources",
      href: "/#resources",
      elementId: "resources",
      dropdown: false,
    },
  ]

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const handleSkipToMain = (e) => {
    e.preventDefault()
    scrollToElement("property-search")
  }

  const handleBetaFeature = (e) => {
    e.preventDefault()
    setShowBetaTooltip(true)
    setTimeout(() => setShowBetaTooltip(false), 3000)
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <>
      {/* Top Bar */}
      <motion.div
        className="bg-[#FF9933] text-white py-1 px-4 text-xs md:text-sm flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={handleSkipToMain}
            className="hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#FF9933] rounded-sm"
          >
            Skip to Main Content
          </a>
          <span className="hidden sm:inline">|</span>
          <div className="relative hidden sm:block">
            <a
              href="#"
              onClick={handleBetaFeature}
              className="hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#FF9933] rounded-sm"
            >
              Screen Reader Access
            </a>
            {showBetaTooltip && (
              <div className="absolute top-6 left-0 bg-gray-800 text-white p-2 rounded-md text-xs z-50 whitespace-nowrap flex items-center">
                <Info size={12} className="mr-1" />
                This feature is in beta version
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span
              className="cursor-pointer hover:underline"
              onClick={handleBetaFeature}
              tabIndex={0}
              role="button"
              aria-label="Change text size"
            >
              A- A A+
            </span>
            {showBetaTooltip && (
              <div className="absolute top-6 right-0 bg-gray-800 text-white p-2 rounded-md text-xs z-50 whitespace-nowrap flex items-center">
                <Info size={12} className="mr-1" />
                This feature is in beta version
              </div>
            )}
          </div>
          <span className="hidden sm:inline">|</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleBetaFeature}
            tabIndex={0}
            role="button"
            aria-label="Switch to English"
          >
            English
          </span>
          <span>|</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleBetaFeature}
            tabIndex={0}
            role="button"
            aria-label="Switch to Hindi"
          >
            हिंदी
          </span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-300 ${scrollY > 50 ? "py-2" : "py-4"}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://ik.imagekit.io/xnx0c7nxo/DHARTI%20LOGO.png?updatedAt=1745935717643"
                  alt="Government Emblem"
                  width={120}
                  height={120}
                  className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16"
                />
              </motion.div>
              <div>
                <motion.h1
                  className="text-base md:text-lg lg:text-2xl font-bold text-[#00008B]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  DHARTI
                </motion.h1>
                <motion.p
                  className="text-xs md:text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Government of India
                </motion.p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav>
                <ul className="flex gap-4 lg:gap-6">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      className="relative"
                    >
                      {item.dropdown ? (
                        <div>
                          <button
                            className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors flex items-center gap-1"
                            onClick={() => toggleDropdown(item.name)}
                            aria-expanded={activeDropdown === item.name}
                            aria-haspopup="true"
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`}
                            />
                          </button>

                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50"
                            >
                              {item.items?.map((subItem, subIndex) => (
                                <a
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-[#00008B] hover:bg-gray-50 hover:text-[#FF9933]"
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement(item.elementId)
                          }}
                        >
                          {item.name}
                        </a>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                {/* Add help/tutorial button */}
                <FirstVisitGuide />

                {/* User authentication button */}
                <UserButton />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <FirstVisitGuide />
              <UserButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              ref={menuRef}
              className="md:hidden py-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav>
                <ul className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      {item.dropdown ? (
                        <div>
                          <button
                            className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors flex items-center justify-between w-full"
                            onClick={() => toggleDropdown(item.name)}
                            aria-expanded={activeDropdown === item.name}
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`}
                            />
                          </button>

                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 mt-2 border-l-2 border-gray-200"
                            >
                              {item.items?.map((subItem, subIndex) => (
                                <a
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block py-2 text-[#00008B] hover:text-[#FF9933]"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          className="text-[#00008B] hover:text-[#FF9933] font-medium transition-colors block"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToElement(item.elementId)
                          }}
                        >
                          {item.name}
                        </a>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </div>
      </motion.header>
    </>
  )
}
