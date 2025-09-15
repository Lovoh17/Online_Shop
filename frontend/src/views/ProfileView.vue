<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const editMode = ref(false)
const userData = ref(null)
const editForm = ref({
  nombre: '',
  telefono: '',
  direccion: ''  // Simplificado para coincidir con tu backend
})

// Obtener token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Verificar si el usuario está autenticado
const isAuthenticated = computed(() => {
  return !!getToken()
})

// Formatear dirección de JSON a texto legible
const formatearDireccion = (direccion) => {
  if (!direccion) return 'No especificada'
  
  try {
    // Si es un string JSON, parsearlo
    if (typeof direccion === 'string' && direccion.startsWith('{')) {
      const direccionObj = JSON.parse(direccion)
      const partes = []
      
      if (direccionObj.calle) partes.push(direccionObj.calle)
      if (direccionObj.ciudad) partes.push(direccionObj.ciudad)
      if (direccionObj.pais) partes.push(direccionObj.pais)
      if (direccionObj.codigoPostal) partes.push(direccionObj.codigoPostal)
      
      return partes.length > 0 ? partes.join(', ') : 'No especificada'
    }
    
    // Si es un objeto, procesarlo directamente
    if (typeof direccion === 'object') {
      const partes = []
      if (direccion.calle) partes.push(direccion.calle)
      if (direccion.ciudad) partes.push(direccion.ciudad)
      if (direccion.pais) partes.push(direccion.pais)
      if (direccion.codigoPostal) partes.push(direccion.codigoPostal)
      
      return partes.length > 0 ? partes.join(', ') : 'No especificada'
    }
    
    // Si es un string normal, devolverlo tal como está
    return direccion
  } catch (error) {
    console.error('Error al formatear dirección:', error)
    return 'Dirección con formato inválido'
  }
}

// Formatear datos del usuario
const formattedUserData = computed(() => {
  if (!userData.value) return null
  
  return {
    nombre: userData.value.nombre || 'No especificado',
    email: userData.value.email || 'No especificado',
    telefono: userData.value.telefono || 'No especificado',
    direccion: formatearDireccion(userData.value.direccion),
    miembroDesde: userData.value.createdAt
      ? new Date(userData.value.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'No disponible'
  }
})

// Debug del token
const debugToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No hay token en localStorage');
    return;
  }
  
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log('=== FRONTEND TOKEN DEBUG ===');
    console.log('Payload del token:', decodedPayload);
    
    if (!decodedPayload.id) {
      console.error('El token no contiene ID de usuario');
    } else {
      console.log('ID de usuario en token:', decodedPayload.id);
      console.log('Es ObjectId válido?:', /^[0-9a-fA-F]{24}$/.test(decodedPayload.id));
    }
  } catch (error) {
    console.error('Error al decodificar token:', error);
  }
}

// Cargar datos del perfil desde la API
const loadUserProfile = async () => {
  try {
    loading.value = true
    error.value = null
    
    const token = getToken()
    if (!token) {
      throw new Error('No autenticado. Por favor inicia sesión.')
    }

    console.log('=== FRONTEND REQUEST DEBUG ===');
    console.log('Enviando request a: http://localhost:4000/api/usuarios/perfil');
    console.log('Token:', token.substring(0, 50) + '...');

    const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
      }
      
      const errorData = await response.json().catch(() => ({}))
      console.log('Error response:', errorData);
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('=== FRONTEND RESPONSE DEBUG ===');
    console.log('Respuesta completa:', data);
    
    if (data.success) {
      // CORECCIÓN: Usar 'user' en lugar de 'usuario'
      userData.value = data.user
      console.log('Usuario cargado:', userData.value);
    } else {
      throw new Error(data.message || 'Error al cargar el perfil')
    }
  } catch (err) {
    console.error('=== FRONTEND ERROR ===', err);
    error.value = err.message
    
    if (err.message.includes('Sesión expirada') || err.message.includes('No autenticado')) {
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } finally {
    loading.value = false
  }
}

// Montar componente
onMounted(async () => {
  console.log('=== COMPONENTE MONTADO ===');
  
  if (!isAuthenticated.value) {
    error.value = 'No autenticado. Redirigiendo al login...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return
  }
  
  debugToken()
  await loadUserProfile()
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}

const startEdit = () => {
  editMode.value = true
  editForm.value = {
    nombre: userData.value?.nombre || '',
    telefono: userData.value?.telefono || '',
    direccion: userData.value?.direccion || ''
  }
}

const cancelEdit = () => {
  editMode.value = false
}

const saveChanges = async () => {
  try {
    loading.value = true
    error.value = null
    
    const token = getToken()
    if (!token) {
      throw new Error('No autenticado')
    }

    console.log('=== GUARDANDO CAMBIOS ===');
    console.log('Datos a enviar:', editForm.value);

    const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    })

    const data = await response.json()
    console.log('Respuesta actualización:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil')
    }

    if (data.success) {
      // Actualizar datos locales
      userData.value = { ...userData.value, ...editForm.value }
      editMode.value = false
      
      showNotification('Perfil actualizado correctamente', 'success')
      
      // Recargar perfil para obtener datos actualizados
      await loadUserProfile()
    } else {
      throw new Error(data.message || 'Error al actualizar perfil')
    }
  } catch (err) {
    console.error('Error al guardar:', err);
    error.value = err.message
    showNotification(err.message, 'error')
  } finally {
    loading.value = false
  }
}

const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div')
  notification.className = `
    fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 
    transform translate-x-full transition-transform duration-300
    ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
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
  
  setTimeout(() => notification.classList.remove('translate-x-full'), 100)
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <h3 class="text-lg font-black tracking-tight uppercase">MI CUENTA</h3>
              <p class="text-gray-300 text-sm mt-1">Gestiona tu información</p>
            </div>
            
            <nav class="p-3">
              <router-link 
                to="/perfil" 
                class="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all mb-1"
                active-class="bg-gray-100 text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                INFORMACIÓN PERSONAL
              </router-link>
              
              <router-link 
                to="/pedidos" 
                class="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all mb-1"
                active-class="bg-gray-100 text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                MIS PEDIDOS
              </router-link>
              
              <router-link 
                to="/favoritos" 
                class="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all mb-1"
                active-class="bg-gray-100 text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                FAVORITOS
              </router-link>
              
              <div class="border-t border-gray-100 my-3"></div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                CERRAR SESIÓN
              </button>
            </nav>
          </div>
          
          <!-- Stats card -->
          <div class="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h4 class="font-black text-gray-900 text-sm uppercase tracking-wide mb-4">ESTADÍSTICAS</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Pedidos realizados</span>
                <span class="font-bold text-gray-900">0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Total gastado</span>
                <span class="font-bold text-gray-900">$0</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Productos favoritos</span>
                <span class="font-bold text-gray-900">0</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header -->
            <div class="p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
              <div class="absolute inset-0 bg-black/20"></div>
              <div class="relative z-10">
                <div class="flex items-start justify-between">
                  <div>
                    <h1 class="text-3xl font-black tracking-tight mb-2">{{ formattedUserData?.nombre || 'Cargando...' }}</h1>
                    <p class="text-gray-300 text-lg mb-4">{{ formattedUserData?.email || 'Cargando...' }}</p>
                    <div class="flex items-center space-x-4">
                      <span class="bg-white bg-opacity-20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Cliente
                      </span>
                      <span class="text-sm text-gray-300">Miembro desde {{ formattedUserData?.miembroDesde || 'Cargando...' }}</span>
                    </div>
                  </div>
                  
                  <button
                    @click="startEdit"
                    v-if="!editMode && !loading && formattedUserData"
                    class="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg text-sm font-bold transition-all"
                  >
                    EDITAR PERFIL
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Body -->
            <div class="p-8">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-20">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
                <p class="mt-4 text-gray-600 font-medium">Cargando perfil...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-12">
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Error al cargar perfil</h3>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <div class="flex gap-4 justify-center">
                  <button 
                    @click="loadUserProfile"
                    class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Reintentar
                  </button>
                  <button 
                    @click="router.push('/login')"
                    class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Ir a Login
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div v-else-if="formattedUserData">
                <!-- Edit Mode -->
                <div v-if="editMode">
                  <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-black text-gray-900 tracking-tight">EDITAR INFORMACIÓN</h2>
                    <div class="flex space-x-3">
                      <button
                        @click="saveChanges"
                        :disabled="loading"
                        class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-semibold transition-all"
                      >
                        {{ loading ? 'GUARDANDO...' : 'GUARDAR' }}
                      </button>
                      <button
                        @click="cancelEdit"
                        class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                      >
                        CANCELAR
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Nombre completo</label>
                      <input
                        v-model="editForm.nombre"
                        type="text"
                        class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-medium"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Teléfono</label>
                      <input
                        v-model="editForm.telefono"
                        type="tel"
                        class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-medium"
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                    
                    <div class="lg:col-span-2">
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Dirección</label>
                      <textarea
                        v-model="editForm.direccion"
                        class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black font-medium h-24 resize-none"
                        placeholder="Tu dirección completa"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- View Mode -->
                <div v-else>
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-8 border-b border-gray-200 pb-3">
                    INFORMACIÓN PERSONAL
                  </h2>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Nombre completo</label>
                      <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg font-medium">
                        {{ formattedUserData.nombre }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Email</label>
                      <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg font-medium">
                        {{ formattedUserData.email }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Teléfono</label>
                      <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg font-medium">
                        {{ formattedUserData.telefono }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Miembro desde</label>
                      <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg font-medium">
                        {{ formattedUserData.miembroDesde }}
                      </div>
                    </div>
                    
                    <div class="lg:col-span-2">
                      <label class="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Dirección</label>
                      <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg font-medium">
                        {{ formattedUserData.direccion }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Actions -->
                  <div class="mt-12">
                    <h3 class="text-xl font-black text-gray-900 tracking-tight mb-6 border-b border-gray-200 pb-3">
                      ACCIONES RÁPIDAS
                    </h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <router-link 
                        to="/pedidos" 
                        class="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 p-6 rounded-xl text-center transition-all"
                      >
                        <div class="mx-auto w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span class="text-sm font-bold text-gray-900 uppercase tracking-wide">Mis Pedidos</span>
                      </router-link>
                      
                      <router-link 
                        to="/favoritos" 
                        class="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 p-6 rounded-xl text-center transition-all"
                      >
                        <div class="mx-auto w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span class="text-sm font-bold text-gray-900 uppercase tracking-wide">Favoritos</span>
                      </router-link>
                      
                      <button 
                        @click="startEdit" 
                        class="group bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 p-6 rounded-xl text-center transition-all"
                      >
                        <div class="mx-auto w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <span class="text-sm font-bold text-gray-900 uppercase tracking-wide">Editar Perfil</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.focus\:ring-2:focus {
  ring-width: 2px;
}

.focus\:ring-black:focus {
  ring-color: rgb(0 0 0);
}

.focus\:border-black:focus {
  border-color: rgb(0 0 0);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>