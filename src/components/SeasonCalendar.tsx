import { CalendarDays, CheckCircle2, CircleDashed, Flame, Hourglass, Lock } from 'lucide-react'
import type { Mission, MissionStatus } from '../types'

const STATUS_META: Record<
  MissionStatus,
  { label: string; cls: string; icon: typeof CheckCircle2 }
> = {
  upcoming: { label: 'предстоит', cls: 'text-sky-400 border-sky-400/40 bg-sky-400/10', icon: CircleDashed },
  in_progress: { label: 'в работе', cls: 'text-accent border-accent/40 bg-accent/10', icon: Hourglass },
  done: { label: 'выполнено', cls: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10', icon: CheckCircle2 },
  overdue: { label: 'просрочено', cls: 'text-red-400 border-red-400/40 bg-red-400/10', icon: Flame },
  locked: { label: 'скоро', cls: 'text-zinc-500 border-edge bg-panel', icon: Lock },
}

function fmtDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function SeasonCalendar({
  missions,
  onSetStatus,
}: {
  missions: Mission[]
  onSetStatus: (id: string, status: MissionStatus) => void
}) {
  const sorted = [...missions].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  )

  return (
    <section aria-label="Календарь сезона" className="rounded-xl border border-edge bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-300">
        <CalendarDays size={16} className="text-accent" /> Календарь сезона
      </h2>

      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((m) => {
          const meta = STATUS_META[m.status]
          const Icon = meta.icon
          const locked = m.status === 'locked'
          return (
            <li
              key={m.id}
              className={`flex flex-col rounded-lg border border-edge bg-panel p-4 ${
                locked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    {m.sphere} · модуль {m.moduleId}
                  </p>
                  <h3 className="mt-0.5 font-semibold leading-snug">{m.title}</h3>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${meta.cls}`}
                >
                  <Icon size={11} /> {meta.label}
                </span>
              </div>

              <p className="mt-2 flex-1 text-xs leading-relaxed text-zinc-400">{m.brief}</p>

              <div className="mt-3 flex items-center justify-between border-t border-edge pt-2.5">
                <span className="font-stat text-xs text-zinc-400">
                  до {fmtDeadline(m.deadline)} · +{m.xpReward} XP
                </span>
                {!locked && m.status !== 'done' && (
                  <div className="flex gap-1.5">
                    {m.status !== 'in_progress' && (
                      <button
                        onClick={() => onSetStatus(m.id, 'in_progress')}
                        className="rounded border border-edge px-2 py-1 text-[11px] text-zinc-300 hover:border-accent hover:text-accent"
                      >
                        Взять в работу
                      </button>
                    )}
                    <button
                      onClick={() => onSetStatus(m.id, 'done')}
                      className="rounded bg-accent px-2 py-1 text-[11px] font-semibold text-pitch hover:bg-accent/80"
                    >
                      Выполнено
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
