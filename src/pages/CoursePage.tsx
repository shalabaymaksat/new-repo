import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { COURSE, ALL_LESSONS } from '../data/course'

export default function CoursePage() {
  const { user } = useStore()
  const doneSet = new Set(user?.lessonsDone ?? [])
  const totalDone = ALL_LESSONS.filter((l) => doneSet.has(l.id)).length

  return (
    <div className="page">
      <h1>Курс: FMS маркетолог бағдарламасы 🎓</h1>
      <p className="page-sub">
        Маркетолог ретінде білуің керек база знаний. Прогресс: {totalDone}/{ALL_LESSONS.length} сабақ.
      </p>

      {COURSE.map((mod) => {
        const modDone = mod.lessons.filter((l) => doneSet.has(l.id)).length
        return (
          <div key={mod.id} className="course-module">
            <div className="module-head">
              <span className="module-emoji">{mod.emoji}</span>
              <div>
                <h2>{mod.title}</h2>
                <p className="module-desc">{mod.description}</p>
              </div>
              <span className="module-progress">{modDone}/{mod.lessons.length}</span>
            </div>
            <div className="lesson-list">
              {mod.lessons.map((l) => (
                <Link key={l.id} to={`/course/${l.id}`} className={doneSet.has(l.id) ? 'lesson-item done' : 'lesson-item'}>
                  <span className="lesson-check">{doneSet.has(l.id) ? '✅' : '📖'}</span>
                  <span className="lesson-title">{l.title}</span>
                  <span className="lesson-meta">{l.duration} · +{l.xp} XP</span>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
