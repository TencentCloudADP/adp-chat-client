import React from 'react'
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const App: React.FC = () => {
  const { isOpen, isFullscreen, openChat } = useChat({
    getConfig: ({ isFullscreen }) => ({
      modelType: 'compact',
      width: isFullscreen ? '100%' : 800,
      height: isFullscreen ? '100%' : 600,
      logoTitle: 'ADP Chat - Fullscreen Demo',
      showFullscreenButton: true,
      onFullscreen: (fullscreen: boolean) => {
        if (!fullscreen) {
          window.close()
        }
      },
    }),
  })

  return (
    <div 
      className={`page-container bg-gradient-light ${isFullscreen ? 'is-fullscreen' : ''}`}
      style={{ padding: isFullscreen ? 0 : 40 }}
    >
      {!isOpen && (
        <div className="control-panel">
          <h2>Fullscreen Demo</h2>
          <p>Chat panel is closed</p>
          <div className="control-buttons">
            <button className="control-btn" onClick={openChat}>Open Chat</button>
          </div>
        </div>
      )}
      <div className={`chat-wrapper ${isFullscreen ? 'fullscreen-expanded' : ''}`}>
        <div id="chat-container"></div>
      </div>
    </div>
  )
}

export default App
