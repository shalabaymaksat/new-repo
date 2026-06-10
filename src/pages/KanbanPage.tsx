import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'
import type { KanbanStatus } from '../types'

const COLUMNS: { id: KanbanStatus; title: string; color: string }[] = [
  { id: 'backlog', title: '📥 Backlog', color: '#94a3b8' },
  { id: 'progress', title: '🔨 In Progress', color: '#3b82f6' },
  { id: 'review', title: '👀 Review', color: '#f59e0b' },
  { id: 'done', title: '✅ Done', color: '#22c55e' },
]

export default function KanbanPage() {
  const { user, taskProgress, isTaskUnlocked, moveTask } = useStore()
  const [dragId, setDragId] = useState<string | null>(null)
  const sphere = getSphere(user?.sphere ?? null)
  const tasks = getTasks(sphere).filter((t) => isTaskUnlocked(t.id))

  const drop = (status: KanbanStatus) => {
    // «Done» бағанына тек интерактив қадамдары аяқталған задача түседі
    if (!dragId) return
    const p = taskProgress(dragId)
    if (status === 'done' && p.status !== 'done') return setDragId(null)
    moveTask(dragId, status)
    setDragId(null)
  }

  return (
    <div className="page page-wide">
      <h1>Жұмыс канбаны 📋</h1>
      <p className="page-sub">
        Ашылған задачаларды бағандар арасында сүйреп жылжыт. «Done»-ға тек орындалған задача өтеді — орындау үшін картадағы «Ашу» батырмасын бас.
      </p>
      <div className="kanban">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => taskProgress(t.id).status === col.id)
          return (
            <div
              key={col.id}
              className="kanban-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(col.id)}
            >
              <div className="kanban-col-head" style={{ borderColor: col.color }}>
                {col.title} <span className="kanban-count">{colTasks.length}</span>
              </div>
              {colTasks.map((t) => {
                const p = taskProgress(t.id)
                return (
                  <div
                    key={t.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => setDragId(t.id)}
                  >
                    <span className={`cat-chip cat-${t.category}`}>
                      {t.category === 'performance' ? '🎯' : '✍️'} {t.category}
                    </span>
                    <div className="kanban-title">{t.title}</div>
                    <div className="kanban-meta">
                      +{t.xp} XP · {p.stepIndex}/{t.steps.length} қадам
                    </div>
                    <Link to={`/tasks/${t.id}`} className="kanban-open">Ашу →</Link>
                  </div>
                )
              })}
              {colTasks.length === 0 && <div className="kanban-empty">Бос</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
