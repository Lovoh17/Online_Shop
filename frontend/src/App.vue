<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Foother.vue'
import { useAuthStore } from '@/stores/auth'
import CookieBanner from '@/components/CookieBanner.vue';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showNavbar = computed(() => {
  return !route.meta.hideNavbar && route.name !== 'login' && route.name !== 'register'
})

const showFooter = computed(() => {
  return !route.meta.hideNavbar && route.name !== 'login' && route.name !== 'register'
})

watch(
)

const handleGlobalErrors = (error) => {
  console.error('Error global:', error)
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
  <Navbar v-if="showNavbar" />
  <router-view :key="route.fullPath" />
  <Footer v-if="showFooter" />
  <CookieBanner />
  <NotificationsContainer />
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>