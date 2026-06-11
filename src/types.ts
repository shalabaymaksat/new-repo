export type CareerRole = 'junior' | 'content' | 'performance' | 'senior' | 'cmo'

export interface Player {
  name: string
  role: CareerRole
  level: number          // внутренний уровень
  xp: number
  xpToNext: number
  stats: Record<string, number> // по разделам аудита, 0–100
  regalia: string[]      // id полученных ачивок
}

export type MissionStatus = 'upcoming' | 'in_progress' | 'done' | 'overdue' | 'locked'

export interface Mission {
  id: string
  title: string
  sphere: string         // EdTech / товарка / стоматология / блогер
  moduleId: number       // связь с модулем базы знаний
  deadline: string       // ISO дата
  status: MissionStatus
  xpReward: number
  brief: string          // что нужно сделать
  statKey?: string       // какой стат аудита прокачивает
}

export interface KnowledgeModule {
  id: number
  title: string
  summary: string
  materials: string[]
  unlockRole: CareerRole // с какого уровня открыт
  bonus?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  earned: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  ts: number
}

export interface GameState {
  player: Player
  missions: Mission[]
  achievements: Achievement[]
  chat: ChatMessage[]
}
