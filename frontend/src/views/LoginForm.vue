<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const rememberMe = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  
  try {
    await authStore.login(email.value, password.value, rememberMe.value)
    router.push('/') // Redirigir a la página principal después de login
  } catch (err) {
    errorMessage.value = err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header estilo SHEIN -->
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
          <router-link to="/" class="text-2xl font-bold text-pink-600">CAMILLE</router-link>
          <nav class="flex items-center">
            <router-link 
              to="/register" 
              class="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
            >
              ¿No tienes cuenta? Regístrate
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md">
        <!-- Tarjeta de Login -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <!-- Encabezado -->
          <div class="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-center">
            <h1 class="text-2xl font-bold text-white">INICIAR SESIÓN</h1>
            <p class="text-pink-100 text-sm mt-1">Accede para descubrir las mejores ofertas</p>
          </div>
          
          <!-- Formulario -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                  placeholder="tucorreo@ejemplo.com"
                >
              </div>
              
              <!-- Contraseña -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
                  <router-link 
                    to="/forgot-password" 
                    class="text-xs text-pink-500 hover:text-pink-600"
                  >
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                  placeholder="••••••••"
                >
              </div>
              
              <!-- Recordar sesión -->
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                >
                <label for="remember-me" class="ml-2 text-sm text-gray-600">Mantener sesión iniciada</label>
              </div>
              
              <!-- Mensaje de error -->
              <div v-if="errorMessage" class="text-red-500 text-sm text-center py-2 px-3 bg-red-50 rounded-md">
                {{ errorMessage }}
              </div>
              
              <!-- Botón de submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">INICIAR SESIÓN</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CARGANDO...
                </span>
              </button>
              
              <!-- Divider -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">o continúa con</span>
                </div>
              </div>
              
              <!-- Redes sociales -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm6.633 15.113c-.44.992-.74 1.402-1.477 2.227-.767.86-1.852 1.801-3.195 1.801-1.344 0-1.89-.862-3.13-.862-1.24 0-1.812.862-3.131.862-1.344 0-2.433-.945-3.2-1.805-.736-.825-1.036-1.235-1.476-2.227-.96-2.165-1.06-4.62-.034-6.35.54-.9 1.52-1.57 2.6-1.57 1.307 0 1.98.86 3.13.86 1.15 0 1.73-.86 3.13-.86 1.03 0 1.97.65 2.52 1.52.76 1.27.82 3.6.12 5.65z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          <!-- Pie de tarjeta -->
          <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta? 
              <router-link 
                to="/register" 
                class="font-medium text-pink-500 hover:text-pink-600"
              >
                Regístrate ahora
              </router-link>
            </p>
          </div>
        </div>
        
        <!-- Beneficios -->
        <div class="mt-6 grid grid-cols-2 gap-4 text-center">
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p class="text-xs mt-1">Envíos gratis desde $50</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p class="text-xs mt-1">Pago seguro</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 border-t border-gray-200 py-6 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-xs text-gray-500">&copy; 2024 CAMILLE. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Animación para el spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>