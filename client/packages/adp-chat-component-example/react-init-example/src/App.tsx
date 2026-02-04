import React from 'react'
import { useChat } from './shared/useChat'
import './shared/styles.css'

const App: React.FC = () => {
  const { isOverlay, isOpen } = useChat({
    getConfig: ({ isOverlay }) => ({
      width: 400,
      height: '80vh',
      isOverlay: isOverlay,
      logoTitle: 'ADP Chat',
      showOverlayButton: true,
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
      <div id="chat-container" className={!isOverlay && isOpen ? 'chat-container--expanded' : ''}></div>
    </div>
  )
}

export default App
