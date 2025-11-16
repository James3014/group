// 核心数据类型 - 简单、直接、无废话

export type SkiLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Person {
  id: number
  name: string
  phone?: string
  ski_level: SkiLevel
  is_admin: boolean
  is_confirmed: boolean
  created_at?: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  author_id: number
  author?: Person
  created_at: string
}

export interface Meal {
  id: number
  restaurant: string
  meal_time: string
  notes?: string
  participant_ids?: number[]
}

export interface Transport {
  id: number
  vehicle_name: string
  driver_id?: number
  driver?: Person
  seats: number
  departure_time: string
  departure_location: string
  passenger_ids?: number[]
}

export interface MeetingPoint {
  id: number
  location: string
  meeting_time: string
  notes?: string
  confirmed_ids?: number[]
}

export interface Task {
  id: number
  description: string
  assignee_id?: number
  assignee?: Person
  is_completed: boolean
  created_at: string
}
