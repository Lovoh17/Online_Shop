<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
          <router-link to="/" class="text-2xl font-bold text-pink-600">CAMILLE</router-link>
          <nav class="flex items-center space-x-4">
            <router-link 
              to="/login" 
              class="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
              v-if="!authStore.isAuthenticated"
            >
              Iniciar sesión
            </router-link>
            <router-link 
              to="/profile" 
              class="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
              v-else
            >
              Mi perfil
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <!-- Encabezado -->
        <div class="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-center">
          <h1 class="text-2xl font-bold text-white">Acceso restringido</h1>
        </div>
        
        <!-- Contenido -->
        <div class="p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          
          <h2 class="text-xl font-semibold text-gray-800 mt-4">Debes iniciar sesión</h2>
          <p class="text-gray-600 mt-2">Esta función está disponible solo para usuarios registrados.</p>
          
          <div class="mt-6 space-y-3">
            <router-link 
              to="/login" 
              class="block w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors"
            >
              Iniciar sesión
            </router-link>
            
            <router-link 
              to="/register" 
              class="block w-full py-3 px-4 border border-pink-500 text-pink-500 hover:bg-pink-50 font-medium rounded-md transition-colors"
            >
              Registrarse
            </router-link>
            
            <router-link 
              to="/" 
              class="block w-full py-3 px-4 text-gray-600 hover:text-pink-500 font-medium rounded-md transition-colors"
            >
              Volver al inicio
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-xs text-gray-500">&copy; 2024 CAMILLE. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>