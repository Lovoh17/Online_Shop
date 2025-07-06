<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
})

const errors = ref({})
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleSubmit = async () => {
  errors.value = {}
  loading.value = true
  
  try {
    // Validación básica
    if (form.value.password !== form.value.passwordConfirmation) {
      throw new Error('Las contraseñas no coinciden')
    }

    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })

    // Redirigir después de registro exitoso
    router.push('/')
    
  } catch (err) {
    if (err.message.includes('400')) {
      errors.value.general = 'Datos inválidos. Por favor verifica la información.'
    } else if (err.message.includes('409')) {
      errors.value.email = ['Este correo ya está registrado']
    } else {
      errors.value.general = err.message || 'Error al registrar. Por favor intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
          <router-link to="/" class="text-2xl font-bold text-pink-600">CAMILLE</router-link>
          <nav class="flex items-center">
            <router-link 
              to="/login" 
              class="text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div class="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-center">
            <h1 class="text-2xl font-bold text-white">REGÍSTRATE</h1>
            <p class="text-pink-100 text-sm mt-1">Crea tu cuenta y disfruta de nuestras ofertas</p>
          </div>
        
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Ingresa tu nombre completo"
                >
                <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name[0] }}</p>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                  :class="{ 'border-red-500': errors.email }"
                  placeholder="tucorreo@ejemplo.com"
                >
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email[0] }}</p>
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="8"
                    class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                    :class="{ 'border-red-500': errors.password }"
                    placeholder="Mínimo 8 caracteres"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-500"
                  >
                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password[0] }}</p>
              </div>
              <div>
                <label for="passwordConfirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <div class="relative">
                  <input
                    id="passwordConfirmation"
                    v-model="form.passwordConfirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition"
                    placeholder="Confirma tu contraseña"
                  >
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-pink-500"
                  >
                    <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="errors.general" class="text-red-500 text-sm text-center py-2 px-3 bg-red-50 rounded-md">
                {{ errors.general }}
              </div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">CREAR CUENTA</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CREANDO CUENTA...
                </span>
              </button>
              <p class="text-xs text-gray-500 text-center">
                Al registrarte, aceptas nuestros 
                <a href="#" class="text-pink-500 hover:underline">Términos de servicio</a> y 
                <a href="#" class="text-pink-500 hover:underline">Política de privacidad</a>
              </p>
            </form>
          </div>
          <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta? 
              <router-link 
                to="/login" 
                class="font-medium text-pink-500 hover:text-pink-600"
              >
                Inicia sesión
              </router-link>
            </p>
          </div>
        </div>
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

    <footer class="bg-gray-100 border-t border-gray-200 py-6 mt-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-xs text-gray-500">&copy; 2024 CAMILLE. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style>
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