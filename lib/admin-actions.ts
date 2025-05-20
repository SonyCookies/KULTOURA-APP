"use server"

import fs from "fs"
import path from "path"
import { cache } from "react"

// Path to the JSON file that stores the state
const STATE_FILE_PATH = path.join(process.cwd(), "data", "admin-state.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Initialize the state file if it doesn't exist
const initStateFile = () => {
  ensureDataDir()

  if (!fs.existsSync(STATE_FILE_PATH)) {
    const initialState = {
      activeEvents: [],
      currentTeams: {},
    }
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(initialState, null, 2))
  }
}

// Read the state from the file
const readState = cache(() => {
  try {
    initStateFile()
    const data = fs.readFileSync(STATE_FILE_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading state file:", error)
    return { activeEvents: [], currentTeams: {} }
  }
})

// Write the state to the file
const writeState = async (state: any) => {
  try {
    ensureDataDir()
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2))
  } catch (error) {
    console.error("Error writing state file:", error)
    throw new Error("Failed to update state")
  }
}

// Get all active events
export async function getActiveEvents() {
  const state = readState()
  return state.activeEvents || []
}

// Check if an event is active
export async function isEventActive(eventId: string) {
  const activeEvents = await getActiveEvents()
  return activeEvents.includes(eventId)
}

// Set an event as active or inactive
export async function setEventActive(eventId: string, active: boolean) {
  const state = readState()

  if (active && !state.activeEvents.includes(eventId)) {
    state.activeEvents.push(eventId)
  } else if (!active) {
    state.activeEvents = state.activeEvents.filter((id: string) => id !== eventId)
  }

  await writeState(state)
  return true
}

// Get the current team for an event
export async function getEventCurrentTeam(eventId: string) {
  const state = readState()
  return state.currentTeams[eventId] || null
}

// Set the current team for an event
export async function setCurrentTeam(eventId: string, teamId: string) {
  const state = readState()

  state.currentTeams = {
    ...state.currentTeams,
    [eventId]: teamId,
  }

  await writeState(state)
  return true
}
