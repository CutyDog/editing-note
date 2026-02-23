import './App.css'
import { NotebookPen, Sparkles } from 'lucide-react'

function App() {
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

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button>
            ログイン
          </button>
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
      </div>

      <p className="read-the-docs" style={{ marginTop: '3rem', color: '#484f58' }}>
        Backend: Connected to localhost:3000
      </p>
    </div>
  )
}

export default App
