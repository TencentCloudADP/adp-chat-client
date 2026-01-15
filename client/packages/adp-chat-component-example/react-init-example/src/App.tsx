import React from 'react'
import { useChat } from './shared/useChat'
import './shared/styles.css'

const App: React.FC = () => {
  const { isFullscreen } = useChat({
    getConfig: ({ isFullscreen }) => ({
      modelType: 'compact',
      width: 420,
      height: isFullscreen ? '100vh' : 600,
      logoTitle: 'ADP Chat',
      showFullscreenButton: true,
      showToggleButton: true,
    }),
  })

  return (
    <div id="container" className={isFullscreen ? 'container--fullscreen' : ''}>
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
