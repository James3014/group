// 核心資料類型 - 簡單、直接、無廢話

export type SkiLevel = 'beginner' | 'intermediate' | 'advanced'
export type BoardType = 'ski' | 'snowboard'
export type AgeGroup = 'adult' | 'child'
export type Equipment = 'own' | 'rental'
export type SkiSession = 'morning' | 'afternoon' | 'evening'  // 上午、下午、晚上

// Multi-Tenant: Trip（滑雪團）
export interface Trip {
  id: number
  slug: string              // URL 短網址（例如：ski2025）
  trip_name: string         // 行程名稱
  owner_email: string       // 團主 email
  is_active: boolean        // 是否啟用
  created_at: string
}

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
  father_id?: number  // 父親的 ID（僅小孩適用）
  mother_id?: number  // 母親的 ID（僅小孩適用）
  father?: Person     // 父親資訊（查詢時回傳）
  mother?: Person     // 母親資訊（查詢時回傳）
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
  created_at?: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  author_id: number
  author?: Person
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
  created_at: string
}

export interface Meal {
  id: number
  restaurant: string
  meal_time: string
  notes?: string
  participant_ids?: number[]
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
}

export interface Transport {
  id: number
  vehicle_name: string
  driver_id?: number
  driver?: Person
  seats: number
  departure_time: string
  passenger_ids?: number[]
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
}

export interface MeetingPoint {
  id: number
  location: string
  meeting_time: string
  notes?: string
  confirmed_ids?: number[]
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
}

export interface Task {
  id: number
  description: string
  assignee_id?: number
  assignee?: Person
  is_completed: boolean
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
  created_at: string
}

export interface TripSettings {
  id: number
  trip_name?: string        // 行程名稱（例如：聖誕節 30人團隊行程管理）
  start_date: string
  end_date: string
  location: string
  notes?: string
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
  created_at?: string
}

export interface SkiGroup {
  id: number
  name: string
  group_date?: string      // 日期
  session?: SkiSession     // 時段：上午/下午/晚上
  notes?: string
  trip_id?: number    // Multi-Tenant: 所屬滑雪團 ID
  created_at?: string
  member_ids?: number[]
  members?: Person[]
}
