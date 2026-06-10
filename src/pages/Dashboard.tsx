import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'
import { ALL_LESSONS } from '../data/course'

export default function Dashboard() {
  const { user, taskProgress, isTaskUnlocked, level, levelProgress } = useStore()
  const sphere = getSphere(user?.sphere ?? null)
  const tasks = getTasks(sphere)

  const doneTasks = tasks.filter((t) => taskProgress(t.id).status === 'done')
  const perfDone = doneTasks.filter((t) => t.category === 'performance').length
  const perfTotal = tasks.filter((t) => t.category === 'performance').length
  const contentDone = doneTasks.filter((t) => t.category === 'content').length
  const contentTotal = tasks.filter((t) => t.category === 'content').length
  const lessonsDone = user?.lessonsDone.length ?? 0

  // Соңғы 7 күндегі белсенділік
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
  const streak = user?.streakDays ?? []
  const streakNow = (() => {
    let n = 0
    const d = new Date()
    while (streak.includes(d.toISOString().slice(0, 10))) {
      n++
      d.setDate(d.getDate() - 1)
    }
    return n
  })()

  const nextTask = tasks.find((t) => isTaskUnlocked(t.id) && taskProgress(t.id).status !== 'done')

  const skills = [
    { name: '🎯 Performance marketing', done: perfDone, total: perfTotal },
    { name: '✍️ Content marketing', done: contentDone, total: contentTotal },
    { name: '🎓 Теория (курс)', done: lessonsDone, total: ALL_LESSONS.length },
  ]

  return (
    <div className="page page-wide">
      <h1>Жеке кабинет 📊</h1>
      <p className="page-sub">
        {user?.name} · {sphere.company} компаниясының junior-маркетологы
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{user?.xp ?? 0}</div>
          <div className="stat-label">XP жинадың</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{level}</div>
          <div className="stat-label">Деңгей</div>
          <div className="xp-bar"><div className="xp-fill" style={{ width: `${levelProgress * 100}%` }} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥 {streakNow}</div>
          <div className="stat-label">Күн streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{doneTasks.length}/{tasks.length}</div>
          <div className="stat-label">Задача орындалды</div>
        </div>
      </div>

      <div className="dash-cols">
        <div className="dash-card">
          <h2>Скиллдер</h2>
          {skills.map((s) => (
            <div key={s.name} className="skill-row">
              <div className="skill-head">
                <span>{s.name}</span>
                <span>{s.done}/{s.total}</span>
              </div>
              <div className="skill-bar">
                <div className="skill-fill" style={{ width: `${s.total ? (s.done / s.total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="dash-card">
          <h2>Апталық белсенділік</h2>
          <div className="activity-row">
            {days.map((d) => (
              <div key={d} className="activity-day">
                <div className={streak.includes(d) ? 'activity-dot on' : 'activity-dot'}>
                  {streak.includes(d) ? '🔥' : ''}
                </div>
                <span>{d.slice(8)}</span>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: 20 }}>Келесі қадам</h2>
          {nextTask ? (
            <Link to={`/tasks/${nextTask.id}`} className="next-task">
              <span>{nextTask.category === 'performance' ? '🎯' : '✍️'}</span>
              <div>
                <div className="next-title">{nextTask.title}</div>
                <div className="next-meta">+{nextTask.xp} XP</div>
              </div>
              <span className="next-arrow">→</span>
            </Link>
          ) : user?.onboardingDone ? (
            <p>Барлық задача орындалды! 🏆 Сен нағыз маркетологсың!</p>
          ) : (
            <Link to="/onboarding" className="next-task">
              <span>💬</span>
              <div>
                <div className="next-title">Onboarding-ті аяқта</div>
                <div className="next-meta">Аружан күтіп отыр</div>
              </div>
              <span className="next-arrow">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
