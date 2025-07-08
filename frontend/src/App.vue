<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/navbar.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Control de visibilidad del navbar
const showNavbar = computed(() => {
  return !route.meta.hideNavbar && route.name !== 'login' && route.name !== 'register'
})

// Verificación de autenticación global
watch(
  /*() => route.path,
  (newPath) => {
    // Lista de rutas que no requieren autenticación
    const publicRoutes = ['/', '/login', '/register', '/about']
    
    if (!publicRoutes.includes(newPath)) {
      // Si la ruta no es pública y el usuario no está autenticado
      if (!authStore.isAuthenticated) {
        router.push('/login')
      }
    }
  },
  { immediate: true }*/
)

// Manejo de errores globales
const handleGlobalErrors = (error) => {
  console.error('Error global:', error)
  // Aquí podrías mostrar un toast de error o redirigir a una página de error
}

// Captura de errores no manejados
window.addEventListener('unhandledrejection', (event) => {
  handleGlobalErrors(event.reason)
})

window.addEventListener('error', (event) => {
  handleGlobalErrors(event.error)
})
</script>

<template>
  <!-- Navbar condicional -->
  <Navbar v-if="showNavbar" />
  
  <!-- Contenido principal con transición -->
  <router-view v-slot="{ Component, route }">
    <transition 
      :name="route.meta.transition || 'fade'" 
      mode="out-in"
    >
      <!-- Key basado en la ruta para forzar recarga de componentes -->
      <component 
        :is="Component" 
        :key="route.path"
      />
    </transition>
  </router-view>

  <!-- Footer global (opcional) -->
  <footer v-if="showNavbar" class="global-footer">
    <!-- Contenido del footer -->
  </footer>

  <!-- Componente global de notificaciones (opcional) -->
  <NotificationsContainer />
</template>

<style>
/* Estilos base */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Footer */
.global-footer {
  margin-top: auto;
  padding: 1rem;
  background-color: #f8f9fa;
  text-align: center;
}

/* Responsividad */
@media (max-width: 768px) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
}
</style>