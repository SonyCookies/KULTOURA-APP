"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"

type TeamInfoProps = {
  team: {
    id: string
    name: string
    performance: string
    members: number
  }
  teamIndex: number
  totalTeams: number
  currentScore: number
  maxScore: number
  usePercentage?: boolean
}

export default function TeamInfo({
  team,
  teamIndex,
  totalTeams,
  currentScore,
  maxScore,
  usePercentage = false,
}: TeamInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-black/30 backdrop-blur-sm rounded-xl border border-[#C8A887]/20 p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#C8A887] mb-1">{team.name}</h2>
          <p className="text-white/80 mb-2">{team.performance}</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#A97C50]/20 text-[#C8A887]">
              <Users size={14} /> {team.members} Members
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#A97C50]/20 text-[#C8A887]">
              Team {teamIndex + 1} of {totalTeams}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold text-[#C8A887]">
            {usePercentage ? `${currentScore.toFixed(1)}%` : currentScore}
          </div>
          <div className="text-sm text-[#A97C50]">{usePercentage ? "Overall Score" : `of ${maxScore} points`}</div>
          <div className="w-full bg-[#A97C50]/20 h-2 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C8A887] to-[#A97C50]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentScore / maxScore) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
