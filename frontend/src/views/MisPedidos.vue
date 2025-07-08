<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const pedidos = ref([])
const filtro = ref('todos') // 'todos', 'pendientes', 'completados', 'cancelados'

// Datos de ejemplo (en producción vendrían de la API)
const pedidosEjemplo = [
  {
    id: 'ORD-2023-001',
    fecha: '2023-05-15T14:30:00Z',
    estado: 'completado',
    total: 125.99,
    items: [
      { nombre: 'Camiseta algodón', precio: 29.99, cantidad: 2, imagen: '/img/camiseta.jpg' },
      { nombre: 'Pantalón vaquero', precio: 49.99, cantidad: 1, imagen: '/img/pantalon.jpg' }
    ],
    direccionEntrega: {
      nombre: 'Mr. Paul Bernier',
      calle: '3388 3rd Avenue',
      ciudad: 'South Hailee',
      pais: 'Kazakhstan',
      codigoPostal: '04278-5183'
    }
  },
  {
    id: 'ORD-2023-002',
    fecha: '2023-06-02T10:15:00Z',
    estado: 'pendiente',
    total: 89.50,
    items: [
      { nombre: 'Zapatos deportivos', precio: 89.50, cantidad: 1, imagen: '/img/zapatos.jpg' }
    ],
    direccionEntrega: {
      nombre: 'Mr. Paul Bernier',
      calle: '3388 3rd Avenue',
      ciudad: 'South Hailee',
      pais: 'Kazakhstan',
      codigoPostal: '04278-5183'
    }
  },
  {
    id: 'ORD-2023-003',
    fecha: '2023-04-10T16:45:00Z',
    estado: 'cancelado',
    total: 210.75,
    items: [
      { nombre: 'Chaqueta de cuero', precio: 199.99, cantidad: 1, imagen: '/img/chaqueta.jpg' },
      { nombre: 'Cinturón', precio: 10.76, cantidad: 1, imagen: '/img/cinturon.jpg' }
    ],
    direccionEntrega: {
      nombre: 'Mr. Paul Bernier',
      calle: '3388 3rd Avenue',
      ciudad: 'South Hailee',
      pais: 'Kazakhstan',
      codigoPostal: '04278-5183'
    }
  }
]

const pedidosFiltrados = computed(() => {
  if (filtro.value === 'todos') return pedidos.value
  return pedidos.value.filter(p => p.estado === filtro.value)
})

const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const estadoColor = (estado) => {
  const colores = {
    completado: 'bg-green-100 text-green-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    cancelado: 'bg-red-100 text-red-800',
    enviado: 'bg-blue-100 text-blue-800'
  }
  return colores[estado] || 'bg-gray-100 text-gray-800'
}

const estadoTexto = (estado) => {
  const textos = {
    completado: 'Completado',
    pendiente: 'Pendiente',
    cancelado: 'Cancelado',
    enviado: 'Enviado'
  }
  return textos[estado] || estado
}

onMounted(async () => {
  try {
    loading.value = true
    // En una app real: await authStore.authenticatedFetch('/api/pedidos')
    // Simulamos carga de datos
    await new Promise(resolve => setTimeout(resolve, 800))
    pedidos.value = pedidosEjemplo
  } catch (err) {
    error.value = err.message || 'Error al cargar los pedidos'
  } finally {
    loading.value = false
  }
})

const verDetalle = (idPedido) => {
  router.push(`/pedidos/${idPedido}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-14">
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
              
              <button
                @click="authStore.logout()"
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
        
        <!-- Contenido principal -->
        <div class="flex-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <!-- Encabezado -->
            <div class="p-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="text-xl font-bold">Mis Pedidos</h2>
                  <p class="text-sm opacity-90">Revisa el estado de tus compras recientes</p>
                </div>
                
                <div class="mt-4 md:mt-0">
                  <label for="filtro" class="sr-only">Filtrar por estado</label>
                  <select 
                    id="filtro"
                    v-model="filtro"
                    class="bg-white bg-opacity-20 border border-white border-opacity-30 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="todos">Todos los pedidos</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="completado">Completados</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Cuerpo -->
            <div class="p-6">
              <div v-if="loading" class="flex justify-center py-12">
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
                <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar tus pedidos</h3>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <button 
                  @click="router.push('/')"
                  class="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Volver al inicio
                </button>
              </div>

              <div v-else-if="pedidosFiltrados.length === 0" class="text-center py-12">
                <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
                <p class="text-gray-600 mb-6">No encontramos pedidos con los filtros seleccionados</p>
                <router-link 
                  to="/productos"
                  class="inline-block px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Ver productos
                </router-link>
              </div>

              <div v-else class="space-y-6">
                <!-- Lista de pedidos -->
                <div 
                  v-for="pedido in pedidosFiltrados" 
                  :key="pedido.id"
                  class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span class="font-medium text-gray-900">Pedido #{{ pedido.id }}</span>
                      <span class="text-sm text-gray-500 ml-3">{{ formatearFecha(pedido.fecha) }}</span>
                    </div>
                    <div>
                      <span :class="['text-xs px-2 py-1 rounded-full', estadoColor(pedido.estado)]">
                        {{ estadoTexto(pedido.estado) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="p-4">
                    <!-- Productos del pedido -->
                    <div class="space-y-4">
                      <div 
                        v-for="(item, index) in pedido.items" 
                        :key="index"
                        class="flex items-start"
                      >
                        <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            :src="item.imagen" 
                            :alt="item.nombre"
                            class="w-full h-full object-cover"
                          >
                        </div>
                        <div class="ml-4 flex-1">
                          <h4 class="text-sm font-medium text-gray-900">{{ item.nombre }}</h4>
                          <p class="text-sm text-gray-500">Cantidad: {{ item.cantidad }}</p>
                          <p class="text-sm font-medium text-gray-900 mt-1">${{ item.precio.toFixed(2) }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Resumen del pedido -->
                    <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">Dirección de entrega</h4>
                        <p class="text-sm text-gray-500 mt-1">
                          {{ pedido.direccionEntrega.nombre }}<br>
                          {{ pedido.direccionEntrega.calle }}<br>
                          {{ pedido.direccionEntrega.ciudad }}, {{ pedido.direccionEntrega.pais }} {{ pedido.direccionEntrega.codigoPostal }}
                        </p>
                      </div>
                      
                      <div class="text-right">
                        <p class="text-sm text-gray-500">Total del pedido:</p>
                        <p class="text-lg font-bold text-pink-600">${{ pedido.total.toFixed(2) }}</p>
                        <button
                          @click="verDetalle(pedido.id)"
                          class="mt-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm font-medium transition-colors"
                        >
                          Ver detalles
                        </button>
                      </div>
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

<style>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>