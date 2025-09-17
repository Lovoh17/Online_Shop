<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/Foother.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showNavbar = computed(() => {
  return !route.meta.hideNavbar && route.name !== 'login' && route.name !== 'register'
})

// También mostrar footer en las mismas condiciones que navbar
const showFooter = computed(() => {
  return !route.meta.hideNavbar && route.name !== 'login' && route.name !== 'register'
})

// Verificación de autenticación global
watch(
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

  <!-- Footer global usando el componente -->
  <Footer v-if="showFooter" />

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


/* Responsividad */
@media (max-width: 768px) {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
}
</style>