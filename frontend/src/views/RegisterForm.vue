<template>
  <div class="min-h-screen bg-gray-50 overflow-hidden">
    <main class="flex items-center justify-center py-6 px-4 max-h-screen overflow-y-auto scrollbar-hide">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <!-- Header con gradiente verde -->
          <div class="bg-gradient-to-r from-[#1E3A34] to-[#4F7C63] p-8 text-center">
            <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
            <p class="text-[#D8C69E] text-sm">Únete a DRIP OUTDOOR y comienza tu aventura</p>
          </div>

          <div class="p-8">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Nombre completo -->
              <div>
                <label for="name" class="block text-sm font-semibold text-[#1E3A34] mb-2">
                  Nombre completo
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    id="name" 
                    v-model="form.name" 
                    type="text" 
                    required
                    class="w-full pl-10 pr-4 py-3 text-sm border border-[#D8C69E] rounded-lg focus:ring-2 focus:ring-[#4F7C63] focus:border-[#4F7C63] transition"
                    :class="{ 'border-red-500 focus:ring-red-500': errors.name }" 
                    placeholder="Juan Pérez"
                  >
                </div>
                <p v-if="errors.name" class="mt-2 text-xs text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.name[0] }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-semibold text-[#1E3A34] mb-2">
                  Correo electrónico
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    required
                    class="w-full pl-10 pr-4 py-3 text-sm border border-[#D8C69E] rounded-lg focus:ring-2 focus:ring-[#4F7C63] focus:border-[#4F7C63] transition"
                    :class="{ 'border-red-500 focus:ring-red-500': errors.email }" 
                    placeholder="tucorreo@ejemplo.com"
                  >
                </div>
                <p v-if="errors.email" class="mt-2 text-xs text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.email[0] }}
                </p>
              </div>

              <!-- Contraseña -->
              <div>
                <label for="password" class="block text-sm font-semibold text-[#1E3A34] mb-2">
                  Contraseña
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    id="password" 
                    v-model="form.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required
                    minlength="8"
                    class="w-full pl-10 pr-12 py-3 text-sm border border-[#D8C69E] rounded-lg focus:ring-2 focus:ring-[#4F7C63] focus:border-[#4F7C63] transition"
                    :class="{ 'border-red-500 focus:ring-red-500': errors.password }" 
                    placeholder="Mínimo 8 caracteres"
                  >
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5E5E5E] hover:text-[#4F7C63] transition-colors"
                  >
                    <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="mt-2 text-xs text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.password[0] }}
                </p>
              </div>

              <!-- Confirmar contraseña -->
              <div>
                <label for="passwordConfirmation" class="block text-sm font-semibold text-[#1E3A34] mb-2">
                  Confirmar contraseña
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input 
                    id="passwordConfirmation" 
                    v-model="form.passwordConfirmation"
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    required
                    class="w-full pl-10 pr-12 py-3 text-sm border border-[#D8C69E] rounded-lg focus:ring-2 focus:ring-[#4F7C63] focus:border-[#4F7C63] transition"
                    placeholder="Confirma tu contraseña"
                  >
                  <button 
                    type="button" 
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5E5E5E] hover:text-[#4F7C63] transition-colors"
                  >
                    <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Error general -->
              <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm text-red-800">{{ errors.general }}</span>
              </div>

              <!-- Botón submit -->
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full py-3.5 px-4 bg-gradient-to-r from-[#1E3A34] to-[#4F7C63] hover:from-[#152d28] hover:to-[#3d6350] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                <span v-if="!loading" class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  CREAR CUENTA
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CREANDO CUENTA...
                </span>
              </button>

              <!-- Términos -->
              <p class="text-xs text-[#5E5E5E] text-center leading-relaxed">
                Al registrarte, aceptas nuestros
                <a href="#" class="text-[#4F7C63] hover:text-[#1E3A34] font-medium hover:underline">Términos de servicio</a> y
                <a href="#" class="text-[#4F7C63] hover:text-[#1E3A34] font-medium hover:underline">Política de privacidad</a>
              </p>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-8 py-5 text-center border-t border-gray-200">
            <p class="text-sm text-[#5E5E5E]">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="font-semibold text-[#4F7C63] hover:text-[#1E3A34] transition-colors">
                Inicia sesión aquí
              </router-link>
            </p>
          </div>
        </div>

        <!-- Beneficios -->
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-gradient-to-br from-[#1E3A34] to-[#4F7C63] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#1E3A34]">Envíos gratis</p>
            <p class="text-xs text-[#5E5E5E] mt-1">Desde $50</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div class="w-12 h-12 bg-gradient-to-br from-[#1E3A34] to-[#4F7C63] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#1E3A34]">Pago seguro</p>
            <p class="text-xs text-[#5E5E5E] mt-1">100% protegido</p>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Footer from '@/components/Foother.vue'

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

<style scoped>
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

/* Ocultar scrollbar pero mantener funcionalidad de scroll */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

html, body {
  overflow-x: hidden;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
}

html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>