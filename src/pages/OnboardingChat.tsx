import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'
import { getOnboardingScript } from '../data/onboarding'
import type { ChatMessage } from '../types'

export default function OnboardingChat() {
  const { user, pushChat, setOnboardingStep } = useStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  const sphere = getSphere(user?.sphere ?? null)
  const script = getOnboardingScript(sphere, user?.name ?? '')
  const step = user?.onboardingStep ?? 0

  // Чат логы деривативті құрылады: ассистент хабарламалары скрипттен,
  // пайдаланушы жауаптары — сақталған chatLog-тан.
  const userReplies = (user?.chatLog ?? []).filter((m) => m.from === 'user')
  const messages: ChatMessage[] = []
  const shownSteps = Math.min(step, script.length - 1)
  for (let i = 0; i <= shownSteps; i++) {
    script[i].assistant.forEach((text) => messages.push({ from: 'assistant', text }))
    if (userReplies[i]) messages.push(userReplies[i])
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const choose = (text: string) => {
    pushChat([{ from: 'user', text }])
    const next = step + 1
    setOnboardingStep(Math.min(next, script.length - 1), next >= script.length)
  }

  const done = user?.onboardingDone

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar">👩‍💼</div>
        <div>
          <div className="chat-name">Аружан — маркетинг-наставник</div>
          <div className="chat-status">● онлайн · {sphere.company}</div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'assistant' ? 'msg msg-assistant' : 'msg msg-user'}>
            {m.text}
          </div>
        ))}
        {done && (
          <div className="msg msg-assistant">
            Onboarding аяқталды! 🎉 Енді <Link to="/tasks">Задачалар</Link> бөлімінен жұмысты жалғастыр.
            Білім керек болса — <Link to="/course">Курс</Link> әрқашан ашық.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!done && (
        <div className="chat-choices">
          {script[step].choices.map((c) => (
            <button key={c} className="choice-btn" onClick={() => choose(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      {done && (
        <div className="chat-choices">
          <Link to="/tasks" className="choice-btn">🎮 Задачаларға өту</Link>
          <Link to="/course" className="choice-btn">🎓 Курсты ашу</Link>
        </div>
      )}
    </div>
  )
}
