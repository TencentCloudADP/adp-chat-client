import React from 'react'
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const App: React.FC = () => {
  const { isFullscreen } = useChat({
    getConfig: ({ isFullscreen }) => ({
      modelType: 'compact',
      width: 400,
      height: isFullscreen ? 'calc(100vh - 40px)' : 640,
      logoTitle: 'ADP Chat',
      showFullscreenButton: true,
      showToggleButton: true,
    }),
  })

  return (
    <div className="page-container bg-gradient-gray">
      <div className="popup-content">
        <h1>Popup Mode Demo</h1>
      </div>
      <div id="chat-container" className={isFullscreen ? 'chat-container--fullscreen' : ''}></div>
    </div>
  )
}

export default App
