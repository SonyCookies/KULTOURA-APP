"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Save, RotateCcw, Palette, AlertCircle, RefreshCw } from "lucide-react"
import ScoringLayout from "@/components/scoring/scoring-layout"
import TeamInfo from "@/components/scoring/team-info"
import CriterionScorer from "@/components/scoring/criterion-scorer"
import { useScoring } from "@/hooks/use-scoring"
import { isEventActive, getEventCurrentTeam, getActiveEvents } from "@/lib/admin-actions"

// Mini Museum specific data
const EVENT_DATA = {
  id: "mini-museum",
  title: "Mini-Museum Competition",
  description: "Visual arts showcasing Philippine cultural themes and history",
  icon: <Palette className="w-8 h-8" />,
  color: "from-amber-500/80 to-amber-700/80",
  teams: [
    {
      id: "3F1",
      name: "3F1",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2C1",
      name: "2C1",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2C2",
      name: "2C2",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2C3",
      name: "2C3",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2D1",
      name: "2D1",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2D2",
      name: "2D2",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2D3",
      name: "2D3",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
    {
      id: "2D4",
      name: "2D4",
      performance: "Mini-Museum Exhibit",
      members: 4,
    },
  ],
  criteria: [
    {
      id: "cultural",
      name: "Cultural Authenticity & Educational Value",
      description:
        "Accuracy of cultural representation, depth of research, educational impact, and cultural sensitivity",
      percentage: 25,
    },
    {
      id: "curatorial",
      name: "Curatorial Excellence",
      description:
        "Thoughtful selection and arrangement of artifacts, coherent narrative flow, and thematic consistency",
      percentage: 20,
    },
    {
      id: "exhibition",
      name: "Exhibition Design",
      description:
        "Visual appeal, spatial organization, effective use of available space, and professional presentation",
      percentage: 15,
    },
    {
      id: "information",
      name: "Information Quality",
      description: "Accuracy, clarity, and comprehensiveness of artifact descriptions and contextual information",
      percentage: 15,
    },
    {
      id: "engagement",
      name: "Visitor Engagement",
      description:
        "Interactive elements, accessibility for diverse audiences, and effectiveness in stimulating interest",
      percentage: 10,
    },
    {
      id: "technical",
      name: "Technical Execution",
      description: "Quality of installation, lighting, conservation considerations, and attention to detail",
      percentage: 10,
    },
    {
      id: "innovation",
      name: "Innovation & Creativity",
      description:
        "Original approaches to exhibition design, creative problem-solving, and innovative presentation methods",
      percentage: 5,
    },
  ],
  usePercentageScoring: true,
}

export default function MiniMuseumScoringPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isEventEnabled, setIsEventEnabled] = useState(false)
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
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
  }, [])

  const {
    currentTeamIndex,
    scores,
    handleScoreChange,
    handleResetScores,
    handleSaveScores,
    saveStatus,
    calculatePercentageScore,
    setCurrentTeamIndex,
  } = useScoring(EVENT_DATA)

  // Check if event is active and get current team
  useEffect(() => {
    let isMounted = true

    const checkEventStatus = async () => {
      try {
        setIsPolling(true)

        // Check if event is active
        const active = await isEventActive(EVENT_DATA.id)

        if (!isMounted) return

        // If event is no longer active, redirect to scoring page
        if (!active && isEventEnabled) {
          router.push("/scoring")
          return
        }

        setIsEventEnabled(active)

        if (active) {
          // Get current team
          const teamId = await getEventCurrentTeam(EVENT_DATA.id)

          if (!isMounted) return

          // Check if team has changed
          if (teamId !== currentTeamId) {
            setCurrentTeamId(teamId)
            setLastUpdated(new Date())

            // Set current team index based on teamId
            if (teamId) {
              const index = EVENT_DATA.teams.findIndex((team) => team.id === teamId)
              if (index !== -1) {
                setCurrentTeamIndex(index)
              }
            }
          }
        }

        // Check if we should redirect to another event
        const activeEvents = await getActiveEvents()

        if (!isMounted) return

        // If this event is not active but another one is, redirect to the first active event
        if (!active && activeEvents.length > 0 && activeEvents[0] !== EVENT_DATA.id) {
          router.push(`/scoring/${activeEvents[0]}`)
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Failed to check event status:", error)
        if (isMounted) {
          setIsLoading(false)
        }
      } finally {
        if (isMounted) {
          setIsPolling(false)
        }
      }
    }

    checkEventStatus()

    // Poll for updates every 3 seconds
    const interval = setInterval(checkEventStatus, 3000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [currentTeamId, isEventEnabled, router, setCurrentTeamIndex])

  // If event is not enabled, show message
  if (!isLoading && !isEventEnabled) {
    return (
      <ScoringLayout
        eventTitle={EVENT_DATA.title}
        eventIcon={EVENT_DATA.icon}
        eventColor={EVENT_DATA.color}
        onBackClick={() => router.push("/scoring")}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="bg-[#C8A887]/10 p-6 rounded-full mb-6">
            <AlertCircle size={60} className="text-[#C8A887]" />
          </div>
          <h2 className="text-2xl font-bold text-[#C8A887] mb-4">Event Not Active</h2>
          <p className="text-white/70 max-w-lg">
            This event is currently not active for scoring. Please check back later or contact the event administrator.
          </p>
          <button
            onClick={() => router.push("/scoring")}
            className="mt-8 px-6 py-3 bg-[#C8A887] text-[#1A0F0B] rounded-lg hover:bg-[#C8A887]/90 transition-colors"
          >
            Return to Events
          </button>
        </motion.div>
      </ScoringLayout>
    )
  }

  // If no team is selected, show message
  if (!isLoading && isEventEnabled && !currentTeamId) {
    return (
      <ScoringLayout
        eventTitle={EVENT_DATA.title}
        eventIcon={EVENT_DATA.icon}
        eventColor={EVENT_DATA.color}
        onBackClick={() => router.push("/scoring")}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="bg-[#C8A887]/10 p-6 rounded-full mb-6">
            <AlertCircle size={60} className="text-[#C8A887]" />
          </div>
          <h2 className="text-2xl font-bold text-[#C8A887] mb-4">Waiting for Team Selection</h2>
          <p className="text-white/70 max-w-lg">
            No team is currently selected for scoring. Please wait for the event administrator to select a team.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse delay-300"></div>
            <div className="w-2 h-2 rounded-full bg-[#C8A887] animate-pulse delay-600"></div>
          </div>
        </motion.div>
      </ScoringLayout>
    )
  }

  const currentTeam = EVENT_DATA.teams[currentTeamIndex]
  const totalPercentage = EVENT_DATA.criteria.reduce((sum, criterion) => sum + criterion.percentage, 0)

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

      <ScoringLayout
        eventTitle={EVENT_DATA.title}
        eventIcon={EVENT_DATA.icon}
        eventColor={EVENT_DATA.color}
        onBackClick={() => router.push("/scoring")}
      >
        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-black/30 backdrop-blur-sm rounded-lg border border-[#C8A887]/20 p-3 flex items-center gap-2"
        >
          <RefreshCw size={16} className={`text-[#C8A887] ${isPolling ? "animate-spin" : ""}`} />
          <span className="text-[#C8A887]/80 text-sm">
            {isPolling ? "Checking for updates..." : "Listening for team changes"}
            {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
          </span>
        </motion.div>

        {/* Team info card */}
        <TeamInfo
          team={currentTeam}
          teamIndex={currentTeamIndex}
          totalTeams={EVENT_DATA.teams.length}
          currentScore={calculatePercentageScore(currentTeam.id)}
          maxScore={100}
          usePercentage={true}
        />

        {/* Scoring criteria */}
        <div className="space-y-6 mb-8">
          {EVENT_DATA.criteria.map((criterion, index) => (
            <CriterionScorer
              key={criterion.id}
              criterion={criterion}
              score={scores[currentTeam.id]?.[criterion.id] || 0}
              onChange={(value) => handleScoreChange(currentTeam.id, criterion.id, value)}
              animationDelay={index * 0.1}
              usePercentage={true}
            />
          ))}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex justify-end items-center gap-4"
        >
          <button
            onClick={handleResetScores}
            className="px-6 py-3 rounded-lg border-2 border-[#C8A887]/50 text-[#C8A887] flex items-center space-x-2 hover:bg-[#C8A887]/10 transition-colors"
          >
            <RotateCcw size={20} />
            <span>Reset Scores</span>
          </button>

          <button
            onClick={handleSaveScores}
            disabled={saveStatus === "saving"}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              saveStatus === "saved"
                ? "bg-green-600/80 text-white"
                : saveStatus === "error"
                  ? "bg-red-600/80 text-white"
                  : "bg-[#C8A887] text-[#1A0F0B] hover:bg-[#C8A887]/90"
            }`}
          >
            <Save size={20} />
            <span>
              {saveStatus === "idle" && "Save Scores"}
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "saved" && "Saved!"}
              {saveStatus === "error" && "Error!"}
            </span>
          </button>
        </motion.div>
      </ScoringLayout>
    </div>
  )
}
