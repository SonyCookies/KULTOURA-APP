"use client"

import { useState, useEffect, type ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Award } from "lucide-react"

type ScoringLayoutProps = {
  children: ReactNode
  eventTitle: string
  eventIcon: ReactNode
  eventColor: string
  onBackClick: () => void
}

export default function ScoringLayout({
  children,
  eventTitle,
  eventIcon,
  eventColor,
  onBackClick,
}: ScoringLayoutProps) {
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

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Loading screen
  if (isLoading) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#1A0F0B] via-[#2D1A14] to-[#3D2A22] text-white flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(200, 168, 135, 0.4) 0%, rgba(169, 124, 80, 0.2) 50%, transparent 80%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Image
              src="/logo/logo.png"
              alt="KULTOURA"
              width={150}
              height={150}
              className="h-auto w-full drop-shadow-[0_0_15px_rgba(200,168,135,0.5)]"
              priority
            />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute mt-40 text-[#C8A887]"
        >
          Loading event data...
        </motion.p>
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
      <header className="relative z-20 py-4 px-6 flex items-center justify-center border-b border-[#C8A887]/20">

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className={`p-2 rounded-full bg-gradient-to-br ${eventColor} text-white`}>{eventIcon}</div>
          <h1 className="text-xl font-bold text-[#C8A887]">{eventTitle}</h1>
        </motion.div>

      </header>

      {/* Main content */}
      <main className="relative z-20 container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#C8A887]/20 py-4 px-6 text-center text-[#A97C50]/70 text-sm">
        <p>© 2025 KULTOURA Multicultural Awareness Event</p>
      </footer>
    </div>
  )
}
