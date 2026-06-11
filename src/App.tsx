import { useState } from 'react'
import { MessageSquare, RotateCcw, X } from 'lucide-react'
import { useGameState } from './state/useGameState'
import { PlayerProfile } from './components/PlayerProfile'
import { SeasonCalendar } from './components/SeasonCalendar'
import { CareerLadder } from './components/CareerLadder'
import { KnowledgeBase } from './components/KnowledgeBase'
import { MentorChat } from './components/MentorChat'

export default function App() {
  const { state, setMissionStatus, pushChat, setPlayerName, reset } = useGameState()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen lg:grid lg:h-screen lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* основной хаб */}
      <div className="flex min-h-0 flex-col lg:overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-edge bg-pitch/90 px-5 py-3 backdrop-blur">
          <div>
            <h1 className="font-stat text-sm font-bold uppercase tracking-[0.25em] text-accent">
              Career Mode
            </h1>
            <p className="text-[11px] text-zinc-500">
              Симулятор маркетолога · Junior → CMO
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Сбросить весь прогресс и начать карьеру заново?')) reset()
            }}
            className="flex items-center gap-1.5 rounded border border-edge px-2.5 py-1.5 text-[11px] text-zinc-400 hover:border-accent hover:text-accent"
          >
            <RotateCcw size={12} /> Новая карьера
          </button>
        </header>

        <main className="flex-1 space-y-5 p-5">
          <PlayerProfile
            player={state.player}
            achievements={state.achievements}
            onRename={setPlayerName}
          />
          <CareerLadder role={state.player.role} />
          <SeasonCalendar missions={state.missions} onSetStatus={setMissionStatus} />
          <KnowledgeBase role={state.player.role} />
        </main>
      </div>

      {/* чат: постоянная панель справа на десктопе */}
      <aside className="hidden h-screen border-l border-edge lg:block">
        <MentorChat
          player={state.player}
          missions={state.missions}
          chat={state.chat}
          onMessage={pushChat}
        />
      </aside>

      {/* мобильный чат — выезжающая панель */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-pitch shadow-lg lg:hidden"
        aria-label="Открыть чат с наставником"
      >
        <MessageSquare size={20} />
      </button>
      {chatOpen && (
        <div className="fixed inset-0 z-30 flex flex-col bg-pitch lg:hidden">
          <button
            onClick={() => setChatOpen(false)}
            className="absolute right-3 top-3 z-40 rounded p-2 text-zinc-400 hover:text-accent"
            aria-label="Закрыть чат"
          >
            <X size={18} />
          </button>
          <MentorChat
            player={state.player}
            missions={state.missions}
            chat={state.chat}
            onMessage={pushChat}
          />
        </div>
      )}
    </div>
  )
}
