import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, taskDates } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'

const MONTHS = [
  'Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
  'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан',
]
const WEEKDAYS = ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жс']

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function CalendarPage() {
  const { user, taskProgress } = useStore()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const sphere = getSphere(user?.sphere ?? null)
  const tasks = getTasks(sphere)
  const registeredAt = user?.registeredAt ?? new Date().toISOString()

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Дс = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  // Күн → сол күні дедлайны бар задачалар
  const deadlines = tasks.map((t) => ({ task: t, ...taskDates(registeredAt, t.startDay, t.durationDays) }))

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="page page-wide">
      <h1>Календарь 📅</h1>
      <p className="page-sub">Задачалардың дедлайндары тіркелген күніңнен бастап жоспарланған.</p>

      <div className="cal-nav">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))}>←</button>
        <span className="cal-month">{MONTHS[month]} {year}</span>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))}>→</button>
      </div>

      <div className="calendar">
        {WEEKDAYS.map((w) => (
          <div key={w} className="cal-weekday">{w}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="cal-cell cal-empty" />
          const date = new Date(year, month, day)
          const dayDeadlines = deadlines.filter((d) => sameDay(d.end, date))
          return (
            <div key={day} className={sameDay(date, today) ? 'cal-cell cal-today' : 'cal-cell'}>
              <div className="cal-daynum">{day}</div>
              {dayDeadlines.map(({ task }) => {
                const done = taskProgress(task.id).status === 'done'
                return (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className={`cal-event ${done ? 'cal-event-done' : task.category === 'performance' ? 'cal-event-perf' : 'cal-event-content'}`}
                    title={task.title}
                  >
                    {done ? '✓ ' : '⏰ '}{task.title}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="cal-legend">
        <span><i className="dot dot-perf" /> Performance дедлайн</span>
        <span><i className="dot dot-content" /> Content дедлайн</span>
        <span><i className="dot dot-done" /> Орындалды</span>
      </div>
    </div>
  )
}
