<template>
  <div class="min-h-screen bg-white relative">
    <!-- Video de fondo -->
    <div class="fixed inset-0 z-0">
      <video 
        autoplay 
        muted 
        loop 
        playsinline
        class="w-full h-full object-cover"
      >
        <source src="../assets/VIDEO-LOGIN.mp4" type="video/mp4">
        <!-- Fallback en caso de que el video no cargue -->
        <div class="absolute inset-0 bg-[#1E3A34]"></div>
      </video>
      <!-- Overlay para mejorar legibilidad -->
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] py-8 px-4">
      <div class="w-full max-w-md">
        <!-- Tarjeta de Login -->
        <div class="bg-white/95 shadow-lg overflow-hidden border border-white/30 backdrop-blur-sm">
          <!-- Encabezado -->
          <div class="bg-[#1E3A34] p-8 text-center overflow-hidden h-48 relative">
            <!-- Overlay para el video de fondo visible a través -->
            <div class="absolute inset-0 bg-[#1E3A34]/90"></div>
            
            <div class="relative z-10 h-full flex flex-col items-center justify-center">
              <!-- Logo -->
              <div class="w-16 h-16 mx-auto mb-4 bg-white/10 flex items-center justify-center p-2 border border-white/20">
                <div v-if="!logoError" class="w-full h-full flex items-center justify-center">
                  <img 
                    src="../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.svg" 
                    alt="DRIP OUTDOOR Logo" 
                    class="w-full h-full object-contain"
                    @error="handleLogoError"
                  />
                </div>
                <div v-else class="text-white font-bold text-lg">DO</div>
              </div>
              <h1 class="text-2xl font-bold text-white tracking-tight mb-2">BIENVENIDO</h1>
              <p class="text-[#C2B280] text-sm font-medium">Accede a tu cuenta Drip Outdoor</p>
            </div>
          </div>

          <!-- Formulario -->
          <div class="p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
              <!-- Grupo de inputs -->
              <div class="space-y-4">
                <!-- Email -->
                <div class="group">
                  <label for="email" class="block text-sm font-semibold text-[#1E3A34] mb-2 ml-1">
                    Correo electrónico
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-[#5E5E5E] group-focus-within:text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      id="email" 
                      v-model="email" 
                      type="email" 
                      required
                      :disabled="authStore.isLoading"
                      aria-describedby="email-error"
                      :class="[
                        'w-full pl-10 pr-4 py-3 text-sm bg-white border-2 transition-all duration-300 placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#1E3A34]/20',
                        errorMessage && errorMessage.includes('email') ? 'border-[#E57C23]' : 'border-[#D8C69E] focus:border-[#1E3A34]',
                        authStore.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                      placeholder="tucorreo@ejemplo.com"
                    >
                  </div>
                </div>

                <!-- Contraseña -->
                <div class="group">
                  <div class="flex justify-between items-center mb-2 ml-1">
                    <label for="password" class="block text-sm font-semibold text-[#1E3A34]">
                      Contraseña
                      <span class="text-red-500">*</span>
                    </label>
                    <router-link 
                      to="/forgot-password" 
                      class="text-xs text-[#5E5E5E] hover:text-[#1E3A34] transition-colors"
                      :class="authStore.isLoading ? 'pointer-events-none opacity-50' : ''"
                    >
                      ¿Olvidaste tu contraseña?
                    </router-link>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-[#5E5E5E] group-focus-within:text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      id="password" 
                      v-model="password" 
                      type="password" 
                      required
                      :disabled="authStore.isLoading"
                      aria-describedby="password-error"
                      :class="[
                        'w-full pl-10 pr-4 py-3 text-sm bg-white border-2 transition-all duration-300 placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#1E3A34]/20',
                        errorMessage && errorMessage.includes('contraseña') ? 'border-[#E57C23]' : 'border-[#D8C69E] focus:border-[#1E3A34]',
                        authStore.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                      placeholder="••••••••"
                    >
                  </div>
                </div>
              </div>

              <!-- Recordar sesión -->
              <div class="flex items-center">
                <div class="relative">
                  <input 
                    id="remember-me" 
                    v-model="rememberMe" 
                    type="checkbox"
                    :disabled="authStore.isLoading"
                    class="sr-only peer"
                  >
                  <div 
                    :class="[
                      'w-5 h-5 bg-white border-2 transition-colors duration-200 flex items-center justify-center cursor-pointer',
                      rememberMe ? 'bg-[#1E3A34] border-[#1E3A34]' : 'border-[#D8C69E]',
                      authStore.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#1E3A34]'
                    ]"
                    @click="!authStore.isLoading && (rememberMe = !rememberMe)"
                  >
                    <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <label 
                  for="remember-me" 
                  :class="[
                    'ml-3 text-sm cursor-pointer select-none',
                    authStore.isLoading ? 'text-[#A3A3A3] cursor-not-allowed' : 'text-[#5E5E5E] hover:text-[#1E3A34]'
                  ]"
                  @click="!authStore.isLoading && (rememberMe = !rememberMe)"
                >
                  Recordar sesión
                </label>
              </div>

              <!-- Mensaje de error -->
              <div 
                v-if="errorMessage"
                id="form-error"
                class="text-[#E57C23] text-sm text-center py-3 px-4 bg-[#FEF2E8] border border-[#FED7AA] flex items-center justify-center"
                role="alert"
                aria-live="polite"
              >
                <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ errorMessage }}</span>
              </div>

              <!-- Botones -->
              <div class="space-y-3">
                <button 
                  type="submit" 
                  :disabled="authStore.isLoading"
                  :class="[
                    'w-full py-3.5 px-4 text-white font-semibold text-sm transition-all duration-300 shadow-lg flex items-center justify-center',
                    authStore.isLoading ? 'bg-[#5E5E5E] cursor-not-allowed' : 'bg-[#1E3A34] hover:bg-[#2A4A40] hover:shadow-xl'
                  ]"
                  aria-live="polite"
                >
                  <span v-if="!authStore.isLoading" class="flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    INICIAR SESIÓN
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CARGANDO...
                  </span>
                </button>

                <button 
                  @click="continueWithoutAccount" 
                  type="button"
                  :disabled="authStore.isLoading"
                  :class="[
                    'w-full py-3.5 px-4 bg-transparent border-2 font-semibold text-sm transition-all duration-300 flex items-center justify-center',
                    authStore.isLoading ? 'border-[#A3A3A3] text-[#A3A3A3] cursor-not-allowed' : 'border-[#C2B280] text-[#1E3A34] hover:bg-[#C2B280]/10'
                  ]"
                >
                  <span class="flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Continuar sin cuenta
                  </span>
                </button>
              </div>
            </form>

            <!-- Separador -->
            <div class="relative my-6" aria-hidden="true">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-[#D8C69E]"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-3 bg-white text-[#5E5E5E]">O también</span>
              </div>
            </div>

            <!-- Registro rápido -->
            <div class="text-center">
              <p class="text-sm text-[#5E5E5E] mb-4">
                ¿Primera vez en Drip Outdoor?
              </p>
              <router-link 
                to="/register" 
                :class="[
                  'inline-flex items-center font-semibold text-sm transition-colors group',
                  authStore.isLoading ? 'text-[#A3A3A3] pointer-events-none' : 'text-[#1E3A34] hover:text-[#4F7C63]'
                ]"
              >
                Crear una cuenta
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
              <router-link 
                to="/privacidad" 
                :class="[
                  'inline-flex items-center font-semibold text-sm transition-colors group',
                  authStore.isLoading ? 'text-[#A3A3A3] pointer-events-none' : 'text-[#1E3A34] hover:text-[#4F7C63]'
                ]"
              >
                Politicas de Privacidad
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Beneficios -->
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white/95 p-4 text-center border border-white/30 shadow-lg backdrop-blur-sm">
            <div class="w-10 h-10 mx-auto mb-2 bg-[#1E3A34] flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#1E3A34]">Envío gratis</p>
            <p class="text-[10px] text-[#5E5E5E]">Desde $50</p>
          </div>
          
          <div class="bg-white/95 p-4 text-center border border-white/30 shadow-lg backdrop-blur-sm">
            <div class="w-10 h-10 mx-auto mb-2 bg-[#1E3A34] flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#1E3A34]">Pago seguro</p>
            <p class="text-[10px] text-[#5E5E5E]">100% protegido</p>
          </div>
          
          <div class="bg-white/95 p-4 text-center border border-white/30 shadow-lg backdrop-blur-sm">
            <div class="w-10 h-10 mx-auto mb-2 bg-[#1E3A34] flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p class="text-xs font-semibold text-[#1E3A34]">Garantía</p>
            <p class="text-[10px] text-[#5E5E5E]">30 días</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthNavbar from '@/components/AuthNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const rememberMe = ref(false)
const logoError = ref(false)

// Validación de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Manejo de error de logo
const handleLogoError = () => {
  logoError.value = true
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  // Validación del cliente
  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  if (!isValidEmail(email.value.trim())) {
    errorMessage.value = 'Por favor ingresa un email válido'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  try {
    console.log('=== 🚀 INTENTANDO LOGIN ===')
    console.log('📧 Email:', email.value.trim())
    console.log('🔒 Password length:', password.value.length)
    
    // ✅ USAR EL STORE DE PINIA
    await authStore.login(email.value.trim(), password.value)
    
    // Decodificar y mostrar el token
    if (authStore.token) {
      console.log('=== 🎫 TOKEN GENERADO ===')
      console.log('Token completo:', authStore.token)
      
      try {
        // Decodificar el payload del JWT
        const payload = JSON.parse(atob(authStore.token.split('.')[1]))
        console.log('=== 📦 PAYLOAD DECODIFICADO ===')
        console.log('🆔 ID del usuario:', payload.id)
        console.log('📧 Email:', payload.email)
        console.log('👤 Nombre:', payload.nombre)
        console.log('⏰ Emitido en (iat):', new Date(payload.iat * 1000).toLocaleString())
        console.log('⏳ Expira en (exp):', new Date(payload.exp * 1000).toLocaleString())
        console.log('📌 Issuer:', payload.iss)
        console.log('🎯 Audience:', payload.aud)
        console.log('=========================')
      } catch (decodeError) {
        console.error('❌ Error decodificando token:', decodeError)
      }
    }
    
    console.log('=== 👤 USUARIO AUTENTICADO ===')
    console.log('Usuario del store:', authStore.user)
    console.log('¿Está autenticado?:', authStore.isAuthenticated)
    console.log('=============================')
    
    // Guardar preferencia de "recordar sesión"
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    } else {
      localStorage.removeItem('rememberMe')
    }

    console.log('✅ Login exitoso!')
    
    // Mostrar notificación de éxito
    showNotification('¡Bienvenido! Sesión iniciada correctamente', 'success')
    
    // El store ya redirige a /dashboard
    
  } catch (err) {
    console.error('=== ❌ ERROR EN LOGIN ===')
    console.error('Mensaje:', err.message)
    console.error('Error completo:', err)
    console.error('========================')
    
    errorMessage.value = err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.'
    
    // Enfocar el primer campo con error
    if (err.message.includes('email')) {
      document.getElementById('email')?.focus()
    } else if (err.message.includes('contraseña') || err.message.includes('password')) {
      document.getElementById('password')?.focus()
    }
  }
}

const continueWithoutAccount = () => {
  if (authStore.isLoading) return
  router.push('/')
}

const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div')
  notification.className = `
    fixed top-4 right-4 px-6 py-4 shadow-2xl z-50 
    transform translate-x-full transition-transform duration-300
    ${type === 'success' ? 'bg-[#4F7C63] text-white' : 'bg-[#E57C23] text-white'}
  `
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}" />
      </svg>
      <span class="font-medium">${message}</span>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Animación de entrada
  setTimeout(() => notification.classList.remove('translate-x-full'), 100)
  
  // Animación de salida después de 3 segundos
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Cargar preferencias guardadas al montar el componente
const loadSavedPreferences = () => {
  const savedRememberMe = localStorage.getItem('rememberMe')
  if (savedRememberMe === 'true') {
    rememberMe.value = true
  }
}

// Ejecutar al montar el componente
loadSavedPreferences()
</script>

<style scoped>
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

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

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .animate-spin {
    transition: none;
    animation: none;
  }
}

/* Enfoque visible para navegación por teclado */
.focus\:outline-none:focus {
  outline: 2px solid #1E3A34;
  outline-offset: 2px;
}
</style>