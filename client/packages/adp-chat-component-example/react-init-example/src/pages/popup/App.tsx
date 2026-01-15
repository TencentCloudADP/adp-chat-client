import React from 'react'
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const App: React.FC = () => {
  const { openChat, closeChat } = useChat({
    getConfig: ({ isFullscreen }) => ({
      canPark: true,
      modelType: 'compact',
      width: isFullscreen ? '100%' : 420,
      height: isFullscreen ? '100%' : 620,
      logoTitle: 'ADP Chat',
      showFullscreenButton: true,
      showToggleButton: false,
    }),
  })

  return (
    <div className="page-container bg-gradient-gray">
      <div className="popup-content">
        <h1>Popup Mode Demo</h1>
        <p>Click the chat button at the bottom right corner to open the chat window</p>
        <p>This mode is suitable for embedding chat functionality in existing pages</p>
        <div className="control-buttons" style={{ marginTop: 24 }}>
          <button className="control-btn" onClick={openChat}>Open Chat</button>
          <button className="control-btn control-btn--secondary" onClick={closeChat}>Close Chat</button>
        </div>
        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <span>Floating Button</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Fixed Position Popup</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Closable & Minimizable</span>
          </div>
        </div>
      </div>
      <div id="chat-container"></div>
    </div>
  )
}

export default App
