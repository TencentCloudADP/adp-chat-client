import React from 'react'
import { useChat } from './shared/useChat'
import './shared/styles.css'

const App: React.FC = () => {
  const { isFullscreen, isOpen } = useChat({
    getConfig: ({ isFullscreen }) => ({
      width: 400,
      height: 640,
      isSidePanelOverlay: !isFullscreen,
      isOverlay: !isFullscreen,
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
      <div id="chat-container" className={isFullscreen && isOpen ? 'chat-container--fullscreen' : ''}></div>
    </div>
  )
}

export default App
