import { useCallback, useEffect, useState } from 'react'
import type { GameState, Mission, MissionStatus } from '../types'
import { ROLE_RANK, seedState } from '../data/seed'

const STORAGE_KEY = 'marketing-sim-state-v1'

function load(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GameState
  } catch {
    // повреждённое состояние — пересеиваем
  }
  return seedState()
}

// Ачивки, привязанные к выполнению миссий
const MISSION_ACHIEVEMENTS: Record<string, string> = {
  'm-custdev': 'first-custdev',
  'm-utp': 'first-offer',
  'm-hooks': 'viral-hook',
  'm-bottleneck': 'profitable-link',
}

export function useGameState() {
  const [state, setState] = useState<GameState>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const setMissionStatus = useCallback((id: string, status: MissionStatus) => {
    setState((prev) => {
      const mission = prev.missions.find((m) => m.id === id)
      if (!mission || mission.status === status) return prev

      const missions = prev.missions.map((m): Mission => (m.id === id ? { ...m, status } : m))
      let { player, achievements } = prev

      if (status === 'done' && mission.status !== 'done') {
        let xp = player.xp + mission.xpReward
        let { level, xpToNext, role } = player
        while (xp >= xpToNext) {
          xp -= xpToNext
          level += 1
          xpToNext = Math.round(xpToNext * 1.4)
        }
        // развилка: на 3-м уровне джуна повышают в перформансы
        let regalia = player.regalia
        if (role === 'junior' && level >= 3) {
          role = 'performance'
          if (!regalia.includes('promo-performance')) {
            regalia = [...regalia, 'promo-performance']
          }
        }
        const achId = MISSION_ACHIEVEMENTS[mission.id]
        if (achId && !regalia.includes(achId)) {
          regalia = [...regalia, achId]
        }
        const stats = { ...player.stats }
        if (mission.statKey && stats[mission.statKey] !== undefined) {
          stats[mission.statKey] = Math.min(100, stats[mission.statKey] + 12)
        }
        achievements = achievements.map((a) =>
          regalia.includes(a.id) ? { ...a, earned: true } : a,
        )
        player = { ...player, xp, level, xpToNext, role, regalia, stats }
      }

      return { ...prev, missions, player, achievements }
    })
  }, [])

  const pushChat = useCallback((msg: GameState['chat'][number]) => {
    setState((prev) => ({ ...prev, chat: [...prev.chat, msg] }))
  }, [])

  const setPlayerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, player: { ...prev.player, name } }))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(seedState())
  }, [])

  const roleRank = ROLE_RANK[state.player.role]

  return { state, setMissionStatus, pushChat, setPlayerName, reset, roleRank }
}
