"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowRight, Award, BookOpen, Users, Clock, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showElements, setShowElements] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<
    Array<{
      id: number
      width: number
      height: number
      left: string
      top: string
      opacity: number
      duration: number
      delay: number
    }>
  >([])

  // Generate particles only on client-side
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 1,
      height: Math.random() * 6 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  // Control the staggered appearance of elements
  useEffect(() => {
    setShowElements(true)
  }, [])

  const handleStart = (route: string) => {
    setSelectedOption(route)
    setIsAnimating(true)
    // Delay navigation to allow for animation
    setTimeout(() => {
      router.push(`/${route}`)
    }, 800)
  }

  // Kiosk options
  const options = [
    {
      id: "scoring",
      title: "Scoring System",
      description: "Judge performances and submit scores",
      icon: <Award className="w-10 h-10" />,
      color: "from-amber-500 to-amber-700",
    },
    {
      id: "history",
      title: "Philippine History",
      description: "Explore cultural heritage and historical events",
      icon: <BookOpen className="w-10 h-10" />,
      color: "from-emerald-500 to-emerald-700",
    },
    {
      id: "participants",
      title: "Participants",
      description: "View teams and contestant information",
      icon: <Users className="w-10 h-10" />,
      color: "from-sky-500 to-sky-700",
    },
    {
      id: "schedule",
      title: "Event Schedule",
      description: "Check upcoming performances and activities",
      icon: <Clock className="w-10 h-10" />,
      color: "from-rose-500 to-rose-700",
    },
  ]

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#1A0F0B] via-[#2D1A14] to-[#3D2A22] text-white"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0B]/80 via-transparent to-[#1A0F0B]/80 z-10"></div>

        {/* Animated particles - Fixed version */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-[#C8A887]"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] opacity-20"
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

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vh] h-[100vh] rounded-full border border-[#A97C50]/10"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-20 h-full flex flex-col items-center justify-between px-4 py-8">
        <AnimatePresence>
          {showElements && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Logo container with 3D effect */}
              <div className="relative w-full flex flex-col items-center mb-8">
                {/* Glow effect behind logo */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200, 168, 135, 0.4) 0%, rgba(169, 124, 80, 0.2) 50%, transparent 80%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Main logo with 3D transform effect */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative z-10 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mb-6"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    animate={{
                      rotateX: [0, 2, 0, -2, 0],
                      rotateY: [0, -2, 0, 2, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full"
                  >
                    <Image
                      src="/logo/logo.png"
                      alt="KULTOURA"
                      width={400}
                      height={120}
                      className="h-auto w-full drop-shadow-[0_0_15px_rgba(200,168,135,0.5)]"
                      priority
                    />
                  </motion.div>
                </motion.div>

                {/* Text logo with reveal animation */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="relative z-10 w-full max-w-[700px] mx-auto"
                >
                  <div className="w-full aspect-[10/3] relative">
                    <Image
                      src="/logo/text_logo.png"
                      alt="KULTOURA Logo"
                      fill
                      className="object-contain drop-shadow-[0_0_15px_rgba(200,168,135,0.7)]"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Animated sparkles around logo */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const positions = [
                      { top: "20%", left: "30%" },
                      { top: "15%", left: "70%" },
                      { top: "60%", left: "20%" },
                      { top: "70%", left: "80%" },
                      { top: "40%", left: "15%" },
                      { top: "30%", left: "85%" },
                      { top: "80%", left: "40%" },
                      { top: "10%", left: "50%" },
                    ]

                    return (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={positions[i]}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + (i % 3),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.5,
                        }}
                      >
                        <Sparkles className="text-[#C8A887] w-4 h-4" />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Button with advanced effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="relative z-10 mb-12"
        >
          <button
            onClick={() => handleStart("scoring")}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#A97C50] to-[#8D6E63] px-10 sm:px-12 md:px-16 py-5 sm:py-6 text-lg sm:text-xl md:text-2xl font-bold text-white shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(200,168,135,0.6)] hover:scale-105 focus:outline-none"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              START <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>

            {/* Button background animation */}
            <motion.span
              className="absolute inset-0 z-0"
              initial={{ background: "linear-gradient(to right, #A97C50, #8D6E63)" }}
              animate={{
                background: isHovering
                  ? "linear-gradient(to right, #8D6E63, #A97C50)"
                  : "linear-gradient(to right, #A97C50, #8D6E63)",
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Button glow effect */}
            <motion.span
              className="absolute inset-0 -z-10 blur-xl opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(200, 168, 135, 0.8) 0%, rgba(169, 124, 80, 0.4) 50%, transparent 80%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Button border glow */}
            <span className="absolute inset-0 rounded-full border border-[#C8A887]/30"></span>
            <span className="absolute inset-[-2px] rounded-full border border-[#C8A887]/20"></span>
            <span className="absolute inset-[-4px] rounded-full border border-[#C8A887]/10"></span>
          </button>
        </motion.div>

        {/* Footer with animated gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="relative text-center text-sm"
        >
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#C8A887]/0 via-[#C8A887]/20 to-[#C8A887]/0 blur-sm"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-[#C8A887]">© 2023 KULTOURA Multicultural Awareness Event</p>
          <p className="mt-1 text-[#A97C50]/80">Press START to begin your journey</p>
        </motion.div>
      </div>
    </div>
  )
}
