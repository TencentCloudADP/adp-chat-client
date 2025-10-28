import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function init(container: string) {
  const containerDiv = document.getElementById(container)
  const dummyDiv = document.createElement('div')
  dummyDiv.id = container + '-app'
  containerDiv?.appendChild(dummyDiv)
  console.log('init')

  return createApp(App, {container: container}).mount('#' + dummyDiv.id)
}

if (import.meta.env.DEV) {
  init('chat-panel')
}

export { init }