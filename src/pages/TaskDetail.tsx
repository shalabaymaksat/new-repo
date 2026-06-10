import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'
import { getTasks } from '../data/tasks'
import { findLesson } from '../data/course'

export default function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { user, taskProgress, isTaskUnlocked, answerTaskStep, openHints } = useStore()
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [showHints, setShowHints] = useState(false)

  const sphere = getSphere(user?.sphere ?? null)
  const task = getTasks(sphere).find((t) => t.id === taskId)
  if (!task) return <div className="page"><h1>Задача табылмады</h1></div>
  if (!isTaskUnlocked(task.id)) {
    return (
      <div className="page">
        <h1>🔒 Задача жабық</h1>
        <p>Алдымен алдыңғы задачаны орында.</p>
        <Link to="/tasks" className="btn-primary inline-btn">← Задачаларға оралу</Link>
      </div>
    )
  }

  const p = taskProgress(task.id)
  const done = p.status === 'done' || p.stepIndex >= task.steps.length
  const step = task.steps[Math.min(p.stepIndex, task.steps.length - 1)]
  const lesson = task.lessonRef ? findLesson(task.lessonRef) : undefined

  const answer = (optIdx: number) => {
    const opt = step.options[optIdx]
    if (opt.correct) {
      setFeedback({ ok: true, text: 'Дұрыс! ✅' })
      setTimeout(() => {
        setFeedback(null)
        answerTaskStep(task.id, true)
      }, 700)
    } else {
      setFeedback({ ok: false, text: `Қате 😕 ${opt.explain ?? 'Тағы ойланып көр — немесе подсказканы аш.'}` })
    }
  }

  return (
    <div className="page task-detail">
      <Link to="/tasks" className="back-link">← Задачалар</Link>
      <div className="task-head">
        <h1>{task.title}</h1>
        <span className={`cat-chip cat-${task.category}`}>
          {task.category === 'performance' ? '🎯 Performance' : '✍️ Content'} · +{task.xp} XP
        </span>
      </div>

      <div className="brief-card">
        <div className="brief-from">👩‍💼 Аружан (наставник):</div>
        <p>{task.brief}</p>
      </div>

      {done ? (
        <div className="task-done-card">
          <div className="done-emoji">🎉</div>
          <h2>Задача орындалды!</h2>
          <p>+{task.xp} XP алдың. Канбанда «Done» бағанына көшті.</p>
          <button className="btn-primary" onClick={() => navigate('/tasks')}>Келесі задачаға →</button>
        </div>
      ) : (
        <div className="quiz-card">
          <div className="quiz-progress">
            Қадам {p.stepIndex + 1} / {task.steps.length}
            <div className="quiz-bar">
              <div className="quiz-fill" style={{ width: `${(p.stepIndex / task.steps.length) * 100}%` }} />
            </div>
          </div>
          <h2 className="quiz-question">{step.question}</h2>
          <div className="quiz-options">
            {step.options.map((o, i) => (
              <button key={i} className="quiz-option" onClick={() => answer(i)}>
                {o.text}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={feedback.ok ? 'feedback ok' : 'feedback bad'}>{feedback.text}</div>
          )}
        </div>
      )}

      <div className="hints-section">
        <button
          className="hints-toggle"
          onClick={() => {
            setShowHints(!showHints)
            if (!showHints) openHints(task.id)
          }}
        >
          💡 Подсказка {showHints ? '▲' : '▼'}
        </button>
        {showHints && (
          <div className="hints-body">
            {task.hints.map((h, i) => (
              <p key={i}>👉 {h}</p>
            ))}
            {lesson && (
              <p className="hint-lesson">
                📚 Толығырақ сабақта: <Link to={`/course/${lesson.id}`}>{lesson.title}</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
