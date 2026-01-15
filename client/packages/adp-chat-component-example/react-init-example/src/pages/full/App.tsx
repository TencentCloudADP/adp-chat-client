import React from 'react'
import { useChat } from '../../shared/useChat'
import '../../shared/styles.css'

const App: React.FC = () => {
  const { isOpen, openChat } = useChat({
    getConfig: () => ({
      modelType: 'full',
      logoTitle: 'ADP Chat - Full Mode',
      showFullscreenButton: false,
    }),
  })

  return (
    <div className="page-container bg-plain">
      {!isOpen && (
        <div className="control-panel">
          <h2>Full Mode Demo</h2>
          <p>Chat panel is closed</p>
          <div className="control-buttons">
            <button className="control-btn" onClick={openChat}>Open Chat</button>
          </div>
        </div>
      )}
      <div id="chat-container"></div>
    </div>
  )
}

export default App
