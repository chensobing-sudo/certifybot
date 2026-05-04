export type FeedbackCategory =
  | "bug"
  | "feature"
  | "experience"
  | "content"
  | "other"

export interface FeedbackEntry {
  id: string
  category: FeedbackCategory
  rating: number
  title: string
  content: string
  contact?: string
  page?: string
  createdAt: string
}

export interface FeedbackFormData {
  category: FeedbackCategory
  rating: number
  title: string
  content: string
  contact?: string
  page?: string
}
