import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'

const CAT_LABEL = { performance: '🎯 Performance', content: '✍️ Content' }

export default function TasksPage() {
  const { user, taskProgress, isTaskUnlocked } = useStore()
  const sphere = getSphere(user?.sphere ?? null)
  const tasks = getTasks(sphere)

  return (
    <div className="page">
      <h1>Задачалар жолы 🎮</h1>
      <p className="page-sub">
        Duolingo секілді: задачаларды ретімен орындап, жаңаларын аш. Қиналсаң — задача ішіндегі «Подсказка» бөлімін пайдалан.
      </p>

      <div className="task-path">
        {tasks.map((t, i) => {
          const p = taskProgress(t.id)
          const unlocked = isTaskUnlocked(t.id)
          const state = p.status === 'done' ? 'done' : unlocked ? 'open' : 'locked'
          const node = (
            <div className={`path-node path-${state}`}>
              <div className="path-circle">
                {state === 'done' ? '✓' : state === 'locked' ? '🔒' : i + 1}
              </div>
              <div className="path-info">
                <div className="path-cat">{CAT_LABEL[t.category]}</div>
                <div className="path-title">{t.title}</div>
                <div className="path-meta">
                  +{t.xp} XP · {t.steps.length} қадам
                  {p.status === 'done' && <span className="badge-done"> Орындалды</span>}
                  {state === 'open' && p.stepIndex > 0 && p.status !== 'done' && (
                    <span className="badge-progress"> Жалғастыру ({p.stepIndex}/{t.steps.length})</span>
                  )}
                </div>
              </div>
            </div>
          )
          return unlocked ? (
            <Link key={t.id} to={`/tasks/${t.id}`} className="path-link">
              {node}
            </Link>
          ) : (
            <div key={t.id} className="path-link path-link-locked" title="Алдыңғы задачаны орында">
              {node}
            </div>
          )
        })}
      </div>
    </div>
  )
}
