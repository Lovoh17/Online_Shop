<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const userData = computed(() => ({
  nombre: authStore.user?.nombre || 'No especificado',
  email: authStore.user?.email || 'No especificado',
  miembroDesde: authStore.user?.createdAt 
    ? authStore.user.createdAt.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No disponible'
}))

onMounted(async () => {
  try {
    loading.value = true
    await authStore.loadUserData()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-pink-600">CAMILLE</router-link>
          </div>
          
          <nav class="flex items-center space-x-6">
            <router-link 
              to="/dashboard" 
              class="hidden md:flex items-center text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
              active-class="text-pink-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9m0 0l9 9m-9-9v18" />
              </svg>
              INICIO
            </router-link>
            <router-link 
              to="/perfil" 
              class="hidden md:flex items-center text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
              active-class="text-pink-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              MI PERFIL
            </router-link>
            
            <router-link to="/carrito" class="p-2 text-gray-700 hover:text-pink-500 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="authStore.cartCount > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ authStore.cartCount }}
              </span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Menú lateral -->
        <div class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-4 bg-pink-500 text-white">
              <h3 class="font-medium">MI CUENTA</h3>
            </div>
            <nav class="p-2">
              <router-link 
                to="/perfil" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                active-class="bg-pink-50 text-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información personal
              </router-link>
              <router-link 
                to="/pedidos" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                active-class="bg-pink-50 text-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mis pedidos
              </router-link>
              <router-link 
                to="/favoritos" 
                class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
                active-class="bg-pink-50 text-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favoritos
              </router-link>
              <button
                @click="handleLogout"
                class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </nav>
          </div>
          
          <!-- Banner promocional -->
          <div class="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4 text-white text-center">
            <h4 class="font-medium mb-2">¡GANA PUNTOS!</h4>
            <p class="text-xs mb-3">Por cada compra acumulas puntos canjeables por descuentos</p>
            <router-link 
              to="/puntos" 
              class="inline-block bg-white text-pink-600 text-xs font-medium px-4 py-1 rounded-full hover:bg-gray-50 transition-colors"
            >
              Ver mis puntos
            </router-link>
          </div>
        </div>
        
        <!-- Contenido del perfil -->
        <div class="flex-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <!-- Encabezado -->
            <div class="p-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-bold">Hola, {{ userData.nombre }}</h2>
                  <p class="text-sm opacity-90">Bienvenido a tu área personal</p>
                </div>
                <div class="hidden md:block">
                  <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span class="ml-2 text-sm">Miembro desde {{ userData.miembroDesde }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Cuerpo -->
            <div class="p-6">
              <div v-if="authStore.isLoading || loading" class="flex justify-center py-12">
                <svg class="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <div v-else-if="error" class="text-center py-8">
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar tu perfil</h3>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <button 
                  @click="router.push('/login')"
                  class="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Volver a iniciar sesión
                </button>
              </div>

              <div v-else>
                <!-- Sección de información personal -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Información personal</h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                        {{ userData.nombre }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                        {{ userData.email }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de registro</label>
                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
                        {{ userData.miembroDesde }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nivel de membresía</label>
                      <div class="bg-gray-50 p-3 rounded-md border border-gray-200 flex items-center">
                        <span class="bg-pink-500 text-white text-xs px-2 py-1 rounded-full mr-2">PLATA</span>
                        <span class="text-sm text-gray-600">Gasta $150 más para llegar a ORO</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Sección de acciones rápidas -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">Acciones rápidas</h3>
                  
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <router-link 
                      to="/pedidos" 
                      class="bg-gray-50 hover:bg-gray-100 p-4 rounded-md border border-gray-200 text-center transition-colors"
                    >
                      <div class="mx-auto w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span class="text-sm font-medium">Mis pedidos</span>
                    </router-link>
                    
                    <router-link 
                      to="/favoritos" 
                      class="bg-gray-50 hover:bg-gray-100 p-4 rounded-md border border-gray-200 text-center transition-colors"
                    >
                      <div class="mx-auto w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span class="text-sm font-medium">Favoritos</span>
                    </router-link>
                    
                    <router-link 
                      to="/direcciones" 
                      class="bg-gray-50 hover:bg-gray-100 p-4 rounded-md border border-gray-200 text-center transition-colors"
                    >
                      <div class="mx-auto w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span class="text-sm font-medium">Direcciones</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sección de recomendaciones -->
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recomendados para ti</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <!-- Productos recomendados podrían cargarse aquí -->
              <div class="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
              <div class="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
              <div class="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
              <div class="bg-gray-100 rounded-lg aspect-square animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
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

/* Animación para los placeholders */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>