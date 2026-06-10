import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ChatMessage, KanbanStatus, SphereId, TaskProgress, UserState } from '../types'
import { getSphere } from '../data/spheres'
import { getTasks, TASK_ORDER } from '../data/tasks'

const USERS_KEY = 'marketsim_users'
const SESSION_KEY = 'marketsim_session'

type UsersMap = Record<string, UserState>

function loadUsers(): UsersMap {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveUsers(users: UsersMap) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

interface Store {
  user: UserState | null
  register: (name: string, email: string, password: string) => string | null
  login: (email: string, password: string) => string | null
  logout: () => void
  chooseSphere: (id: SphereId) => void
  pushChat: (msgs: ChatMessage[]) => void
  setOnboardingStep: (step: number, done: boolean) => void
  taskProgress: (taskId: string) => TaskProgress
  isTaskUnlocked: (taskId: string) => boolean
  moveTask: (taskId: string, status: KanbanStatus) => void
  answerTaskStep: (taskId: string, correct: boolean) => void
  openHints: (taskId: string) => void
  completeLesson: (lessonId: string, xp: number) => void
  level: number
  levelProgress: number // 0..1 келесі деңгейге дейін
}

const StoreCtx = createContext<Store | null>(null)

const XP_PER_LEVEL = 200

const emptyProgress: TaskProgress = { status: 'backlog', stepIndex: 0, hintsOpened: false }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState | null>(() => {
    const email = localStorage.getItem(SESSION_KEY)
    if (!email) return null
    return loadUsers()[email] ?? null
  })

  // Әр өзгерісте сақтау + streak белгілеу
  useEffect(() => {
    if (!user) return
    const users = loadUsers()
    users[user.email] = user
    saveUsers(users)
  }, [user])

  function update(patch: Partial<UserState> | ((u: UserState) => Partial<UserState>)) {
    setUser((u) => {
      if (!u) return u
      const p = typeof patch === 'function' ? patch(u) : patch
      const next = { ...u, ...p }
      const today = todayStr()
      if (!next.streakDays.includes(today)) {
        next.streakDays = [...next.streakDays, today]
      }
      return next
    })
  }

  const register = (name: string, email: string, password: string): string | null => {
    const users = loadUsers()
    if (users[email]) return 'Бұл email-мен пайдаланушы тіркелген'
    const u: UserState = {
      name,
      email,
      password,
      registeredAt: new Date().toISOString(),
      sphere: null,
      onboardingDone: false,
      onboardingStep: 0,
      chatLog: [],
      xp: 0,
      streakDays: [todayStr()],
      tasks: {},
      lessonsDone: [],
    }
    users[email] = u
    saveUsers(users)
    localStorage.setItem(SESSION_KEY, email)
    setUser(u)
    return null
  }

  const login = (email: string, password: string): string | null => {
    const users = loadUsers()
    const u = users[email]
    if (!u) return 'Пайдаланушы табылмады'
    if (u.password !== password) return 'Құпиясөз қате'
    localStorage.setItem(SESSION_KEY, email)
    setUser(u)
    return null
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const chooseSphere = (id: SphereId) => update({ sphere: id })

  const pushChat = (msgs: ChatMessage[]) =>
    update((u) => ({ chatLog: [...u.chatLog, ...msgs] }))

  const setOnboardingStep = (step: number, done: boolean) =>
    update({ onboardingStep: step, onboardingDone: done })

  const taskProgress = (taskId: string): TaskProgress =>
    user?.tasks[taskId] ?? emptyProgress

  // Duolingo-стилі: задача алдыңғысы орындалғанда ғана ашылады
  const isTaskUnlocked = (taskId: string): boolean => {
    if (!user?.onboardingDone) return false
    const idx = TASK_ORDER.indexOf(taskId)
    if (idx <= 0) return true
    const prev = TASK_ORDER[idx - 1]
    return (user.tasks[prev]?.status ?? 'backlog') === 'done'
  }

  const moveTask = (taskId: string, status: KanbanStatus) =>
    update((u) => ({
      tasks: {
        ...u.tasks,
        [taskId]: { ...(u.tasks[taskId] ?? emptyProgress), status },
      },
    }))

  const answerTaskStep = (taskId: string, correct: boolean) => {
    if (!correct) return
    const sphere = getSphere(user?.sphere ?? null)
    const task = getTasks(sphere).find((t) => t.id === taskId)
    if (!task) return
    update((u) => {
      const cur = u.tasks[taskId] ?? emptyProgress
      const nextStep = cur.stepIndex + 1
      const finished = nextStep >= task.steps.length
      return {
        xp: finished ? u.xp + task.xp : u.xp,
        tasks: {
          ...u.tasks,
          [taskId]: {
            ...cur,
            stepIndex: nextStep,
            status: finished ? 'done' : cur.status === 'backlog' ? 'progress' : cur.status,
            completedAt: finished ? new Date().toISOString() : cur.completedAt,
          },
        },
      }
    })
  }

  const openHints = (taskId: string) =>
    update((u) => ({
      tasks: {
        ...u.tasks,
        [taskId]: { ...(u.tasks[taskId] ?? emptyProgress), hintsOpened: true },
      },
    }))

  const completeLesson = (lessonId: string, xp: number) =>
    update((u) =>
      u.lessonsDone.includes(lessonId)
        ? {}
        : { lessonsDone: [...u.lessonsDone, lessonId], xp: u.xp + xp },
    )

  const xp = user?.xp ?? 0
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const levelProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL

  return (
    <StoreCtx.Provider
      value={{
        user,
        register,
        login,
        logout,
        chooseSphere,
        pushChat,
        setOnboardingStep,
        taskProgress,
        isTaskUnlocked,
        moveTask,
        answerTaskStep,
        openHints,
        completeLesson,
        level,
        levelProgress,
      }}
    >
      {children}
    </StoreCtx.Provider>
  )
}

export function useStore(): Store {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// Задача күндерін тіркелген күннен есептеу (Календарь/Гант үшін)
export function taskDates(registeredAt: string, startDay: number, durationDays: number) {
  const base = new Date(registeredAt)
  base.setHours(0, 0, 0, 0)
  const start = new Date(base)
  start.setDate(start.getDate() + startDay)
  const end = new Date(start)
  end.setDate(end.getDate() + durationDays - 1)
  return { start, end }
}
