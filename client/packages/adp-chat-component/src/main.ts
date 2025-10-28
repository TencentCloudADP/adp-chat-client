import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

function init(container?: string) {
  if (!container) {
    container = 'body'
  }
  const containerDiv = document.querySelector(container)
  const dummyDiv = document.createElement('div')
  dummyDiv.id = containerDiv?.id + '-app'
  containerDiv?.appendChild(dummyDiv)
  console.log('init', dummyDiv.id)

  const params = {
    container: container,
    canPark: container != 'body',
  }
  return createApp(App, params).mount('#' + dummyDiv.id)
}

if (import.meta.env.DEV) {
  init('chat-panel')
}

export { init }