"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Save, RotateCcw, Users, AlertCircle, RefreshCw } from "lucide-react"
import ScoringLayout from "@/components/scoring/scoring-layout"
import TeamInfo from "@/components/scoring/team-info"
import CriterionScorer from "@/components/scoring/criterion-scorer"
import { useScoring } from "@/hooks/use-scoring"
import { isEventActive, getEventCurrentTeam, getActiveEvents } from "@/lib/admin-actions"

// Festival Dance specific data
const EVENT_DATA = {
  id: "festival-dance",
  title: "Festival Dance Competition",
  description: "Traditional Filipino dance performances showcasing cultural heritage",
  icon: <Users className="w-8 h-8" />,
  color: "from-emerald-500/80 to-emerald-700/80",
  teams: [
    {
      id: "team1",
      name: "Team Mindanao",
      performance: "Singkil - Royal Maranao Dance",
      members: 8,
    },
    {
      id: "team2",
      name: "Team Luzon",
      performance: "Tinikling - Bamboo Dance",
      members: 6,
    },
    {
      id: "team3",
      name: "Team Visayas",
      performance: "Pandanggo sa Ilaw - Dance with Lights",
      members: 7,
    },
    {
      id: "team4",
      name: "Team Cordillera",
      performance: "Banga - Pot Dance",
      members: 5,
    },
  ],
  criteria: [
    {
      id: "technique",
      name: "Technical Execution",
      description: "Precision, timing, and skill in performing dance movements",
      maxScore: 30,
    },
    {
      id: "authenticity",
      name: "Cultural Authenticity",
      description: "Adherence to traditional elements and cultural significance",
      maxScore: 25,
    },
    {
      id: "performance",
      name: "Performance Quality",
      description: "Energy, expression, and audience engagement",
      maxScore: 25,
    },
    {
      id: "costume",
      name: "Costume & Props",
      description: "Appropriate and authentic costume and prop usage",
      maxScore: 20,
    },
  ],
}

export default function FestivalDanceScoringPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isEventEnabled, setIsEventEnabled] = useState(false)
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const {
    currentTeamIndex,
    scores,
    handleScoreChange,
    handlePrevTeam,
    handleNextTeam,
    handleResetScores,
    handleSaveScores,
    saveStatus,
    calculateTotal,
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
  const maxPossibleScore = EVENT_DATA.criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0)

  return (
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
        currentScore={calculateTotal(currentTeam.id)}
        maxScore={maxPossibleScore}
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
          />
        ))}
      </div>

      {/* Navigation and action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div className="flex space-x-4">
          <button
            onClick={handlePrevTeam}
            disabled={currentTeamIndex === 0 || currentTeamId !== null}
            className="px-6 py-3 rounded-lg bg-[#8D6E63]/80 text-white flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8D6E63] transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Previous Team</span>
          </button>

          <button
            onClick={handleNextTeam}
            disabled={currentTeamIndex === EVENT_DATA.teams.length - 1 || currentTeamId !== null}
            className="px-6 py-3 rounded-lg bg-[#A97C50]/80 text-white flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#A97C50] transition-colors"
          >
            <span>Next Team</span>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex space-x-4">
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
        </div>
      </motion.div>
    </ScoringLayout>
  )
}
