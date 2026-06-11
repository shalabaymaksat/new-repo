import { BookOpen, FileText, Lock } from 'lucide-react'
import type { CareerRole } from '../types'
import { LADDER, MODULES, ROLE_RANK } from '../data/seed'

export function KnowledgeBase({ role }: { role: CareerRole }) {
  const currentRank = ROLE_RANK[role]

  return (
    <section aria-label="База знаний" className="rounded-xl border border-edge bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        <BookOpen size={16} className="text-accent" /> База знаний · 8 модулей + 2 бонуса
      </h2>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((mod) => {
          const locked = ROLE_RANK[mod.unlockRole] > currentRank
          const unlockTitle = LADDER.find((s) => s.role === mod.unlockRole)?.title
          return (
            <article
              key={mod.id}
              className={`relative rounded-lg border border-edge bg-panel p-4 ${
                locked ? 'opacity-55' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-stat text-[11px] uppercase tracking-widest text-zinc-500">
                  {mod.bonus ? 'Бонус' : `Модуль ${mod.id}`}
                </span>
                {locked && (
                  <span className="flex items-center gap-1 rounded-full border border-edge px-2 py-0.5 text-[10px] text-zinc-500">
                    <Lock size={10} /> с уровня {unlockTitle}
                  </span>
                )}
              </div>
              <h3 className="mt-1 font-semibold leading-snug">{mod.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{mod.summary}</p>
              <ul className="mt-3 space-y-1 border-t border-edge pt-2.5">
                {mod.materials.map((m) => (
                  <li key={m} className="flex items-start gap-1.5 text-[11px] text-zinc-500">
                    <FileText size={11} className="mt-0.5 shrink-0 text-zinc-600" />
                    {m}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
