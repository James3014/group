// 核心資料類型 - 簡單、直接、無廢話

export type SkiLevel = 'beginner' | 'intermediate' | 'advanced'
export type BoardType = 'ski' | 'snowboard'
export type AgeGroup = 'adult' | 'child'
export type Equipment = 'own' | 'rental'

export interface Person {
  id: number
  name: string
  phone?: string
  ski_level: SkiLevel
  board_type: BoardType
  age_group: AgeGroup
  equipment: Equipment
  has_radio: boolean
  is_admin: boolean
  is_confirmed: boolean
  parent_id?: number  // 家長的 ID（僅小孩適用）
  parent?: Person     // 家長資訊（查詢時回傳）
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

export interface TripSettings {
  id: number
  start_date: string
  end_date: string
  location: string
  notes?: string
  created_at?: string
}
