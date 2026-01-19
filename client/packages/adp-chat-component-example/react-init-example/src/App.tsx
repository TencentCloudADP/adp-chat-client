import React from 'react'
import { useChat } from './shared/useChat'
import './shared/styles.css'

const App: React.FC = () => {
  const { isFullscreen } = useChat({
    getConfig: () => ({
      isOverlay: true,
      width: 420,
      height: '80vh',
      logoTitle: 'ADP Chat',
      showFullscreenButton: true,
      showToggleButton: true,
    }),
  })

  return (
    <div id="container">
      <div id="main">
        <div className="main-content">
          <h1>ADP Chat Demo</h1>
        </div>
      </div>
      <div id="chat-container" className={isFullscreen ? 'chat-container--fullscreen' : ''}></div>
    </div>
  )
}

export default App
