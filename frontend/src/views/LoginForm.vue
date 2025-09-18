<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header estilo minimalista como la vista de productos -->
    <AuthNavbar />

    <!-- Main Content -->
    <main class="flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md">
        <!-- Tarjeta de Login con estilo minimalista -->
        <div class="bg-white rounded-lg overflow-hidden border border-gray-200">
          <!-- Encabezado -->
          <div class="bg-black p-6 text-center">
            <h1 class="text-2xl font-black text-white tracking-tight">INICIAR SESIÓN</h1>
            <p class="text-gray-300 text-sm mt-1">Accede a tu cuenta</p>
          </div>

          <!-- Formulario -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">Correo electrónico</label>
                <input id="email" v-model="email" type="email" required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="tucorreo@ejemplo.com">
              </div>

              <!-- Contraseña -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label for="password" class="block text-sm font-semibold text-gray-900">Contraseña</label>
                  <router-link to="/forgot-password" class="text-xs text-gray-600 hover:text-black">
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>
                <input id="password" v-model="password" type="password" required
                  class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                  placeholder="••••••••">
              </div>

              <!-- Recordar sesión -->
              <div class="flex items-center">
                <input id="remember-me" v-model="rememberMe" type="checkbox"
                  class="h-4 w-4 text-black rounded border-gray-300 focus:ring-black">
                <label for="remember-me" class="ml-2 text-sm text-gray-600">Recordar sesión</label>
              </div>

              <!-- Mensaje de error -->
              <div v-if="errorMessage"
                class="text-red-600 text-sm text-center py-2 px-3 bg-red-50 rounded-md border border-red-200">
                {{ errorMessage }}
              </div>

              <!-- Botón de submit -->
              <button type="submit" :disabled="loading"
                class="w-full py-3 px-4 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                <span v-if="!loading">INICIAR SESIÓN</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  CARGANDO...
                </span>
              </button>

              <button @click="continueWithoutAccount" type="button"
                class="w-full py-3 px-4 bg-white border border-black text-black hover:bg-gray-50 font-semibold text-sm rounded-lg transition-colors">
                Continuar sin cuenta
              </button>
            </form>
          </div>

          <!-- Pie de tarjeta -->
          <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <router-link to="/register" class="font-semibold text-black hover:text-gray-700">
                Regístrate ahora
              </router-link>
            </p>
          </div>
        </div>

        <!-- Beneficios -->
        <div class="mt-6 grid grid-cols-2 gap-4 text-center">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto text-black" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <p class="text-xs mt-2 font-medium">Envíos gratis desde $50</p>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto text-black" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p class="text-xs mt-2 font-medium">Pago seguro</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/AuthNavbar.vue'

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
    // Hacer la petición directamente a la API
    const response = await fetch('http://localhost:4000/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    if (data.success) {
      // Guardar token y datos de usuario en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirigir a la página principal
      router.push('/')
    } else {
      throw new Error(data.message || 'Error al iniciar sesión')
    }
  } catch (err) {
    errorMessage.value = err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.'
  } finally {
    loading.value = false
  }
}

const continueWithoutAccount = () => {
  router.push('/') // Redirige a la página principal sin autenticación
}
</script>


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