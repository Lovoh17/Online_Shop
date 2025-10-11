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
    completado: 'bg-[#4F7C63] text-white',
    pendiente: 'bg-[#C2B280] text-[#1E3A34]',
    cancelado: 'bg-[#E57C23] text-white',
    enviado: 'bg-[#1E3A34] text-white'
  }
  return colores[estado] || 'bg-[#5E5E5E] text-white'
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
  <div class="min-h-screen bg-[#F8FAFC]">
    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar con Tarjetas -->
        <div class="w-full lg:w-80 flex-shrink-0 space-y-6">
          <!-- Tarjeta de Navegación -->
          <div class="bg-white shadow-md border border-[#E2E8F0] p-6">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-[#1E3A34]">Mi Cuenta</h3>
                <p class="text-sm text-[#5E5E5E]">Panel de control</p>
              </div>
            </div>
            
            <nav class="space-y-2">
              <router-link 
                to="/perfil" 
                class="flex items-center px-4 py-3 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F8FAFC] transition-all group"
              >
                <div class="w-8 h-8 bg-[#F1F5F9] flex items-center justify-center mr-3">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Perfil
              </router-link>
              
              <router-link 
                to="/pedidos" 
                class="flex items-center px-4 py-3 bg-[#1E3A34] text-white group"
              >
                <div class="w-8 h-8 bg-white/20 flex items-center justify-center mr-3">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Mis Pedidos
              </router-link>
              
              <router-link 
                to="/favoritos" 
                class="flex items-center px-4 py-3 text-[#5E5E5E] hover:text-[#1E3A34] hover:bg-[#F8FAFC] transition-all group"
              >
                <div class="w-8 h-8 bg-[#F1F5F9] flex items-center justify-center mr-3">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                Favoritos
              </router-link>
            </nav>
            
            <div class="border-t border-[#E2E8F0] my-4"></div>
            
            <button
              @click="authStore.logout()"
              class="w-full flex items-center px-4 py-3 text-[#5E5E5E] hover:text-[#E57C23] hover:bg-[#FEF2E8] transition-all group"
            >
              <div class="w-8 h-8 bg-[#F1F5F9] group-hover:bg-[#FED7AA] flex items-center justify-center mr-3">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              Cerrar Sesión
            </button>
          </div>

          <!-- Tarjeta de Filtros -->
          <div class="bg-white shadow-md border border-[#E2E8F0] p-6">
            <h4 class="font-semibold text-[#1E3A34] mb-4">Filtrar Pedidos</h4>
            <div class="space-y-3">
              <button
                @click="filtro = 'todos'"
                :class="['w-full text-left px-4 py-3 transition-all font-medium', 
                         filtro === 'todos' ? 'bg-[#1E3A34] text-white' : 'bg-[#F8FAFC] text-[#5E5E5E] hover:bg-[#E2E8F0]']"
              >
                Todos los pedidos
              </button>
              <button
                @click="filtro = 'pendiente'"
                :class="['w-full text-left px-4 py-3 transition-all font-medium', 
                         filtro === 'pendiente' ? 'bg-[#C2B280] text-[#1E3A34]' : 'bg-[#F8FAFC] text-[#5E5E5E] hover:bg-[#E2E8F0]']"
              >
                Pedidos pendientes
              </button>
              <button
                @click="filtro = 'completado'"
                :class="['w-full text-left px-4 py-3 transition-all font-medium', 
                         filtro === 'completado' ? 'bg-[#4F7C63] text-white' : 'bg-[#F8FAFC] text-[#5E5E5E] hover:bg-[#E2E8F0]']"
              >
                Pedidos completados
              </button>
              <button
                @click="filtro = 'cancelado'"
                :class="['w-full text-left px-4 py-3 transition-all font-medium', 
                         filtro === 'cancelado' ? 'bg-[#E57C23] text-white' : 'bg-[#F8FAFC] text-[#5E5E5E] hover:bg-[#E2E8F0]']"
              >
                Pedidos cancelados
              </button>
            </div>
          </div>

          <!-- Banner Promocional -->
          <div class="bg-[#1E3A34] text-white p-6 text-center">
            <div class="w-12 h-12 bg-white/20 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="font-semibold mb-2">Programa de Puntos</h4>
            <p class="text-sm text-white/80 mb-4">Acumula puntos con cada compra</p>
            <router-link 
              to="/puntos" 
              class="inline-block bg-white/20 text-white hover:bg-white/30 px-4 py-2 text-sm font-medium transition-all border border-white/20"
            >
              Ver puntos
            </router-link>
          </div>
        </div>
        
        <!-- Contenido Principal -->
        <div class="flex-1">
          <!-- Tarjeta Principal de Pedidos -->
          <div class="bg-white shadow-md border border-[#E2E8F0] overflow-hidden">
            <!-- Header con Estadísticas -->
            <div class="p-8 bg-[#1E3A34] text-white">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Historial de Pedidos</h2>
                  <p class="text-[#C2B280]">Revisa y gestiona tus compras</p>
                </div>
                
                <div class="mt-6 lg:mt-0">
                  <div class="flex items-center space-x-4 text-sm">
                    <div class="text-center">
                      <div class="text-2xl font-bold">{{ pedidosFiltrados.length }}</div>
                      <div class="text-[#C2B280]">Pedidos</div>
                    </div>
                    <div class="w-px h-8 bg-white/20"></div>
                    <div class="text-center">
                      <div class="text-2xl font-bold">${{ pedidosFiltrados.reduce((sum, p) => sum + p.total, 0).toFixed(2) }}</div>
                      <div class="text-[#C2B280]">Total gastado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Cuerpo de Pedidos -->
            <div class="p-8">
              <!-- Estados de Carga y Error -->
              <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E2E8F0] border-t-[#1E3A34]"></div>
                <p class="mt-4 text-[#5E5E5E]">Cargando tus pedidos...</p>
              </div>

              <div v-else-if="error" class="text-center py-12">
                <div class="mx-auto w-16 h-16 bg-[#FEF2E8] flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-[#E57C23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#1E3A34] mb-2">Error al cargar pedidos</h3>
                <p class="text-[#5E5E5E] mb-6">{{ error }}</p>
                <button 
                  @click="router.push('/')"
                  class="px-6 py-2.5 bg-[#1E3A34] text-white hover:bg-[#2A4A40] transition-colors font-medium"
                >
                  Volver al Inicio
                </button>
              </div>

              <div v-else-if="pedidosFiltrados.length === 0" class="text-center py-16">
                <div class="mx-auto w-20 h-20 bg-[#F8FAFC] flex items-center justify-center mb-6">
                  <svg class="w-10 h-10 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-[#1E3A34] mb-4">No hay pedidos</h3>
                <p class="text-[#5E5E5E] mb-8 max-w-md mx-auto">
                  {{ filtro === 'todos' ? 'Aún no has realizado ningún pedido. Descubre nuestros productos y haz tu primera compra.' : 'No hay pedidos con el filtro seleccionado.' }}
                </p>
                <router-link 
                  to="/productos"
                  class="inline-block px-6 py-3 bg-[#1E3A34] text-white hover:bg-[#2A4A40] transition-colors font-medium"
                >
                  Explorar Productos
                </router-link>
              </div>

              <!-- Lista de Pedidos -->
              <div v-else class="space-y-6">
                <div 
                  v-for="pedido in pedidosFiltrados" 
                  :key="pedido.id"
                  class="bg-white border-2 border-[#E2E8F0] hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <!-- Header del Pedido -->
                  <div class="bg-[#F8FAFC] px-6 py-4 border-b-2 border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div class="w-10 h-10 bg-[#1E3A34] flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-[#1E3A34]">Pedido #{{ pedido.id }}</h4>
                        <p class="text-sm text-[#5E5E5E]">{{ formatearFecha(pedido.fecha) }}</p>
                      </div>
                    </div>
                    <div>
                      <span :class="['px-4 py-2 text-sm font-medium', estadoColor(pedido.estado)]">
                        {{ estadoTexto(pedido.estado) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Contenido del Pedido -->
                  <div class="p-6">
                    <!-- Productos -->
                    <div class="space-y-4 mb-6">
                      <h5 class="font-semibold text-[#1E3A34] mb-3">Productos</h5>
                      <div 
                        v-for="(item, index) in pedido.items" 
                        :key="index"
                        class="flex items-center space-x-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0]"
                      >
                        <div class="flex-shrink-0 w-16 h-16 bg-[#E2E8F0] overflow-hidden">
                          <img 
                            :src="item.imagen" 
                            :alt="item.nombre"
                            class="w-full h-full object-cover"
                          >
                        </div>
                        <div class="flex-1">
                          <h6 class="font-medium text-[#1E3A34]">{{ item.nombre }}</h6>
                          <p class="text-sm text-[#5E5E5E] mt-1">Cantidad: {{ item.cantidad }}</p>
                        </div>
                        <div class="text-right">
                          <p class="font-semibold text-[#1E3A34]">${{ item.precio.toFixed(2) }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Información de Entrega y Total -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t-2 border-[#E2E8F0]">
                      <div>
                        <h5 class="font-semibold text-[#1E3A34] mb-3">Dirección de Entrega</h5>
                        <div class="bg-[#F8FAFC] p-4 border border-[#E2E8F0]">
                          <p class="text-sm text-[#5E5E5E] leading-relaxed">
                            {{ pedido.direccionEntrega.nombre }}<br>
                            {{ pedido.direccionEntrega.calle }}<br>
                            {{ pedido.direccionEntrega.ciudad }}, {{ pedido.direccionEntrega.pais }}<br>
                            {{ pedido.direccionEntrega.codigoPostal }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="text-center lg:text-right">
                        <div class="bg-[#1E3A34] text-white p-6">
                          <p class="text-sm opacity-90 mb-2">Total del Pedido</p>
                          <p class="text-3xl font-bold mb-4">${{ pedido.total.toFixed(2) }}</p>
                          <button
                            @click="verDetalle(pedido.id)"
                            class="w-full bg-white/20 text-white hover:bg-white/30 px-6 py-2 font-medium transition-all border border-white/20"
                          >
                            Ver Detalles Completos
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
      </div>
    </main>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>