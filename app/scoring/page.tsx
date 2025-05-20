"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react"
import { getActiveEvents } from "@/lib/admin-actions"

export default function ScoringPage() {
  const router = useRouter()
  const [particles, setParticles] = useState<
    Array<{
      id: number
      width: string
      height: string
      left: string
      top: string
      opacity: string
      duration: number
      delay: number
    }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [activeEvents, setActiveEvents] = useState<string[]>([])
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoNavigationEnabled, setAutoNavigationEnabled] = useState(true)

  // Generate particles only on client-side
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: `${Math.random() * 0.3 + 0.1}`,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)

    // Simulate loading with progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      }
      setLoadingProgress(progress)
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Load active events and poll for updates
  useEffect(() => {
    let isMounted = true

    const loadActiveEvents = async () => {
      try {
        setIsPolling(true)
        const events = await getActiveEvents()

        if (isMounted) {
          // Check if events have changed
          const hasChanged = JSON.stringify(events) !== JSON.stringify(activeEvents)

          if (hasChanged) {
            setActiveEvents(events)
            setLastUpdated(new Date())

            // Auto-navigate to the event if there's exactly one active event
            if (autoNavigationEnabled && events.length === 1) {
              router.push(`/scoring/${events[0]}`)
            }
          }
        }
      } catch (error) {
        console.error("Failed to load active events:", error)
      } finally {
        if (isMounted) {
          setIsPolling(false)
        }
      }
    }

    // Initial load
    loadActiveEvents()

    // Set up polling every 5 seconds
    const pollInterval = setInterval(loadActiveEvents, 5000)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [activeEvents, router, autoNavigationEnabled])

  // Event data with the actual events
  const events = [
    {
      id: "mini-museum",
      title: "MINI-MUSEUM COMPETITION 2025",
      iconPath: "/icons/museum-icon.png",
      color: "from-amber-500 to-amber-700",
    },
    {
      id: "festival-dance",
      title: "FESTIVAL DANCE COMPETITION 2025",
      iconPath: "/icons/dance-icon.png",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      id: "cultural-royalty",
      title: "MR. & MS. CULTURAL ROYALTY 2025",
      iconPath: "/icons/royalty-icon.png",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "promotional-video",
      title: "PROMOTIONAL VIDEO COMPETITION 2025",
      iconPath: "/icons/video-icon.png",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "speech-choir",
      title: "SPEECH CHOIR 2025",
      iconPath: "/icons/choir-icon.png",
      color: "from-rose-500 to-rose-700",
    },
  ]

  // Filter events to only show active ones
  const visibleEvents = events.filter((event) => activeEvents.includes(event.id))

  const handleSelectEvent = (eventId: string) => {
    // Navigate to the specific event scoring page
    router.push(`/scoring/${eventId}`)
  }

  const toggleAutoNavigation = () => {
    setAutoNavigationEnabled(!autoNavigationEnabled)
    // Store preference in localStorage
    localStorage.setItem("autoNavigationEnabled", (!autoNavigationEnabled).toString())
  }

  // Load auto-navigation preference from localStorage on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("autoNavigationEnabled")
    if (savedPreference !== null) {
      setAutoNavigationEnabled(savedPreference === "true")
    }
  }, [])

  // Premium loading screen
  if (isLoading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#1A0F0B] via-[#2D1A14] to-[#3D2A22] text-white flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0B]/80 via-transparent to-[#1A0F0B]/80 z-10"></div>

          {/* Animated light beams */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] opacity-10"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, #C8A887 0deg, transparent 60deg, #A97C50 120deg, transparent 180deg, #8D6E63 240deg, transparent 300deg, #C8A887 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Animated circles */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vh] h-[150vh] rounded-full border border-[#C8A887]/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>

        {/* Central loading content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-4">
          {/* Logo with elegant reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1], // Custom ease for elegant motion
            }}
            className="mb-12 relative"
          >
            {/* Pulsing glow behind logo */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(200, 168, 135, 0.6) 0%, rgba(169, 124, 80, 0.3) 50%, transparent 80%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Logo with 3D effect */}
            <motion.div
              className="relative z-10 w-[180px] h-[180px]"
              animate={{
                rotateY: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/logo/logo.png"
                alt="KULTOURA"
                width={180}
                height={180}
                className="h-auto w-full drop-shadow-[0_0_20px_rgba(200,168,135,0.7)]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text logo with fade in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-12 w-full max-w-[400px]"
          >
            <Image
              src="/logo/text_logo.png"
              alt="KULTOURA"
              width={400}
              height={120}
              className="h-auto w-full drop-shadow-[0_0_15px_rgba(200,168,135,0.6)]"
              priority
            />
          </motion.div>

          {/* Premium loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full max-w-[400px]"
          >
            {/* Elegant loading text */}
            <div className="flex justify-between items-center mb-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="text-[#C8A887] text-lg tracking-widest uppercase font-light"
              >
                Preparing Scoring System
              </motion.p>
              <p className="text-[#C8A887] font-medium">{Math.round(loadingProgress)}%</p>
            </div>

            {/* Elegant progress bar */}
            <div className="h-[2px] w-full bg-[#8D6E63]/20 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8A887] to-[#A97C50]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Animated dots */}
            <div className="flex justify-center mt-6 space-x-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#C8A887]"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#C8A887]"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: `${Math.random() * 0.3 + 0.1}`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.5, 0.1],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#1A0F0B] via-[#2D1A14] to-[#3D2A22] text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0B]/80 via-transparent to-[#1A0F0B]/80 z-10"></div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-[#C8A887]"
              style={{
                width: particle.width,
                height: particle.height,
                left: particle.left,
                top: particle.top,
                opacity: particle.opacity,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        {/* Animated light beams */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] opacity-10"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, #C8A887 0deg, transparent 60deg, #A97C50 120deg, transparent 180deg, #8D6E63 240deg, transparent 300deg, #C8A887 360deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 py-8 px-10 flex items-center justify-center border-b border-[#C8A887]/20">
        {/* Absolutely positioned back button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/")}
          className="absolute left-10 flex items-center gap-4 text-[#C8A887] hover:text-white transition-colors text-2xl bg-black/30 backdrop-blur-sm px-6 py-4 rounded-xl border border-[#C8A887]/30 hover:border-[#C8A887]/60 hover:shadow-[0_0_15px_rgba(200,168,135,0.3)]"
        >
          <ArrowLeft size={36} />
        </motion.button>

        {/* Centered logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-[300px]">
            <Image
              src="/logo/text_logo.png"
              alt="KULTOURA"
              width={400}
              height={120}
              className="h-auto w-full drop-shadow-[0_0_10px_rgba(200,168,135,0.6)] object-contain"
              priority
            />
          </div>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="relative z-20 container mx-auto px-6 py-10">
        {/* Status bar with auto-navigation toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-black/30 backdrop-blur-sm rounded-lg border border-[#C8A887]/20 p-4 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className={`text-[#C8A887] ${isPolling ? "animate-spin" : ""}`} />
            <span className="text-[#C8A887]/80 text-sm">
              {isPolling ? "Checking for updates..." : "Listening for event changes"}
              {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#C8A887]/80 text-sm">Auto-navigate to active event:</span>
            <button
              onClick={toggleAutoNavigation}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoNavigationEnabled ? "bg-[#C8A887]" : "bg-[#8D6E63]/30"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  autoNavigationEnabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </motion.div>

        {visibleEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-[#C8A887]/10 p-6 rounded-full mb-6">
              <AlertCircle size={60} className="text-[#C8A887]" />
            </div>
            <h2 className="text-2xl font-bold text-[#C8A887] mb-4">No Active Events</h2>
            <p className="text-white/70 max-w-lg">
              There are currently no events available for scoring. Please wait for the event administrator to activate
              an event.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse delay-300"></div>
              <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse delay-600"></div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[#C8A887] mb-8 text-center"
            >
              Select an Event to Score
            </motion.h2>

            {/* Event cards - Kiosk style with premium icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {visibleEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  onClick={() => handleSelectEvent(event.id)}
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-black/30 border-2 border-[#C8A887]/30 hover:border-[#C8A887] transition-all duration-300 h-full shadow-lg hover:shadow-[0_0_25px_rgba(200,168,135,0.3)]">
                    {/* Card background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-20 transition-opacity duration-300 hover:opacity-30`}
                    ></div>

                    {/* Premium icon design */}
                    <div className="p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
                      <div className="relative mb-6 w-32 h-32 flex items-center justify-center">
                        {/* Decorative circle behind icon */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C8A887]/20 to-[#8D6E63]/20"
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Decorative border */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#C8A887]/40"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.4, 0.7, 0.4],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        />

                        {/* Icon placeholder - using SVG for premium look */}
                        <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                          {event.id === "mini-museum" && (
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_0_8px_rgba(200,168,135,0.6)]"
                            >
                              <path
                                d="M48 12L12 28V36H84V28L48 12Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                              <path
                                d="M20 36V72H28V36"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M44 36V72H52V36"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M68 36V72H76V36"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 72H84"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M4 84H92"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}

                          {event.id === "festival-dance" && (
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_0_8px_rgba(200,168,135,0.6)]"
                            >
                              <path
                                d="M32 28C37.5228 28 42 23.5228 42 18C42 12.4772 37.5228 8 32 8C26.4772 8 22 12.4772 22 18C22 23.5228 26.4772 28 32 28Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M32 28V52C32 58 36 64 48 64C60 64 64 58 64 52V28"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M64 28C69.5228 28 74 23.5228 74 18C74 12.4772 69.5228 8 64 8C58.4772 8 54 12.4772 54 18C54 23.5228 58.4772 28 64 28Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M24 44H40"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M56 44H72"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M48 64V88"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M36 76L48 88L60 76"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}

                          {event.id === "cultural-royalty" && (
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_0_8px_rgba(200,168,135,0.6)]"
                            >
                              <path
                                d="M48 16L56 32L72 36L60 48L64 64L48 56L32 64L36 48L24 36L40 32L48 16Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                              <path
                                d="M32 76C32 76 36 72 48 72C60 72 64 76 64 76"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M24 84H72"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}

                          {event.id === "promotional-video" && (
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_0_8px_rgba(200,168,135,0.6)]"
                            >
                              <rect
                                x="8"
                                y="20"
                                width="80"
                                height="56"
                                rx="4"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                              <path
                                d="M64 48L40 32V64L64 48Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                          )}

                          {event.id === "speech-choir" && (
                            <svg
                              width="96"
                              height="96"
                              viewBox="0 0 96 96"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="drop-shadow-[0_0_8px_rgba(200,168,135,0.6)]"
                            >
                              <path
                                d="M24 36C29.5228 36 34 31.5228 34 26C34 20.4772 29.5228 16 24 16C18.4772 16 14 20.4772 14 26C14 31.5228 18.4772 36 24 36Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M48 36C53.5228 36 58 31.5228 58 26C58 20.4772 53.5228 16 48 16C42.4772 16 38 20.4772 38 26C38 31.5228 42.4772 36 48 36Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M72 36C77.5228 36 82 31.5228 82 26C82 20.4772 77.5228 16 72 16C66.4772 16 62 20.4772 62 26C62 31.5228 66.4772 36 72 36Z"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16 80V68C16 62 20 56 28 56H44"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M80 80V68C80 62 76 56 68 56H52"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M48 56V80"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M36 68H60"
                                stroke="#C8A887"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-[#C8A887] text-center">{event.title}</h3>

                      {/* Animated border on hover */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-[#C8A887] to-[#8D6E63]"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#C8A887]/20 py-6 px-8 text-center text-[#A97C50]/70 text-xl">
        <p>© 2025 KULTOURA Multicultural Awareness Event</p>
      </footer>
    </div>
  )
}
