import { Lock, MapPin, TrendingUp } from 'lucide-react'
import type { CareerRole } from '../types'
import { LADDER, ROLE_RANK } from '../data/seed'

export function CareerLadder({ role }: { role: CareerRole }) {
  const currentRank = ROLE_RANK[role]

  return (
    <section aria-label="Карьерная лестница" className="rounded-xl border border-edge bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        <TrendingUp size={16} className="text-accent" /> Карьерная лестница
      </h2>

      <ol className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-3">
        {LADDER.map((step, i) => {
          const rank = ROLE_RANK[step.role]
          const isCurrent = step.role === role
          const isLocked = rank > currentRank
          const isPassed = rank < currentRank || (rank === currentRank && !isCurrent)
          return (
            <li key={step.role} className="flex flex-1 items-stretch">
              <div
                className={`relative flex-1 rounded-lg border p-3.5 transition ${
                  isCurrent
                    ? 'border-accent bg-accent/10 shadow-[0_0_24px_-8px_var(--color-accent)]'
                    : isLocked
                      ? 'border-edge bg-panel opacity-50'
                      : 'border-edge bg-panel'
                }`}
              >
                {step.branch && (
                  <span className="absolute -top-2 right-2 rounded bg-edge px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-400">
                    развилка
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  {isCurrent ? (
                    <MapPin size={13} className="text-accent" />
                  ) : isLocked ? (
                    <Lock size={12} className="text-zinc-600" />
                  ) : null}
                  <h3
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-accent' : isPassed ? 'text-zinc-300' : 'text-zinc-400'
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{step.does}</p>
                {isCurrent && (
                  <p className="mt-2 border-t border-accent/20 pt-2 text-[11px] text-zinc-400">
                    <span className="text-accent">Повышение:</span> {step.promotion}
                  </p>
                )}
              </div>
              {i < LADDER.length - 1 && (
                <span
                  aria-hidden
                  className="mx-auto my-1 hidden self-center text-zinc-600 lg:mx-0.5 lg:block"
                >
                  ›
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
