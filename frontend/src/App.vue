<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import navbar from '@/components/navbar.vue'

const route = useRoute()
const showNavbar = computed(() => {
  return !route.meta.public && route.name !== 'login' && route.name !== 'register'
})
</script>

<template>
  <navbar v-if="showNavbar" />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>