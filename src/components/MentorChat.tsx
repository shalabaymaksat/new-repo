import { useEffect, useRef, useState } from 'react'
import { Loader2, MessageSquare, Send } from 'lucide-react'
import type { ChatMessage, Mission, Player } from '../types'
import { LADDER } from '../data/seed'

export function MentorChat({
  player,
  missions,
  chat,
  onMessage,
}: {
  player: Player
  missions: Mission[]
  chat: ChatMessage[]
  onMessage: (msg: ChatMessage) => void
}) {
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, pending])

  async function send() {
    const text = input.trim()
    if (!text || pending) return
    setInput('')
    setError(null)
    const userMsg: ChatMessage = { role: 'user', content: text, ts: Date.now() }
    onMessage(userMsg)
    setPending(true)

    const active = missions.find((m) => m.status === 'in_progress')
    const roleTitle = LADDER.find((s) => s.role === player.role)?.title ?? player.role
    const playerContext = [
      `Имя: ${player.name}`,
      `Роль: ${roleTitle} (уровень ${player.level}, XP ${player.xp}/${player.xpToNext})`,
      active
        ? `Активная миссия: «${active.title}» (${active.sphere}) — ${active.brief}`
        : 'Активной миссии нет',
      `Статы аудита: ${Object.entries(player.stats)
        .map(([k, v]) => `${k} ${v}`)
        .join(', ')}`,
    ].join('\n')

    try {
      // последние 20 реплик достаточно для контекста наставника
      const history = [...chat, userMsg].slice(-20).map(({ role, content }) => ({
        role,
        content,
      }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, playerContext }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      onMessage({ role: 'assistant', content: data.reply, ts: Date.now() })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось связаться с наставником')
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      aria-label="Чат с AI-наставником"
      className="flex h-full min-h-0 flex-col bg-panel"
    >
      <header className="flex items-center gap-2 border-b border-edge px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
          <MessageSquare size={15} />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Наставник-CMO</h2>
          <p className="text-[11px] text-zinc-500">даёт задания · отвечает · оценивает</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {chat.map((m) => (
          <div
            key={m.ts + m.role}
            className={`max-w-[90%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-accent/15 text-zinc-100'
                : 'border border-edge bg-card text-zinc-300'
            }`}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Loader2 size={13} className="animate-spin" /> наставник печатает…
          </div>
        )}
        {error && (
          <p className="rounded border border-red-400/40 bg-red-400/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex gap-2 border-t border-edge p-3"
        onSubmit={(e) => {
          e.preventDefault()
          void send()
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спроси про миссию, метрики, методику…"
          aria-label="Сообщение наставнику"
          className="min-w-0 flex-1 rounded-lg border border-edge bg-card px-3 py-2 text-sm placeholder:text-zinc-600"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-pitch disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </form>
    </section>
  )
}
