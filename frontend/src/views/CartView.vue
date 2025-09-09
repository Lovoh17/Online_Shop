
<template>
  <div class="min-h-screen bg-white">
    <!-- Notificación -->
    <div 
      v-if="notification.show"
      :class="{
        'bg-black text-white': notification.type === 'success',
        'bg-red-600 text-white': notification.type === 'error'
      }"
      class="fixed top-4 right-4 z-50 px-6 py-3 font-bold text-sm shadow-lg"
    >
      {{ notification.message }}
    </div>

    <!-- Modal de confirmación -->
    <div 
      v-if="showConfirmDelete" 
      class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 max-w-sm mx-4">
        <h3 class="text-xl font-black mb-4 text-gray-900">ELIMINAR PRODUCTO</h3>
        <p class="text-gray-600 mb-8">Esta acción no se puede deshacer.</p>
        <div class="flex gap-4">
          <button 
            @click="removeItem(showConfirmDelete)"
            class="flex-1 bg-red-600 text-white py-3 font-bold text-sm hover:bg-red-700 transition-colors"
          >
            ELIMINAR
          </button>
          <button 
            @click="showConfirmDelete = null"
            class="flex-1 bg-gray-200 text-gray-900 py-3 font-bold text-sm hover:bg-gray-300 transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">
            CARRITO ({{ cartStore.items.length }})
          </h1>
          <p class="text-sm font-medium text-gray-600 mt-1">
            {{ totalItemsInCart }} artículos totales
          </p>
        </div>
        <router-link to="/dashboard" class="text-sm font-bold text-gray-900 underline hover:no-underline">
          SEGUIR COMPRANDO
        </router-link>
      </div>

      <div v-if="cartStore.loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black"></div>
      </div>

      <div v-else-if="cartStore.error" class="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <span class="font-semibold text-red-700">{{ cartStore.error }}</span>
        </div>
      </div>

      <div v-else>
        <div v-if="cartStore.items.length === 0" class="bg-gray-50 p-12 text-center">
          <svg class="h-20 w-20 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="text-2xl font-black text-gray-900 mb-4">CARRITO VACÍO</h2>
          <p class="text-gray-600 mb-8 font-medium">Agrega algunos productos</p>
          <router-link 
            to="/productos" 
            class="inline-block bg-black text-white px-8 py-4 font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            VER PRODUCTOS
          </router-link>
        </div>

        <div v-else class="lg:grid lg:grid-cols-12 lg:gap-8">
          <!-- Lista de productos -->
          <div class="lg:col-span-8">
            <div class="bg-white border border-gray-200 mb-6">
              <div class="p-6 border-b border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      :checked="selectedItems.length === cartStore.items.length"
                      @change="toggleSelectAll"
                      class="h-4 w-4 accent-black mr-3"
                    >
                    <span class="font-bold text-gray-900">
                      SELECCIONAR TODO ({{ selectedItems.length }}/{{ cartStore.items.length }})
                    </span>
                  </div>
                  <button 
                    @click="removeSelectedItems"
                    class="font-bold text-sm text-gray-700 hover:text-red-600 transition-colors"
                    :disabled="selectedItems.length === 0"
                  >
                    ELIMINAR SELECCIONADOS
                  </button>
                </div>
              </div>

              <div class="divide-y divide-gray-200">
                <div v-for="item in cartStore.items" :key="item.producto._id" class="p-6">
                  <div class="flex">
                    <div class="flex-shrink-0 flex items-start pt-1">
                      <input 
                        type="checkbox" 
                        :checked="selectedItems.includes(item.producto._id)"
                        @change="toggleSelectItem(item.producto._id)"
                        class="h-4 w-4 accent-black"
                      >
                    </div>
                    
                    <div class="ml-6 flex-1 flex flex-col sm:flex-row">
                      <div class="flex-shrink-0">
                        <router-link :to="`/producto/${item.producto._id}`">
                          <img 
                            :src="item.producto.imagenes"
                            :alt="item.producto.nombre" 
                            @error="handleImageError"
                            class="w-24 h-24 object-cover bg-gray-50 border border-gray-200"
                          >
                        </router-link>
                      </div>
                      
                      <div class="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                        <div class="flex justify-between">
                          <router-link 
                            :to="`/producto/${item.producto._id}`"
                            class="font-black text-lg text-gray-900 uppercase tracking-wide hover:text-gray-600 transition-colors"
                          >
                            {{ item.producto.nombre }}
                          </router-link>
                          <p class="font-black text-xl text-gray-900 ml-6">
                            ${{ (item.producto.precio * item.cantidad).toLocaleString() }}
                          </p>
                        </div>
                        
                        <p v-if="item.producto.descripcion" class="mt-2 text-sm text-gray-600 font-medium">
                          {{ item.producto.descripcion }}
                        </p>
                        
                        <div class="mt-6 flex items-center justify-between">
                          <div class="flex items-center border border-gray-300">
                            <button 
                              @click="decrementQuantity(item.producto._id)"
                              class="w-12 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              :disabled="quantityInputs[item.producto._id] <= 1 || isUpdating[item.producto._id]"
                            >
                              <svg class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <input 
                              v-model.number="quantityInputs[item.producto._id]" 
                              @input="handleQuantityInput(item.producto._id, $event)"
                              type="number" 
                              min="1" 
                              max="99"
                              :disabled="isUpdating[item.producto._id]"
                              class="w-16 h-12 text-center border-0 focus:ring-0 focus:outline-none font-bold"
                            >
                            <button 
                              @click="incrementQuantity(item.producto._id)"
                              class="w-12 h-12 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              :disabled="quantityInputs[item.producto._id] >= 99 || isUpdating[item.producto._id]"
                            >
                              <svg class="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          <div class="flex items-center space-x-4">
                            <div v-if="isUpdating[item.producto._id]">
                              <div class="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-black"></div>
                            </div>
                            
                            <button 
                              @click="confirmRemoveItem(item.producto._id)"
                              class="font-bold text-sm text-gray-700 hover:text-red-600 transition-colors"
                            >
                              ELIMINAR
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cupón -->
            <div class="bg-white border border-gray-200 p-6">
              <h3 class="font-black text-lg text-gray-900 mb-4">CUPÓN DE DESCUENTO</h3>
              <div class="flex">
                <input 
                  v-model="couponCode"
                  type="text" 
                  placeholder="Código (ej: DESCUENTO10)" 
                  class="flex-1 border border-gray-300 px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-black"
                >
                <button 
                  @click="applyCoupon"
                  class="bg-black text-white px-6 py-3 font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  APLICAR
                </button>
              </div>
              <p v-if="couponError" class="text-sm font-bold text-red-600 mt-3">{{ couponError }}</p>
              <p v-if="discount > 0" class="text-sm font-bold text-green-600 mt-3">
                DESCUENTO APLICADO: ${{ discount.toLocaleString() }}
              </p>
            </div>
          </div>
          
          <!-- Resumen -->
          <div class="lg:col-span-4 mt-8 lg:mt-0">
            <div class="bg-white border border-gray-200">
              <div class="p-6 border-b border-gray-200 bg-gray-50">
                <h2 class="font-black text-xl text-gray-900">RESUMEN</h2>
              </div>
              
              <div class="p-6 space-y-6">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">
                    Subtotal ({{ selectedProductsCount }} items)
                  </span>
                  <span class="font-black text-gray-900">${{ selectedSubtotal.toLocaleString() }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Envío</span>
                  <span class="font-black text-green-600">GRATIS</span>
                </div>
                
                <div v-if="discount > 0" class="flex justify-between">
                  <span class="font-medium text-gray-600">Descuento</span>
                  <span class="font-black text-green-600">-${{ discount.toLocaleString() }}</span>
                </div>
                
                <div class="border-t border-gray-200 pt-6 flex justify-between">
                  <span class="text-xl font-black text-gray-900">TOTAL</span>
                  <span class="text-2xl font-black text-gray-900">${{ selectedTotal.toLocaleString() }}</span>
                </div>
                
                <button 
                  @click="proceedToCheckout"
                  :disabled="selectedItems.length === 0"
                  :class="{
                    'bg-black text-white hover:bg-gray-800': selectedItems.length > 0,
                    'bg-gray-300 text-gray-500 cursor-not-allowed': selectedItems.length === 0
                  }"
                  class="w-full py-4 font-black text-sm transition-colors"
                >
                  PAGAR ({{ selectedItems.length }} productos)
                </button>
                
                <div class="flex items-center text-sm font-medium text-gray-600 pt-4">
                  <svg class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>COMPRA PROTEGIDA</span>
                </div>
              </div>
            </div>

            <!-- Métodos de pago -->
            <div class="mt-6 bg-white border border-gray-200 p-6">
              <h3 class="font-black text-lg text-gray-900 mb-4">MÉTODOS DE PAGO</h3>
              <div class="flex flex-wrap gap-3">
                <div class="bg-gray-100 px-3 py-2">
                  <span class="font-bold text-xs text-gray-700">VISA</span>
                </div>
                <div class="bg-gray-100 px-3 py-2">
                  <span class="font-bold text-xs text-gray-700">MASTERCARD</span>
                </div>
                <div class="bg-gray-100 px-3 py-2">
                  <span class="font-bold text-xs text-gray-700">PAYPAL</span>
                </div>
                <div class="bg-gray-100 px-3 py-2">
                  <span class="font-bold text-xs text-gray-700">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const quantityInputs = ref({})
const selectedItems = ref([])
const couponCode = ref('')
const couponError = ref('')
const discount = ref(0)
const isUpdating = ref({})
const showConfirmDelete = ref(null)
const notification = ref({ show: false, message: '', type: 'success' })

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const totalItemsInCart = computed(() => {
  return cartStore.items.reduce((total, item) => total + item.cantidad, 0)
})

const selectedTotal = computed(() => {
  const subtotal = cartStore.items
    .filter(item => selectedItems.value.includes(item.producto._id))
    .reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
  
  return subtotal - discount.value
})

const selectedSubtotal = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(item.producto._id))
    .reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
})

const selectedProductsCount = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(item.producto._id))
    .reduce((count, item) => count + item.cantidad, 0)
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  try {
    await cartStore.fetchCart()
    cartStore.items.forEach(item => {
      quantityInputs.value[item.producto._id] = item.cantidad
      selectedItems.value.push(item.producto._id)
    })
  } catch (error) {
    showNotification('Error al cargar el carrito', 'error')
  }
})

watch(() => cartStore.items, (newItems) => {
  newItems.forEach(item => {
    if (quantityInputs.value[item.producto._id] !== item.cantidad) {
      quantityInputs.value[item.producto._id] = item.cantidad
    }
  })
  
  selectedItems.value = selectedItems.value.filter(id => 
    newItems.some(item => item.producto._id === id)
  )
}, { deep: true })

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const handleQuantityInput = (productId, event) => {
  let value = parseInt(event.target.value)
  if (isNaN(value) || value < 1) {
    value = 1
  }
  if (value > 99) {
    value = 99
  }
  quantityInputs.value[productId] = value
  debouncedUpdate(productId)
}

const debouncedUpdate = debounce(async (productId) => {
  await updateItemQuantity(productId)
}, 500)

const updateItemQuantity = async (productId, newQuantity = null) => {
  const quantity = newQuantity || quantityInputs.value[productId]
  const originalQuantity = cartStore.items.find(item => 
    item.producto._id === productId
  )?.cantidad || 1

  if (quantity === originalQuantity) return

  isUpdating.value[productId] = true
  
  try {
    await cartStore.updateQuantity(productId, quantity)
    showNotification('Cantidad actualizada correctamente')
  } catch (error) {
    quantityInputs.value[productId] = originalQuantity
    showNotification(
      error.response?.data?.message || 'Error al actualizar cantidad', 
      'error'
    )
  } finally {
    isUpdating.value[productId] = false
  }
}

const incrementQuantity = async (productId) => {
  const currentQuantity = quantityInputs.value[productId] || 1
  if (currentQuantity >= 99) return
  
  quantityInputs.value[productId] = currentQuantity + 1
  await updateItemQuantity(productId)
}

const decrementQuantity = async (productId) => {
  const currentQuantity = quantityInputs.value[productId] || 1
  if (currentQuantity <= 1) return
  
  quantityInputs.value[productId] = currentQuantity - 1
  await updateItemQuantity(productId)
}

const confirmRemoveItem = (productId) => {
  showConfirmDelete.value = productId
}

const removeItem = async (productId) => {
  try {
    await cartStore.removeFromCart(productId)
    selectedItems.value = selectedItems.value.filter(id => id !== productId)
    delete quantityInputs.value[productId]
    showNotification('Producto eliminado del carrito')
  } catch (error) {
    showNotification('Error al eliminar producto', 'error')
  }
  showConfirmDelete.value = null
}

const removeSelectedItems = async () => {
  if (selectedItems.value.length === 0) return
  
  try {
    for (const productId of [...selectedItems.value]) {
      await cartStore.removeFromCart(productId)
      delete quantityInputs.value[productId]
    }
    selectedItems.value = []
    showNotification(`${selectedItems.value.length} productos eliminados`)
  } catch (error) {
    showNotification('Error al eliminar productos', 'error')
  }
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

const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    couponError.value = 'Ingresa un código de cupón'
    return
  }
  
  try {
    couponError.value = ''
    if (couponCode.value.toLowerCase() === 'descuento10') {
      discount.value = selectedSubtotal.value * 0.1
      showNotification('¡Cupón aplicado correctamente!')
    } else {
      throw new Error('Código de cupón inválido')
    }
  } catch (error) {
    couponError.value = error.message || 'Error al aplicar cupón'
    discount.value = 0
  }
}

const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) {
    showNotification('Selecciona al menos un producto para continuar', 'error')
    return
  }
  
  const selectedProducts = cartStore.items.filter(item => 
    selectedItems.value.includes(item.producto._id)
  )
  
  sessionStorage.setItem('checkoutData', JSON.stringify({
    products: selectedProducts,
    subtotal: selectedSubtotal.value,
    discount: discount.value,
    total: selectedTotal.value,
    couponCode: couponCode.value
  }))
  
  router.push({ name: 'pago' })
}
</script>

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

input[type="number"] {
  -moz-appearance: textfield;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>