import { useStore } from '../state/store'
import { SPHERES } from '../data/spheres'

export default function SphereSelect() {
  const { user, chooseSphere } = useStore()

  return (
    <div className="sphere-page">
      <div className="sphere-head">
        <h1>Қош келдің, {user?.name}! 👋</h1>
        <p>Қай кәсіп сферасында жұмыс істегің келеді? Таңдаған сфераң бойынша нағыз компанияда маркетолог боласың.</p>
      </div>
      <div className="sphere-grid">
        {SPHERES.map((s) => (
          <button key={s.id} className="sphere-card" onClick={() => chooseSphere(s.id)}>
            <div className="sphere-emoji">{s.emoji}</div>
            <div className="sphere-name">{s.name}</div>
            <div className="sphere-company">{s.company}</div>
            <p className="sphere-desc">{s.description}</p>
            <span className="sphere-cta">Таңдау →</span>
          </button>
        ))}
      </div>
    </div>
  )
}
