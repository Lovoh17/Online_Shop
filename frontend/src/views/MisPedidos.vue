<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const pedidos = ref([])
const filtro = ref('todos')

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
    completado: 'bg-green-600 text-white',
    pendiente: 'bg-yellow-600 text-white',
    cancelado: 'bg-red-600 text-white',
    enviado: 'bg-blue-600 text-white'
  }
  return colores[estado] || 'bg-gray-600 text-white'
}

const estadoTexto = (estado) => {
  const textos = {
    completado: 'COMPLETADO',
    pendiente: 'PENDIENTE',
    cancelado: 'CANCELADO',
    enviado: 'ENVIADO'
  }
  return textos[estado] || estado.toUpperCase()
}

onMounted(async () => {
  try {
    loading.value = true
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
  <div class="min-h-screen bg-white">
    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Menú lateral -->
        <div class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white border border-gray-200">
            <div class="p-6 bg-gray-900 text-white">
              <h3 class="font-black text-lg tracking-wide">MI CUENTA</h3>
            </div>
            <nav class="p-4">
              <router-link 
                to="/perfil" 
                class="flex items-center px-4 py-3 font-bold text-sm text-gray-900 hover:bg-gray-100 transition-colors uppercase tracking-wide"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información
              </router-link>
              
              <router-link 
                to="/pedidos" 
                class="flex items-center px-4 py-3 font-black text-sm text-gray-900 bg-gray-100 uppercase tracking-wide"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mis pedidos
              </router-link>
              
              <button
                @click="authStore.logout()"
                class="w-full flex items-center px-4 py-3 font-bold text-sm text-gray-900 hover:bg-gray-100 transition-colors uppercase tracking-wide"
              >
                <svg class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </nav>
          </div>
          
          <!-- Banner promocional -->
          <div class="mt-8 bg-gray-900 text-white p-6 text-center">
            <h4 class="font-black mb-3 text-lg">PROGRAMA PUNTOS</h4>
            <p class="text-sm mb-4">Acumula puntos con cada compra</p>
            <router-link 
              to="/puntos" 
              class="inline-block bg-white text-black font-bold px-6 py-2 text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Ver puntos
            </router-link>
          </div>
        </div>
        
        <!-- Contenido principal -->
        <div class="flex-1">
          <div class="bg-white border border-gray-200">
            <!-- Encabezado -->
            <div class="p-8 bg-gray-900 text-white">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="text-3xl font-black tracking-tight">MIS PEDIDOS</h2>
                  <p class="text-gray-300 font-medium mt-2">Estado de tus compras</p>
                </div>
                
                <div class="mt-6 md:mt-0">
                  <select 
                    v-model="filtro"
                    class="bg-white text-black font-bold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="todos">TODOS</option>
                    <option value="pendiente">PENDIENTES</option>
                    <option value="completado">COMPLETADOS</option>
                    <option value="cancelado">CANCELADOS</option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Cuerpo -->
            <div class="p-8">
              <div v-if="loading" class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black"></div>
              </div>

              <div v-else-if="error" class="text-center py-12">
                <div class="w-20 h-20 bg-red-600 mx-auto mb-6 flex items-center justify-center">
                  <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-black text-gray-900 mb-4">ERROR AL CARGAR</h3>
                <p class="text-gray-600 font-medium mb-8">{{ error }}</p>
                <button 
                  @click="router.push('/')"
                  class="px-8 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  VOLVER AL INICIO
                </button>
              </div>

              <div v-else-if="pedidosFiltrados.length === 0" class="text-center py-16">
                <div class="w-20 h-20 bg-gray-200 mx-auto mb-6 flex items-center justify-center">
                  <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-xl font-black text-gray-900 mb-4">SIN PEDIDOS</h3>
                <p class="text-gray-600 font-medium mb-8">No hay pedidos con los filtros seleccionados</p>
                <router-link 
                  to="/productos"
                  class="inline-block px-8 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  VER PRODUCTOS
                </router-link>
              </div>

              <div v-else class="space-y-8">
                <!-- Lista de pedidos -->
                <div 
                  v-for="pedido in pedidosFiltrados" 
                  :key="pedido.id"
                  class="border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <span class="font-black text-gray-900">PEDIDO #{{ pedido.id }}</span>
                      <span class="text-sm font-medium text-gray-600 ml-4">{{ formatearFecha(pedido.fecha) }}</span>
                    </div>
                    <div>
                      <span :class="['text-xs px-3 py-1 font-bold', estadoColor(pedido.estado)]">
                        {{ estadoTexto(pedido.estado) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="p-6">
                    <!-- Productos del pedido -->
                    <div class="space-y-6">
                      <div 
                        v-for="(item, index) in pedido.items" 
                        :key="index"
                        class="flex items-start"
                      >
                        <div class="flex-shrink-0 w-20 h-20 bg-gray-100 overflow-hidden">
                          <img 
                            :src="item.imagen" 
                            :alt="item.nombre"
                            class="w-full h-full object-cover"
                          >
                        </div>
                        <div class="ml-6 flex-1">
                          <h4 class="font-black text-gray-900 uppercase tracking-wide">{{ item.nombre }}</h4>
                          <p class="text-sm font-medium text-gray-600 mt-1">CANTIDAD: {{ item.cantidad }}</p>
                          <p class="font-black text-gray-900 mt-2">${{ item.precio.toFixed(2) }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Resumen del pedido -->
                    <div class="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between">
                      <div class="mb-6 md:mb-0">
                        <h4 class="font-black text-gray-900 mb-3">DIRECCIÓN DE ENTREGA</h4>
                        <p class="font-medium text-gray-600 leading-relaxed">
                          {{ pedido.direccionEntrega.nombre }}<br>
                          {{ pedido.direccionEntrega.calle }}<br>
                          {{ pedido.direccionEntrega.ciudad }}, {{ pedido.direccionEntrega.pais }} {{ pedido.direccionEntrega.codigoPostal }}
                        </p>
                      </div>
                      
                      <div class="text-right">
                        <p class="font-medium text-gray-600 mb-2">TOTAL DEL PEDIDO</p>
                        <p class="text-2xl font-black text-gray-900 mb-4">${{ pedido.total.toFixed(2) }}</p>
                        <button
                          @click="verDetalle(pedido.id)"
                          class="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                          VER DETALLES
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