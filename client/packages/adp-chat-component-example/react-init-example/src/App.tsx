import React from 'react'
import './App.css'

const demos = [
  { key: 'full', name: 'Full Mode', desc: '全屏模式 - 占满整个容器', path: './src/pages/full/index.html' },
  { key: 'compact', name: 'Compact Mode', desc: '紧凑模式 - 固定宽高', path: './src/pages/compact/index.html' },
  { key: 'popup', name: 'Popup Mode', desc: '弹窗模式 - 悬浮按钮触发', path: './src/pages/popup/index.html' },
  { key: 'fullscreen', name: 'Fullscreen', desc: '全屏切换 - 支持全屏/窗口切换', path: './src/pages/fullscreen/index.html' },
]

const openDemo = (path: string) => {
  window.open(path, '_blank')
}

const icons: Record<string, React.ReactNode> = {
  full: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  ),
  compact: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  ),
  popup: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  fullscreen: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  ),
}

const App: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        <header className="header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="url(#logo-gradient)"/>
              <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="3" fill="white"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">ADP Chat</span>
          </div>
          <h1 className="title">React Component Demo</h1>
          <p className="subtitle">Select a mode to preview</p>
        </header>

        <main className="demo-grid">
          {demos.map((demo) => (
            <div
              key={demo.key}
              className="demo-card"
              onClick={() => openDemo(demo.path)}
            >
              <div className="card-header">
                <div className="card-icon">
                  {icons[demo.key]}
                </div>
                <svg className="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <h2 className="card-title">{demo.name}</h2>
              <p className="card-desc">{demo.desc}</p>
            </div>
          ))}
        </main>

        <footer className="footer">
          <span>ADP Chat Component</span>
          <span className="divider">|</span>
          <span>React Example</span>
        </footer>
      </div>
    </div>
  )
}

export default App
