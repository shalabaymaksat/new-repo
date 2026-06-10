// Жалпы домен типтері

export type SphereId = 'ecommerce' | 'edtech' | 'horeca' | 'fitness'

export interface Sphere {
  id: SphereId
  name: string
  emoji: string
  company: string
  description: string
  legend: string // онбордингте қолданылатын жоба легендасы
  product: string
  audience: string
  budget: string
}

export type TaskCategory = 'performance' | 'content'
export type KanbanStatus = 'backlog' | 'progress' | 'review' | 'done'

export interface QuizOption {
  text: string
  correct: boolean
  explain?: string
}

export interface TaskStep {
  question: string
  options: QuizOption[]
}

export interface SimTask {
  id: string
  title: string
  category: TaskCategory
  brief: string // тапсырма мәтіні (ассистенттен келетін бриф)
  steps: TaskStep[]
  hints: string[] // подсказка бөлімі
  xp: number
  startDay: number // тіркелген күннен бастап (Гант/календарь үшін)
  durationDays: number
  lessonRef?: string // байланысты курс сабағы
}

export interface CourseLesson {
  id: string
  title: string
  duration: string
  content: string[] // параграфтар
  keyPoints: string[]
  quiz: TaskStep[]
  xp: number
}

export interface CourseModule {
  id: string
  title: string
  emoji: string
  description: string
  lessons: CourseLesson[]
}

export interface ChatMessage {
  from: 'assistant' | 'user'
  text: string
}

export interface OnboardingStep {
  assistant: string[] // ассистент хабарламалары
  choices: string[] // пайдаланушы жауап нұсқалары (кез келгені жарайды)
}

// Пайдаланушы күйі
export interface TaskProgress {
  status: KanbanStatus
  stepIndex: number
  hintsOpened: boolean
  completedAt?: string
}

export interface UserState {
  name: string
  email: string
  password: string
  registeredAt: string // ISO date
  sphere: SphereId | null
  onboardingDone: boolean
  onboardingStep: number
  chatLog: ChatMessage[]
  xp: number
  streakDays: string[] // белсенді болған күндер (YYYY-MM-DD)
  tasks: Record<string, TaskProgress>
  lessonsDone: string[]
}
