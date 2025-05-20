"use client"

import { useState, useEffect } from "react"
import type { JSX } from "react"

type TeamData = {
  id: string
  name: string
  performance: string
  members: number
}

type CriterionData = {
  id: string
  name: string
  description: string
  maxScore?: number
  percentage?: number
}

type EventData = {
  id: string
  title: string
  description: string
  icon: JSX.Element
  color: string
  teams: TeamData[]
  criteria: CriterionData[]
  usePercentageScoring?: boolean
}

type ScoreData = Record<string, Record<string, number>>

export function useScoring(eventData: EventData) {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [scores, setScores] = useState<ScoreData>({})
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Initialize scores when event data is loaded
  useEffect(() => {
    const initialScores: ScoreData = {}
    eventData.teams.forEach((team) => {
      initialScores[team.id] = {}
      eventData.criteria.forEach((criterion) => {
        initialScores[team.id][criterion.id] = 0
      })
    })
    setScores(initialScores)
  }, [eventData])

  const handleScoreChange = (teamId: string, criterionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [criterionId]: value,
      },
    }))
  }

  const calculateTotal = (teamId: string): number => {
    if (!scores[teamId]) return 0
    return Object.values(scores[teamId]).reduce((sum, score) => sum + score, 0)
  }

  const calculatePercentageScore = (teamId: string): number => {
    if (!scores[teamId]) return 0

    let totalScore = 0
    let totalWeight = 0

    eventData.criteria.forEach((criterion) => {
      const criterionScore = scores[teamId][criterion.id] || 0
      const weight = criterion.percentage || 0

      // Calculate weighted score (percentage of the criterion's weight)
      totalScore += (criterionScore / 100) * weight
      totalWeight += weight
    })

    // Normalize to 100% if weights don't add up to 100
    if (totalWeight > 0 && totalWeight !== 100) {
      totalScore = (totalScore / totalWeight) * 100
    }

    return totalScore
  }

  const handlePrevTeam = () => {
    if (currentTeamIndex > 0) {
      setCurrentTeamIndex(currentTeamIndex - 1)
    }
  }

  const handleNextTeam = () => {
    if (currentTeamIndex < eventData.teams.length - 1) {
      setCurrentTeamIndex(currentTeamIndex + 1)
    }
  }

  const handleResetScores = () => {
    const teamId = eventData.teams[currentTeamIndex].id
    const resetTeamScores: Record<string, number> = {}

    eventData.criteria.forEach((criterion) => {
      resetTeamScores[criterion.id] = 0
    })

    setScores((prev) => ({
      ...prev,
      [teamId]: resetTeamScores,
    }))
  }

  const handleSaveScores = () => {
    setSaveStatus("saving")

    // Simulate API call
    setTimeout(() => {
      console.log("Saved scores:", scores)
      setSaveStatus("saved")

      // Reset status after showing success
      setTimeout(() => {
        setSaveStatus("idle")
      }, 2000)
    }, 1000)
  }

  return {
    currentTeamIndex,
    scores,
    handleScoreChange,
    handlePrevTeam,
    handleNextTeam,
    handleResetScores,
    handleSaveScores,
    saveStatus,
    calculateTotal,
    calculatePercentageScore,
    setCurrentTeamIndex,
  }
}
