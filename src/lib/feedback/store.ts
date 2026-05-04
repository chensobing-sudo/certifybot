import { FeedbackEntry, FeedbackFormData } from "./types"

import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readLocal(): FeedbackEntry[] {
  ensureDataDir()
  if (!fs.existsSync(FEEDBACK_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"))
  } catch {
    return []
  }
}

function writeLocal(entries: FeedbackEntry[]) {
  ensureDataDir()
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(entries, null, 2), "utf-8")
}

export async function submitFeedback(data: FeedbackFormData): Promise<FeedbackEntry> {
  const entries = readLocal()
  const entry: FeedbackEntry = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString(),
  }
  entries.push(entry)
  writeLocal(entries)
  return entry
}

export async function getAllFeedback(): Promise<FeedbackEntry[]> {
  const entries = readLocal()
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getFeedbackStats() {
  const entries = readLocal()
  const total = entries.length
  const byCategory: Record<string, number> = {}
  const avgRating =
    total > 0
      ? entries.reduce((sum, e) => sum + e.rating, 0) / total
      : 0

  entries.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + 1
  })

  return { total, byCategory, avgRating: Math.round(avgRating * 10) / 10 }
}
