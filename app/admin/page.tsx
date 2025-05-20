"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Users, Check, Shield, Palette, Video, Mic } from "lucide-react"
import { getActiveEvents, setEventActive, setCurrentTeam, getEventCurrentTeam } from "@/lib/admin-actions"

type EventStatus = {
  id: string
  isActive: boolean
  currentTeamId: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [eventStatuses, setEventStatuses] = useState<EventStatus[]>([])
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Event data
  const events = [
    {
      id: "mini-museum",
      title: "MINI-MUSEUM COMPETITION 2025",
      icon: <Palette className="h-6 w-6" />,
      color: "from-amber-500 to-amber-700",
      teams: [
        { id: "3F1", name: "3F1", performance: "Mini-Museum Exhibit" },
        { id: "2C1", name: "2C1", performance: "Mini-Museum Exhibit" },
        { id: "2C2", name: "2C2", performance: "Mini-Museum Exhibit" },
        { id: "2C3", name: "2C3", performance: "Mini-Museum Exhibit" },
        { id: "2D1", name: "2D1", performance: "Mini-Museum Exhibit" },
        { id: "2D2", name: "2D2", performance: "Mini-Museum Exhibit" },
        { id: "2D3", name: "2D3", performance: "Mini-Museum Exhibit" },
        { id: "2D4", name: "2D4", performance: "Mini-Museum Exhibit" },
      ],
    },
    {
      id: "festival-dance",
      title: "FESTIVAL DANCE COMPETITION 2025",
      icon: <Users className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-700",
      teams: [
        { id: "team1", name: "Team Mindanao", performance: "Singkil - Royal Maranao Dance" },
        { id: "team2", name: "Team Luzon", performance: "Tinikling - Bamboo Dance" },
        { id: "team3", name: "Team Visayas", performance: "Pandanggo sa Ilaw - Dance with Lights" },
        { id: "team4", name: "Team Cordillera", performance: "Banga - Pot Dance" },
      ],
    },
    {
      id: "cultural-royalty",
      title: "MR. & MS. CULTURAL ROYALTY 2025",
      icon: <Shield className="h-6 w-6" />,
      color: "from-blue-500 to-blue-700",
      teams: [
        { id: "team1", name: "Candidate 1", performance: "Luzon Region" },
        { id: "team2", name: "Candidate 2", performance: "Visayas Region" },
        { id: "team3", name: "Candidate 3", performance: "Mindanao Region" },
        { id: "team4", name: "Candidate 4", performance: "NCR Region" },
      ],
    },
    {
      id: "promotional-video",
      title: "PROMOTIONAL VIDEO COMPETITION 2025",
      icon: <Video className="h-6 w-6" />,
      color: "from-purple-500 to-purple-700",
      teams: [
        { id: "team1", name: "Digital Creatives", performance: "Heritage in Motion" },
        { id: "team2", name: "Cine Filipino", performance: "Traditions Reimagined" },
        { id: "team3", name: "Visual Storytellers", performance: "Cultural Journeys" },
        { id: "team4", name: "Media Arts Collective", performance: "Roots and Wings" },
      ],
    },
    {
      id: "speech-choir",
      title: "SPEECH CHOIR 2025",
      icon: <Mic className="h-6 w-6" />,
      color: "from-rose-500 to-rose-700",
      teams: [
        { id: "team1", name: "Voices of Manila", performance: "Echoes of History" },
        { id: "team2", name: "Harmonic Speakers", performance: "Islands of Diversity" },
        { id: "team3", name: "Rhythmic Ensemble", performance: "Freedom's Call" },
        { id: "team4", name: "Choral Narrators", performance: "Legends of the Archipelago" },
      ],
    },
  ]

  // Load initial event statuses
  useEffect(() => {
    const loadEventStatuses = async () => {
      try {
        const activeEvents = await getActiveEvents()

        // Initialize event statuses
        const statuses = await Promise.all(
          events.map(async (event) => {
            const isActive = activeEvents.includes(event.id)
            const currentTeamId = isActive ? await getEventCurrentTeam(event.id) : null

            return {
              id: event.id,
              isActive,
              currentTeamId,
            }
          }),
        )

        setEventStatuses(statuses)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load event statuses:", error)
        setIsLoading(false)
      }
    }

    loadEventStatuses()
  }, [])

  // Toggle event active status
  const toggleEventActive = async (eventId: string) => {
    setIsUpdating(eventId)

    try {
      const currentStatus = eventStatuses.find((e) => e.id === eventId)
      if (!currentStatus) return

      const newStatus = !currentStatus.isActive
      await setEventActive(eventId, newStatus)

      // If deactivating, also clear the current team
      if (!newStatus && currentStatus.currentTeamId) {
        await setCurrentTeam(eventId, "")
      }

      setEventStatuses((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, isActive: newStatus, currentTeamId: newStatus ? e.currentTeamId : null } : e,
        ),
      )
    } catch (error) {
      console.error(`Failed to update event ${eventId} status:`, error)
    } finally {
      setIsUpdating(null)
    }
  }

  // Set current team for an event
  const handleSetCurrentTeam = async (eventId: string, teamId: string) => {
    setIsUpdating(`${eventId}-${teamId}`)

    try {
      await setCurrentTeam(eventId, teamId)

      setEventStatuses((prev) => prev.map((e) => (e.id === eventId ? { ...e, currentTeamId: teamId } : e)))
    } catch (error) {
      console.error(`Failed to set current team for event ${eventId}:`, error)
    } finally {
      setIsUpdating(null)
    }
  }

  // Loading state
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
          Loading admin panel...
        </motion.p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#1A0F0B] via-[#2D1A14] to-[#3D2A22] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0B]/80 via-transparent to-[#1A0F0B]/80 z-10"></div>

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
      <header className="relative z-20 py-6 px-8 flex items-center justify-between border-b border-[#C8A887]/20">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#C8A887] hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </motion.button>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-full bg-gradient-to-br from-red-500/80 to-red-700/80 text-white">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#C8A887]">KULTOURA Admin Panel</h1>
        </motion.div>
        <div className="w-[100px]"></div> {/* Spacer for balance */}
      </header>

      {/* Main content */}
      <main className="relative z-20 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-[#C8A887] mb-2">Event Control Panel</h2>
          <p className="text-white/70">
            Control which events are visible to judges and which teams are currently performing.
          </p>
        </motion.div>

        {/* Event control cards */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const status = eventStatuses.find((e) => e.id === event.id) || {
              id: event.id,
              isActive: false,
              currentTeamId: null,
            }

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`bg-black/30 backdrop-blur-sm rounded-xl border ${
                  status.isActive ? "border-[#C8A887] shadow-[0_0_15px_rgba(200,168,135,0.2)]" : "border-[#C8A887]/20"
                } overflow-hidden`}
              >
                {/* Event header */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#C8A887]/10">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${event.color} text-white`}>{event.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-[#C8A887]">{event.title}</h3>
                      <p className="text-white/60 text-sm">
                        {status.isActive ? "Event is visible to judges" : "Event is hidden from judges"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleEventActive(event.id)}
                    disabled={isUpdating === event.id}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      status.isActive
                        ? "bg-[#C8A887]/20 text-[#C8A887] hover:bg-[#C8A887]/30"
                        : "bg-[#C8A887] text-[#1A0F0B] hover:bg-[#C8A887]/90"
                    }`}
                  >
                    {isUpdating === event.id ? (
                      <span>Updating...</span>
                    ) : status.isActive ? (
                      <>
                        <EyeOff size={18} />
                        <span>Hide Event</span>
                      </>
                    ) : (
                      <>
                        <Eye size={18} />
                        <span>Show Event</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Team selection - only show when event is active */}
                {status.isActive && (
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-[#C8A887] mb-4">Select Current Performing Team</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {event.teams.map((team) => (
                        <button
                          key={team.id}
                          onClick={() => handleSetCurrentTeam(event.id, team.id)}
                          disabled={isUpdating === `${event.id}-${team.id}`}
                          className={`p-4 rounded-lg border ${
                            status.currentTeamId === team.id
                              ? "border-[#C8A887] bg-[#C8A887]/20"
                              : "border-[#C8A887]/10 bg-black/20 hover:bg-black/30"
                          } transition-all`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-[#C8A887]">{team.name}</span>
                            {status.currentTeamId === team.id && (
                              <span className="bg-[#C8A887] text-[#1A0F0B] rounded-full p-1">
                                <Check size={14} />
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60">{team.performance}</p>

                          {isUpdating === `${event.id}-${team.id}` && (
                            <p className="text-xs text-[#C8A887] mt-2">Setting as current...</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#C8A887]/20 py-4 px-6 text-center text-[#A97C50]/70 text-sm">
        <p>© 2025 KULTOURA Multicultural Awareness Event - Admin Panel</p>
      </footer>
    </div>
  )
}
