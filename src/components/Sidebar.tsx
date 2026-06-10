import { NavLink } from 'react-router-dom'
import { useStore } from '../state/store'
import { getSphere } from '../data/spheres'

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Дэшборд' },
  { to: '/tasks', icon: '🎮', label: 'Задачалар' },
  { to: '/kanban', icon: '📋', label: 'Канбан' },
  { to: '/calendar', icon: '📅', label: 'Календарь' },
  { to: '/gantt', icon: '📈', label: 'Гант чарт' },
  { to: '/course', icon: '🎓', label: 'Курс' },
  { to: '/onboarding', icon: '💬', label: 'Ассистент' },
]

export default function Sidebar() {
  const { user, logout, level, levelProgress } = useStore()
  if (!user) return null
  const sphere = getSphere(user.sphere)

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">🚀</span>
        <span className="logo-text">MarketSim</span>
      </div>

      <div className="sidebar-company">
        <span>{sphere.emoji}</span>
        <div>
          <div className="company-name">{sphere.company}</div>
          <div className="company-sphere">{sphere.name}</div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-row">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-level">Деңгей {level} · {user.xp} XP</div>
          </div>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${levelProgress * 100}%` }} />
        </div>
        <button className="btn-logout" onClick={logout}>Шығу</button>
      </div>
    </aside>
  )
}
