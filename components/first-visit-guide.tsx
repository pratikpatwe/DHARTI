"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Check,
  MapPin,
  Search,
  FileText,
  AlertTriangle,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"

// Storage key for guide completion status
const GUIDE_STORAGE_KEY = "dharti_guide_completed"

// Guide step interface
interface GuideStep {
  title: string
  description: string
  target?: string
  icon: React.ReactNode
  position?: "center" | "top" | "bottom" | "left" | "right"
}

export function FirstVisitGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(true)
  const [spotlightElement, setSpotlightElement] = useState<HTMLElement | null>(null)
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null)
  const guideRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Guide steps with clear instructions and targeted elements
  const steps: GuideStep[] = [
    {
      title: "Welcome to DHARTI Portal",
      description:
        "This official portal lets you access digital property records across India. Let's explore the key features to help you find what you need.",
      icon: <FileText className="h-12 w-12 text-primary" />,
      position: "center",
    },
    {
      title: "Search for Properties",
      description:
        "Start by searching for properties using an ID, owner name, or address. This is the fastest way to find specific property records.",
      target: "form#property-search", // More specific selector
      icon: <Search className="h-12 w-12 text-amber-500" />,
      position: "bottom",
    },
    {
      title: "Explore Map View",
      description:
        "Use our interactive map to explore properties in specific areas. You can zoom in, select regions, and view property details directly.",
      target: "nav a[href='/search-by-map'], a[href='/search-by-map']", // Fallback selectors
      icon: <MapPin className="h-12 w-12 text-green-600" />,
      position: "top",
    },
    {
      title: "Check Disputed Properties",
      description:
        "Properties with ongoing legal disputes are clearly marked. You can search specifically for disputed properties in any location.",
      target: "nav a[href='/search-by-disputed-property'], a[href='/search-by-disputed-property']", // Fallback selectors
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      position: "right", // Changed from left for better visibility
    },
    {
      title: "Ready to Explore!",
      description:
        "You now know the essential features of DHARTI Portal. Click the help icon anytime to revisit this guide. Start exploring India's digital property records!",
      icon: <User className="h-12 w-12 text-primary" />,
      position: "center",
    },
  ]

  // Check if user has completed the guide previously
  useEffect(() => {
    try {
      const completionStatus = localStorage.getItem(GUIDE_STORAGE_KEY)
      setHasCompleted(completionStatus === "true")

      // Show guide automatically for first-time visitors
      if (completionStatus !== "true") {
        // Wait a bit longer to ensure page is fully loaded
        const timer = setTimeout(() => setIsOpen(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      // Handle potential localStorage errors (e.g., in incognito mode)
      console.warn("Could not access localStorage:", error)
      // Don't auto-show guide if we can't verify completion status
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          closeGuide()
          break
        case "ArrowRight":
        case "Enter":
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
          } else {
            completeGuide()
          }
          break
        case "ArrowLeft":
          if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentStep, steps.length])

  // Find and highlight target elements
  useEffect(() => {
    if (!isOpen) {
      setSpotlightElement(null)
      setSpotlightRect(null)
      return
    }

    const step = steps[currentStep]

    // Clear spotlight when no target is present
    if (!step?.target) {
      setSpotlightElement(null)
      setSpotlightRect(null)
      return
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      try {
        // Find the target element
        const element = step.target ? (document.querySelector(step.target) as HTMLElement) : null

        if (element) {
          setSpotlightElement(element)

          // Update spotlight dimensions on resize and scroll
          const updateRect = () => {
            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
              if (!element) return

              const rect = element.getBoundingClientRect()
              setSpotlightRect(rect)

              // Ensure element is in view
              const isInView =
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth

              if (!isInView) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                })
              }
            })
          }

          // Initial update
          updateRect()

          // Add event listeners for responsive updating
          window.addEventListener("resize", updateRect)
          window.addEventListener("scroll", updateRect)

          return () => {
            window.removeEventListener("resize", updateRect)
            window.removeEventListener("scroll", updateRect)
          }
        } else {
          console.warn(`Target element "${step.target}" not found`)
          setSpotlightElement(null)
          setSpotlightRect(null)
        }
      } catch (error) {
        console.error("Failed to find target element:", error)
        setSpotlightElement(null)
        setSpotlightRect(null)
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [currentStep, isOpen, steps])

  // Mark guide as completed
  const completeGuide = () => {
    localStorage.setItem(GUIDE_STORAGE_KEY, "true")
    setHasCompleted(true)
    closeGuide()
  }

  // Open the guide
  const openGuide = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  // Close the guide
  const closeGuide = () => {
    setIsOpen(false)
  }

  // Go to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeGuide()
    }
  }

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calculate guide card position based on target and step configuration
  const getGuidePosition = () => {
    const step = steps[currentStep]

    // Default center position for steps without targets or on mobile
    if (!step.target || !spotlightRect || isMobile) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: isMobile ? "90%" : "400px",
        width: isMobile ? "90%" : "auto",
        zIndex: 60,
      }
    }

    const buffer = 20 // Space between guide and target
    const position = step.position || "bottom"

    // Check if there's enough space in the preferred position
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Get element dimensions
    const targetTop = spotlightRect.top
    const targetBottom = spotlightRect.bottom
    const targetLeft = spotlightRect.left
    const targetRight = spotlightRect.right
    const targetWidth = spotlightRect.width
    const targetHeight = spotlightRect.height

    const guideWidth = 400 // Estimated width
    const guideHeight = 300 // Estimated height

    // Function to determine best position
    const getBestPosition = () => {
      // Space available in each direction
      const spaceAbove = targetTop
      const spaceBelow = windowHeight - targetBottom
      const spaceLeft = targetLeft
      const spaceRight = windowWidth - targetRight

      // Preferred position
      if (position === "top" && spaceAbove >= guideHeight + buffer) {
        return "top"
      }
      if (position === "bottom" && spaceBelow >= guideHeight + buffer) {
        return "bottom"
      }
      if (position === "left" && spaceLeft >= guideWidth + buffer) {
        return "left"
      }
      if (position === "right" && spaceRight >= guideWidth + buffer) {
        return "right"
      }

      // Find alternative with most space
      const spaces = [
        { pos: "bottom", space: spaceBelow },
        { pos: "top", space: spaceAbove },
        { pos: "right", space: spaceRight },
        { pos: "left", space: spaceLeft }
      ]

      spaces.sort((a, b) => b.space - a.space)
      return spaces[0].pos
    }

    // Get optimal position
    const bestPosition = getBestPosition()

    // Position styles
    switch (bestPosition) {
      case "top":
        return {
          position: "fixed",
          bottom: `${windowHeight - targetTop + buffer}px`,
          left: `${targetLeft + targetWidth / 2}px`,
          transform: "translateX(-50%)",
          maxWidth: "400px",
          zIndex: 60,
        }
      case "right":
        return {
          position: "fixed",
          left: `${targetRight + buffer}px`,
          top: `${targetTop + targetHeight / 2}px`,
          transform: "translateY(-50%)",
          maxWidth: "400px",
          zIndex: 60,
        }
      case "bottom":
        return {
          position: "fixed",
          top: `${targetBottom + buffer}px`,
          left: `${targetLeft + targetWidth / 2}px`,
          transform: "translateX(-50%)",
          maxWidth: "400px",
          zIndex: 60,
        }
      case "left":
        return {
          position: "fixed",
          right: `${windowWidth - targetLeft + buffer}px`,
          top: `${targetTop + targetHeight / 2}px`,
          transform: "translateY(-50%)",
          maxWidth: "400px",
          zIndex: 60,
        }
      default:
        // Fallback to center if all else fails
        return {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "400px",
          zIndex: 60,
        }
    }
  }

  return (
    <>
      {/* Help button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={openGuide}
              className="rounded-full relative"
              aria-label="Open help guide"
            >
              <HelpCircle className="h-5 w-5" />
              {!hasCompleted && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Guide overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with spotlight effect - fixed to avoid style conflicts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
            >
              {spotlightRect && (
                <div
                  className="absolute bg-transparent"
                  style={{
                    top: spotlightRect.top - 4,
                    left: spotlightRect.left - 4,
                    width: spotlightRect.width + 8,
                    height: spotlightRect.height + 8,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                    borderRadius: '4px'
                  }}
                />
              )}
            </motion.div>

            {/* Highlight border around targeted element */}
            {spotlightRect && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fixed pointer-events-none z-55"
                style={{
                  top: spotlightRect.top - 4,
                  left: spotlightRect.left - 4,
                  width: spotlightRect.width + 8,
                  height: spotlightRect.height + 8,
                  border: "2px solid #00008B",
                  borderRadius: "4px",
                  boxShadow: "0 0 0 4px rgba(0, 0, 139, 0.3)",
                  zIndex: 51,
                }}
              />
            )}

            {/* Guide card */}
            <motion.div
              ref={guideRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-6 border border-gray-200"
              style={{ ...getGuidePosition() } as React.CSSProperties}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guide-title"
            >
              {/* Close button */}
              <button
                onClick={closeGuide}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                aria-label="Close guide"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6 overflow-hidden">
                <motion.div
                  className="bg-primary h-full"
                  initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Icon */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-50 p-4 rounded-full">
                  {steps[currentStep].icon}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                key={currentStep}
                className="mb-4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 id="guide-title" className="text-xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  {steps[currentStep].description}
                </p>
              </motion.div>

              {/* Step dots for direct navigation on desktop */}
              {!isMobile && (
                <div className="flex justify-center gap-1.5 my-4" role="tablist">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${currentStep === index
                          ? "bg-primary"
                          : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      aria-label={`Go to step ${index + 1}: ${step.title}`}
                      aria-selected={currentStep === index}
                      role="tab"
                    />
                  ))}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 0 ? (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div /> // Empty div for spacing
                )}

                <Button
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={currentStep < steps.length - 1 ? "Next step" : "Complete guide"}
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}