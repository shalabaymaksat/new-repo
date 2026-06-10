import { Link } from 'react-router-dom'
import { useStore, taskDates } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'

export default function GanttPage() {
  const { user, taskProgress } = useStore()
  const sphere = getSphere(user?.sphere ?? null)
  const tasks = getTasks(sphere)
  const registeredAt = user?.registeredAt ?? new Date().toISOString()

  const totalDays = Math.max(...tasks.map((t) => t.startDay + t.durationDays)) + 1
  const base = new Date(registeredAt)
  base.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOffset = Math.floor((today.getTime() - base.getTime()) / 86400000)

  const fmt = (d: Date) => `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`

  return (
    <div className="page page-wide">
      <h1>Гант чарт 📈</h1>
      <p className="page-sub">Барлық задачалардың уақыт сызығы — жоспарланған басталуы мен ұзақтығы.</p>

      <div className="gantt">
        <div className="gantt-grid" style={{ gridTemplateColumns: `220px repeat(${totalDays}, 1fr)` }}>
          {/* Күн нөмірлері */}
          <div className="gantt-corner">Задача</div>
          {Array.from({ length: totalDays }, (_, d) => {
            const date = new Date(base)
            date.setDate(date.getDate() + d)
            return (
              <div key={d} className={d === todayOffset ? 'gantt-day gantt-today' : 'gantt-day'}>
                {fmt(date)}
              </div>
            )
          })}

          {tasks.map((t) => {
            const p = taskProgress(t.id)
            const { start, end } = taskDates(registeredAt, t.startDay, t.durationDays)
            return (
              <div key={t.id} className="gantt-row-contents" style={{ display: 'contents' }}>
                <div className="gantt-label">
                  <Link to={`/tasks/${t.id}`}>{t.title}</Link>
                  <span className="gantt-dates">{fmt(start)} – {fmt(end)}</span>
                </div>
                {Array.from({ length: totalDays }, (_, d) => {
                  const inBar = d >= t.startDay && d < t.startDay + t.durationDays
                  if (!inBar) return <div key={d} className={d === todayOffset ? 'gantt-cell gantt-today-col' : 'gantt-cell'} />
                  const cls =
                    p.status === 'done'
                      ? 'gantt-bar bar-done'
                      : t.category === 'performance'
                        ? 'gantt-bar bar-perf'
                        : 'gantt-bar bar-content'
                  return (
                    <div key={d} className="gantt-cell">
                      <div className={cls} title={t.title} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div className="cal-legend">
        <span><i className="dot dot-perf" /> Performance</span>
        <span><i className="dot dot-content" /> Content</span>
        <span><i className="dot dot-done" /> Орындалды</span>
      </div>
    </div>
  )
}
