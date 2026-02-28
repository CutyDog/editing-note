import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import { NotebookPen, Sparkles, LogOut } from 'lucide-react'
import LoginPage from './pages/Auth/LoginPage'
import { useAuthStore } from './features/auth'

function Home() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="App">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #58a6ff66, #bc8cff66)',
            padding: '1rem',
            borderRadius: '50%',
            display: 'flex'
          }}>
            <NotebookPen size={48} color="#58a6ff" />
          </div>
        </div>

        <h1>Editing Note</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          次世代のインテリジェント・ノートアプリへようこそ。
        </p>

        {isAuthenticated ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <p>Logged in as: <strong>{user?.email}</strong></p>
            <button onClick={handleLogout} style={{ background: '#da3633', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} />
              ログアウト
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login">
              <button>
                ログイン
              </button>
            </Link>
            <button style={{
              background: 'linear-gradient(135deg, #238636, #2ea043)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Sparkles size={18} />
              今すぐ始める
            </button>
          </div>
        )}
      </div>

      <p className="read-the-docs" style={{ marginTop: '3rem', color: '#484f58' }}>
        Backend: Connected to localhost:3000
      </p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
