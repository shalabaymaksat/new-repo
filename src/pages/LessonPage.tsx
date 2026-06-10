import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../state/store'
import { findLesson } from '../data/course'

export default function LessonPage() {
  const { lessonId } = useParams()
  const { user, completeLesson } = useStore()
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizMode, setQuizMode] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const lesson = lessonId ? findLesson(lessonId) : undefined
  if (!lesson) return <div className="page"><h1>Сабақ табылмады</h1></div>

  const isDone = user?.lessonsDone.includes(lesson.id)
  const quizFinished = quizIdx >= lesson.quiz.length

  const answer = (i: number) => {
    const opt = lesson.quiz[quizIdx].options[i]
    if (opt.correct) {
      setFeedback({ ok: true, text: 'Дұрыс! ✅' })
      setTimeout(() => {
        setFeedback(null)
        const next = quizIdx + 1
        setQuizIdx(next)
        if (next >= lesson.quiz.length) completeLesson(lesson.id, lesson.xp)
      }, 600)
    } else {
      setFeedback({ ok: false, text: opt.explain ?? 'Қате — сабақ мәтінін қайта қарап шық 🙂' })
    }
  }

  return (
    <div className="page lesson-page">
      <Link to="/course" className="back-link">← Курсқа оралу</Link>
      <h1>{lesson.title}</h1>
      <div className="lesson-tags">
        <span className="cat-chip">⏱ {lesson.duration}</span>
        <span className="cat-chip">+{lesson.xp} XP</span>
        {isDone && <span className="cat-chip chip-done">✅ Өтілді</span>}
      </div>

      <div className="lesson-content">
        {lesson.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="keypoints">
          <h3>🔑 Негізгі тұжырымдар</h3>
          <ul>
            {lesson.keyPoints.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </div>
      </div>

      {!quizMode && !isDone && (
        <button className="btn-primary" onClick={() => setQuizMode(true)}>
          Білімді тексеру → ({lesson.quiz.length} сұрақ)
        </button>
      )}

      {quizMode && !quizFinished && !isDone && (
        <div className="quiz-card">
          <div className="quiz-progress">Сұрақ {quizIdx + 1} / {lesson.quiz.length}</div>
          <h2 className="quiz-question">{lesson.quiz[quizIdx].question}</h2>
          <div className="quiz-options">
            {lesson.quiz[quizIdx].options.map((o, i) => (
              <button key={i} className="quiz-option" onClick={() => answer(i)}>
                {o.text}
              </button>
            ))}
          </div>
          {feedback && <div className={feedback.ok ? 'feedback ok' : 'feedback bad'}>{feedback.text}</div>}
        </div>
      )}

      {(isDone || quizFinished) && (
        <div className="task-done-card">
          <div className="done-emoji">🎓</div>
          <h2>Сабақ аяқталды!</h2>
          <p>+{lesson.xp} XP. Білімді задачада қолдан!</p>
          <Link to="/course" className="btn-primary inline-btn">Курсқа оралу</Link>
        </div>
      )}
    </div>
  )
}
