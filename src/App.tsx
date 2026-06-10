import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './state/store'
import Sidebar from './components/Sidebar'
import AuthPage from './pages/AuthPage'
import SphereSelect from './pages/SphereSelect'
import OnboardingChat from './pages/OnboardingChat'
import Dashboard from './pages/Dashboard'
import TasksPage from './pages/TasksPage'
import TaskDetail from './pages/TaskDetail'
import KanbanPage from './pages/KanbanPage'
import CalendarPage from './pages/CalendarPage'
import GanttPage from './pages/GanttPage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'

export default function App() {
  const { user } = useStore()
  const location = useLocation()

  if (!user) return <AuthPage />
  if (!user.sphere) return <SphereSelect />

  const isChat = location.pathname === '/onboarding'

  return (
    <div className="layout">
      <Sidebar />
      <main className={isChat ? 'main main-chat' : 'main'}>
        <Routes>
          <Route path="/" element={<Navigate to={user.onboardingDone ? '/dashboard' : '/onboarding'} replace />} />
          <Route path="/onboarding" element={<OnboardingChat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/gantt" element={<GanttPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
