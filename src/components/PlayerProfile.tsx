import { useState } from 'react'
import { Award, Pencil, Lock } from 'lucide-react'
import type { Achievement, Player } from '../types'
import { LADDER } from '../data/seed'

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[11px] uppercase tracking-wide text-zinc-400">
          {label}
        </span>
        <span className="font-stat text-sm font-bold text-accent">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-edge">
        <div
          className="h-full rounded-full bg-accent/80"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function PlayerProfile({
  player,
  achievements,
  onRename,
}: {
  player: Player
  achievements: Achievement[]
  onRename: (name: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(player.name)
  const roleTitle = LADDER.find((s) => s.role === player.role)?.title ?? player.role
  const xpPct = Math.min(100, Math.round((player.xp / player.xpToNext) * 100))
  const overall = Math.round(
    Object.values(player.stats).reduce((a, b) => a + b, 0) /
      Object.values(player.stats).length,
  )

  return (
    <section
      aria-label="Профиль маркетолога"
      className="rounded-xl border border-edge bg-card p-5"
    >
      <div className="flex flex-wrap items-start gap-5">
        {/* «карточка игрока» */}
        <div className="flex w-44 shrink-0 flex-col items-center rounded-lg border border-edge bg-panel p-4">
          <span className="font-stat text-5xl font-bold text-accent">{overall}</span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">
            общий рейтинг
          </span>
          <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/60 bg-pitch font-stat text-2xl font-bold">
            {player.name.slice(0, 1).toUpperCase()}
          </div>
          <span className="mt-2 font-stat text-xs text-zinc-400">LVL {player.level}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onRename(draft.trim() || player.name)
                  setEditing(false)
                }}
              >
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => {
                    onRename(draft.trim() || player.name)
                    setEditing(false)
                  }}
                  className="rounded border border-edge bg-panel px-2 py-1 text-lg font-semibold"
                  aria-label="Имя игрока"
                />
              </form>
            ) : (
              <>
                <h2 className="truncate text-xl font-semibold">{player.name}</h2>
                <button
                  onClick={() => {
                    setDraft(player.name)
                    setEditing(true)
                  }}
                  className="rounded p-1 text-zinc-500 hover:text-accent"
                  aria-label="Изменить имя"
                >
                  <Pencil size={14} />
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-accent">{roleTitle}</p>

          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>XP до следующего уровня</span>
              <span className="font-stat">
                {player.xp} / {player.xpToNext}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-edge">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {Object.entries(player.stats).map(([k, v]) => (
              <StatBar key={k} label={k} value={v} />
            ))}
          </div>
        </div>
      </div>

      {/* регалии */}
      <div className="mt-5 border-t border-edge pt-4">
        <h3 className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">
          Регалии
        </h3>
        <ul className="flex flex-wrap gap-2">
          {achievements.map((a) => (
            <li
              key={a.id}
              title={a.description}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                a.earned
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-edge bg-panel text-zinc-600'
              }`}
            >
              {a.earned ? <Award size={12} /> : <Lock size={12} />}
              {a.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
