import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAxios } from 'adp-chat-component'
import '../../assets/main.css'

const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : './'

configureAxios({
  baseURL,
  timeout: 1000 * 60,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
