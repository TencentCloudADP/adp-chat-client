import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { configureAxios } from 'adp-chat-component'
import './assets/main.css'

// 配置 axios
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : './'

configureAxios({
  baseURL,
  timeout: 1000 * 60,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
