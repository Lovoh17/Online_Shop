<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const quantityInputs = ref({})
const selectedItems = ref([])

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  await cartStore.fetchCart()
  // Inicializar cantidades y selección
  cartStore.items.forEach(item => {
    quantityInputs.value[item.producto._id] = item.cantidad
    selectedItems.value.push(item.producto._id)
  })
})

const updateItemQuantity = async (productId) => {
  const newQuantity = parseInt(quantityInputs.value[productId]) || 1
  await cartStore.updateQuantity(productId, newQuantity)
}

const removeItem = async (productId) => {
  await cartStore.removeFromCart(productId)
  selectedItems.value = selectedItems.value.filter(id => id !== productId)
}

const toggleSelectItem = (productId) => {
  const index = selectedItems.value.indexOf(productId)
  if (index === -1) {
    selectedItems.value.push(productId)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

const toggleSelectAll = () => {
  if (selectedItems.value.length === cartStore.items.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = cartStore.items.map(item => item.producto._id)
  }
}

const selectedTotal = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(item.producto._id))
    .reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
})

const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) return
  router.push({ name: 'pago' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header estilo SHEIN -->
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

            <router-link 
              to="/perfil" 
              class="hidden md:flex items-center text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
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
              <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartStore.itemCount }}
              </span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">MI CARRITO ({{ cartStore.itemCount }})</h1>
        <router-link to="/dashboard" class="text-sm text-pink-500 hover:text-pink-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Seguir comprando
        </router-link>
      </div>

      <div v-if="cartStore.loading" class="flex justify-center py-12">
        <svg class="animate-spin h-12 w-12 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="cartStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm text-red-700">{{ cartStore.error }}</span>
        </div>
      </div>

      <div v-else>
        <div v-if="cartStore.items.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
          <p class="mt-1 text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
          <router-link 
            to="/productos" 
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ver productos
          </router-link>
        </div>

        <div v-else class="lg:grid lg:grid-cols-12 lg:gap-6">
          <!-- Lista de productos -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div class="p-4 border-b border-gray-200 flex items-center bg-gray-50">
                <input 
                  type="checkbox" 
                  :checked="selectedItems.length === cartStore.items.length"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                >
                <span class="ml-2 text-sm text-gray-700">Seleccionar todo ({{ selectedItems.length }})</span>
                <button 
                  @click="selectedItems.forEach(id => removeItem(id))"
                  class="ml-auto text-sm text-gray-500 hover:text-pink-500 flex items-center"
                  :disabled="selectedItems.length === 0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar seleccionados
                </button>
              </div>

              <ul class="divide-y divide-gray-200">
                <li v-for="item in cartStore.items" :key="item.producto._id" class="p-4">
                  <div class="flex">
                    <div class="flex-shrink-0 flex items-start pt-1">
                      <input 
                        type="checkbox" 
                        :checked="selectedItems.includes(item.producto._id)"
                        @change="toggleSelectItem(item.producto._id)"
                        class="h-4 w-4 text-pink-500 rounded border-gray-300 focus:ring-pink-500"
                      >
                    </div>
                    
                    <div class="ml-4 flex-1 flex flex-col sm:flex-row">
                      <div class="flex-shrink-0">
                        <router-link :to="`/producto/${item.producto._id}`">
                          <img 
                            :src="item.producto.imagen || 'https://via.placeholder.com/150'" 
                            :alt="item.producto.nombre" 
                            class="w-20 h-20 rounded-md object-cover border border-gray-200"
                          >
                        </router-link>
                      </div>
                      
                      <div class="mt-2 sm:mt-0 sm:ml-4 flex-grow">
                        <div class="flex justify-between">
                          <router-link 
                            :to="`/producto/${item.producto._id}`"
                            class="text-base font-medium text-gray-900 hover:text-pink-500"
                          >
                            {{ item.producto.nombre }}
                          </router-link>
                          <p class="text-base font-bold text-pink-500 ml-4">
                            ${{ (item.producto.precio * item.cantidad).toLocaleString() }}
                          </p>
                        </div>
                        
                        <p v-if="item.producto.descripcion" class="mt-1 text-sm text-gray-500 line-clamp-2">
                          {{ item.producto.descripcion }}
                        </p>
                        
                        <div class="mt-3 flex items-center">
                          <div class="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button 
                              @click="quantityInputs[item.producto._id]--; updateItemQuantity(item.producto._id)"
                              class="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              :disabled="quantityInputs[item.producto._id] <= 1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <input 
                              v-model.number="quantityInputs[item.producto._id]" 
                              @change="updateItemQuantity(item.producto._id)"
                              type="number" 
                              min="1" 
                              class="w-12 text-center border-0 focus:ring-0 focus:outline-none text-sm"
                            >
                            <button 
                              @click="quantityInputs[item.producto._id]++; updateItemQuantity(item.producto._id)"
                              class="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <button 
                            @click="removeItem(item.producto._id)"
                            class="ml-4 text-sm text-gray-500 hover:text-pink-500 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-2">¿TIENES UN CUPÓN DE DESCUENTO?</h3>
              <div class="flex">
                <input 
                  type="text" 
                  placeholder="Ingresa tu código" 
                  class="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                >
                <button class="bg-gray-800 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-gray-700 transition-colors">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-4 mt-6 lg:mt-0">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">RESUMEN DEL PEDIDO</h2>
              </div>
              
              <div class="p-4 space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal ({{ selectedItems.length }} productos)</span>
                  <span class="font-medium">${{ selectedTotal.toLocaleString() }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Envío</span>
                  <span class="font-medium text-green-500">GRATIS</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Descuento</span>
                  <span class="font-medium">$0</span>
                </div>
                
                <div class="border-t border-gray-200 pt-4 flex justify-between">
                  <span class="text-lg font-bold text-gray-900">Total</span>
                  <span class="text-lg font-bold text-pink-500">${{ selectedTotal.toLocaleString() }}</span>
                </div>
                
                <button 
                  @click="proceedToCheckout"
                  :disabled="selectedItems.length === 0"
                  :class="{
                    'bg-pink-500 hover:bg-pink-600': selectedItems.length > 0,
                    'bg-gray-300 cursor-not-allowed': selectedItems.length === 0
                  }"
                  class="w-full py-3 px-4 rounded-md text-white font-medium transition-colors mt-4"
                >
                  PROCEDER AL PAGO
                </button>
                
                <div class="flex items-center text-sm text-gray-500 mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Compra protegida con garantía de devolución</span>
                </div>
              </div>
            </div>

            <div class="mt-4 bg-white rounded-lg shadow-sm overflow-hidden p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">MÉTODOS DE PAGO</h3>
              <div class="flex flex-wrap gap-2">
                <img src="https://th.bing.com/th/id/R.c7b8552689fc9bf2cf541d80c817d8c2?rik=6%2fQpNehhAsOOZg&pid=ImgRaw&r=0" alt="Visa" class="h-6">
                <img src="https://th.bing.com/th/id/OIP.2GBsE98iH4hZsEB-8DZqNQHaHa?r=0&rs=1&pid=ImgDetMain" alt="Mastercard" class="h-6">
                <img src="https://th.bing.com/th/id/R.bd1419f2f730ef7ba64126743e0e391e?rik=9ZRBG8q8wWAKmA&pid=ImgRaw&r=0" alt="PayPal" class="h-6">
                <img src="https://logodix.com/logo/61136.png" alt="American Express" class="h-6">
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>