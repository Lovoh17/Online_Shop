import './assets/main.css'
import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Inicialización de la app
const app = createApp(App)
const pinia = createPinia()

// Orden recomendado para plugins
app.use(pinia) // 1. Pinia (gestión de estado)
app.use(router) // 2. Router

// Montaje final
app.mount('#app')