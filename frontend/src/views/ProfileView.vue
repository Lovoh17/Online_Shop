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
  direccion: ''
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
    if (typeof direccion === 'string' && direccion.startsWith('{')) {
      const direccionObj = JSON.parse(direccion)
      const partes = []
      
      if (direccionObj.calle) partes.push(direccionObj.calle)
      if (direccionObj.ciudad) partes.push(direccionObj.ciudad)
      if (direccionObj.pais) partes.push(direccionObj.pais)
      if (direccionObj.codigoPostal) partes.push(direccionObj.codigoPostal)
      
      return partes.length > 0 ? partes.join(', ') : 'No especificada'
    }
    
    if (typeof direccion === 'object') {
      const partes = []
      if (direccion.calle) partes.push(direccion.calle)
      if (direccion.ciudad) partes.push(direccion.ciudad)
      if (direccion.pais) partes.push(direccion.pais)
      if (direccion.codigoPostal) partes.push(direccion.codigoPostal)
      
      return partes.length > 0 ? partes.join(', ') : 'No especificada'
    }
    
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

    const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.')
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.success) {
      userData.value = data.user
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

    const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editForm.value)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar perfil')
    }

    if (data.success) {
      userData.value = { ...userData.value, ...editForm.value }
      editMode.value = false
      
      showNotification('Perfil actualizado correctamente', 'success')
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
    fixed top-4 right-4 px-6 py-4 shadow-lg z-50 
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
  
  setTimeout(() => notification.classList.remove('translate-x-full'), 100)
  setTimeout(() => {
    notification.classList.add('translate-x-full')
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div class="bg-white shadow-sm border border-[#E5E7EB] p-4">
            <div class="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E5E7EB]">
              <div class="w-10 h-10 bg-[#1E3A34] flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-[#1E3A34]">Mi Cuenta</h3>
                <p class="text-xs text-[#5E5E5E]">Panel de control</p>
              </div>
            </div>
            
            <nav class="space-y-1">
              <router-link 
                to="/perfil" 
                class="flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F9FAFB] transition-colors"
                active-class="bg-[#1E3A34] text-white hover:bg-[#1E3A34] hover:text-white"
              >
                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </router-link>
              
              <router-link 
                to="/pedidos" 
                class="flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F9FAFB] transition-colors"
                active-class="bg-[#1E3A34] text-white hover:bg-[#1E3A34] hover:text-white"
              >
                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Pedidos
              </router-link>
              
              <router-link 
                to="/favoritos" 
                class="flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F9FAFB] transition-colors"
                active-class="bg-[#1E3A34] text-white hover:bg-[#1E3A34] hover:text-white"
              >
                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favoritos
              </router-link>
              <router-link 
                  to="/privacity" 
                  class="flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F9FAFB] transition-colors text-sm"
                  active-class="bg-[#1E3A34] text-white hover:bg-[#1E3A34] hover:text-white"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Política de Privacidad
                </router-link>
                
                <router-link 
                  to="/devoluciones" 
                  class="flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F9FAFB] transition-colors text-sm"
                  active-class="bg-[#1E3A34] text-white hover:bg-[#1E3A34] hover:text-white"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                  Política de Devoluciones
                </router-link>
            </nav>
            
            <div class="border-t border-[#E5E7EB] my-4"></div>
            
            <button
              @click="handleLogout"
              class="w-full flex items-center px-3 py-2.5 text-[#5E5E5E] hover:text-[#E57C23] hover:bg-[#FEF2E8] transition-colors"
            >
              <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <!-- Contenido Principal -->
        <div class="flex-1" style="height: 100px;">
          <div class="bg-white shadow-sm border border-[#E5E7EB]">
            <div class="p-6 bg-[#1E3A34] text-white border-b border-[#2A4A40]">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-[#2A4A40] flex items-center justify-center border-2 border-[#4F7C63]">
                    <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold mb-1">{{ formattedUserData?.nombre || 'Cargando...' }}</h2>
                    <p class="text-[#C2B280] text-sm mb-1">{{ formattedUserData?.email || 'Cargando...' }}</p>
                    <div class="flex items-center space-x-3 text-xs">
                      <span class="bg-[#2A4A40] px-2 py-1">Cliente</span>
                      <span class="text-white/80">Miembro desde {{ formattedUserData?.miembroDesde || 'Cargando...' }}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  @click="startEdit"
                  v-if="!editMode && !loading && formattedUserData"
                  class="bg-white text-[#1E3A34] hover:bg-[#F9FAFB] px-4 py-2 text-sm font-medium transition-colors"
                >
                  Editar Perfil
                </button>
              </div>
            </div>
            
            <!-- Contenido del Perfil -->
            <div class="p-6">
              <!-- Estados -->
              <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E5E7EB] border-t-[#1E3A34]"></div>
                <p class="mt-4 text-[#5E5E5E]">Cargando información del perfil...</p>
              </div>

              <div v-else-if="error" class="text-center py-12">
                <div class="mx-auto w-16 h-16 bg-[#FEF2E8] flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-[#E57C23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#1E3A34] mb-2">Error al cargar perfil</h3>
                <p class="text-[#5E5E5E] mb-6">{{ error }}</p>
                <div class="flex gap-3 justify-center">
                  <button 
                    @click="loadUserProfile"
                    class="px-5 py-2 bg-[#F9FAFB] text-[#5E5E5E] hover:bg-[#E5E7EB] transition-colors font-medium"
                  >
                    Reintentar
                  </button>
                  <button 
                    @click="router.push('/login')"
                    class="px-5 py-2 bg-[#1E3A34] text-white hover:bg-[#2A4A40] transition-colors font-medium"
                  >
                    Ir a Login
                  </button>
                </div>
              </div>

              <!-- Modo Edición -->
              <div v-else-if="formattedUserData && editMode" class="space-y-6">
                <div class="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                  <h3 class="text-xl font-semibold text-[#1E3A34]">Editar Información Personal</h3>
                  <div class="flex space-x-2">
                    <button
                      @click="saveChanges"
                      :disabled="loading"
                      class="px-5 py-2 bg-[#1E3A34] text-white hover:bg-[#2A4A40] disabled:opacity-50 font-medium transition-colors"
                    >
                      {{ loading ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button
                      @click="cancelEdit"
                      class="px-5 py-2 bg-[#F9FAFB] text-[#5E5E5E] hover:bg-[#E5E7EB] font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#1E3A34]">Nombre completo</label>
                    <input
                      v-model="editForm.nombre"
                      type="text"
                      class="w-full p-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-[#1E3A34] font-medium"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#1E3A34]">Teléfono</label>
                    <input
                      v-model="editForm.telefono"
                      type="tel"
                      class="w-full p-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-[#1E3A34] font-medium"
                      placeholder="Ingresa tu teléfono"
                    />
                  </div>
                  
                  <div class="lg:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-[#1E3A34]">Dirección</label>
                    <textarea
                      v-model="editForm.direccion"
                      class="w-full p-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-[#1E3A34] font-medium h-24 resize-none"
                      placeholder="Ingresa tu dirección completa"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Modo Visualización -->
              <div v-else-if="formattedUserData" class="space-y-6">
                <h3 class="text-xl font-semibold text-[#1E3A34] border-b border-[#E5E7EB] pb-4">
                  Información Personal
                </h3>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#5E5E5E]">Nombre completo</label>
                    <div class="p-3 bg-[#F9FAFB] border border-[#E5E7EB] font-medium text-[#1E3A34]">
                      {{ formattedUserData.nombre }}
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#5E5E5E]">Email</label>
                    <div class="p-3 bg-[#F9FAFB] border border-[#E5E7EB] font-medium text-[#1E3A34]">
                      {{ formattedUserData.email }}
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#5E5E5E]">Teléfono</label>
                    <div class="p-3 bg-[#F9FAFB] border border-[#E5E7EB] font-medium text-[#1E3A34]">
                      {{ formattedUserData.telefono }}
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#5E5E5E]">Miembro desde</label>
                    <div class="p-3 bg-[#F9FAFB] border border-[#E5E7EB] font-medium text-[#1E3A34]">
                      {{ formattedUserData.miembroDesde }}
                    </div>
                  </div>
                  
                  <div class="lg:col-span-2 space-y-2">
                    <label class="block text-sm font-medium text-[#5E5E5E]">Dirección</label>
                    <div class="p-3 bg-[#F9FAFB] border border-[#E5E7EB] font-medium text-[#1E3A34]">
                      {{ formattedUserData.direccion }}
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-colors {
  transition: color 0.2s, background-color 0.2s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>