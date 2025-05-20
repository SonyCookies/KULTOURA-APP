"use client"

import { motion } from "framer-motion"

type CriterionScorerProps = {
  criterion: {
    id: string
    name: string
    description: string
    maxScore?: number
    percentage?: number
  }
  score: number
  onChange: (value: number) => void
  animationDelay?: number
  usePercentage?: boolean
}

export default function CriterionScorer({
  criterion,
  score,
  onChange,
  animationDelay = 0,
  usePercentage = false,
}: CriterionScorerProps) {
  const maxValue = usePercentage ? 100 : criterion.maxScore || 0
  const weightText = usePercentage ? `${criterion.percentage}%` : `${criterion.maxScore} points`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + animationDelay }}
      className="bg-black/30 backdrop-blur-sm rounded-xl border border-[#C8A887]/20 p-6"
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="md:w-1/2">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-[#C8A887]">{criterion.name}</h3>
            <span className="text-sm font-medium bg-[#C8A887]/20 text-[#C8A887] px-2 py-0.5 rounded-full">
              {weightText}
            </span>
          </div>
          <p className="text-white/70 text-sm mb-2">{criterion.description}</p>
        </div>

        <div className="md:w-1/2 flex flex-col items-center">
          <div className="text-3xl font-bold text-[#C8A887] mb-2">{usePercentage ? `${score}%` : score}</div>
          <div className="w-full max-w-xs">
            <input
              type="range"
              min="0"
              max={maxValue}
              value={score}
              onChange={(e) => onChange(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-[#A97C50]/30 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#A97C50] mt-1">
              <span>0{usePercentage ? "%" : ""}</span>
              <span>
                {Math.floor(maxValue / 2)}
                {usePercentage ? "%" : ""}
              </span>
              <span>
                {maxValue}
                {usePercentage ? "%" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
