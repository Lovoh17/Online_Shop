<template>
  <div class="min-h-screen bg-white">
    <!-- Notificación -->
    <div 
      v-if="notification.show"
      :class="{
        'bg-[#1E3A34] text-white': notification.type === 'success',
        'bg-[#E57C23] text-white': notification.type === 'error'
      }"
      class="fixed top-6 right-6 z-50 px-6 py-4 font-bold text-sm rounded-lg transition-all duration-300"
    >
      <div class="flex items-center space-x-3">
        <svg v-if="notification.type === 'success'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ notification.message }}</span>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div 
      v-if="showConfirmDelete" 
      class="fixed inset-0 bg-[#0F0F0F] bg-opacity-75 z-50 flex items-center justify-center p-4 transition-all duration-300"
    >
      <div class="bg-white p-8 max-w-md w-full rounded-lg border border-[#A3A3A3]">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#E57C23] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#E57C23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-[#1E3A34] mb-2">¿Eliminar Producto?</h3>
          <p class="text-[#5E5E5E]">Esta acción no se puede deshacer. El producto se eliminará permanentemente de tu carrito.</p>
        </div>
        <div class="flex gap-4">
          <button 
            @click="removeItem(showConfirmDelete)"
            class="flex-1 bg-[#E57C23] text-white py-4 font-bold text-sm hover:bg-[#D2691E] transition-all duration-300 rounded-lg"
          >
            ELIMINAR
          </button>
          <button 
            @click="showConfirmDelete = null"
            class="flex-1 bg-[#F5F5F5] text-[#5E5E5E] py-4 font-bold text-sm hover:bg-[#E5E5E5] transition-all duration-300 rounded-lg border border-[#A3A3A3]"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
        <div class="mb-6 lg:mb-0">
          <div class="flex items-center space-x-4 mb-3">
            <div class="w-12 h-12 bg-[#1E3A34] rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-[#1E3A34]">
                MI CARRITO
              </h1>
              <p class="text-lg font-medium text-[#5E5E5E] mt-1">
                {{ totalItemsInCart }} artículo{{ totalItemsInCart !== 1 ? 's' : '' }} en total
              </p>
            </div>
          </div>
        </div>
        <router-link 
          to="/products" 
          class="group bg-white px-6 py-3 rounded-lg border border-[#1E3A34] hover:bg-[#1E3A34] transition-all duration-300"
        >
          <span class="font-bold text-[#1E3A34] group-hover:text-white transition-colors duration-300 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>SEGUIR COMPRANDO</span>
          </span>
        </router-link>
      </div>

      <!-- Estados de carga y error -->
      <div v-if="cartStore.loading" class="flex justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-[#C2B280] border-t-[#1E3A34] mb-4"></div>
          <p class="text-[#5E5E5E] font-medium">Cargando tu carrito...</p>
        </div>
      </div>

      <div v-else-if="cartStore.error" class="bg-[#F5F5F5] border-l-4 border-[#E57C23] p-6 mb-8 rounded-r-lg">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-[#E57C23] bg-opacity-10 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-[#E57C23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-[#1E3A34] text-lg">Error al cargar el carrito</h3>
            <p class="text-[#5E5E5E]">{{ cartStore.error }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Carrito vacío -->
        <div v-if="cartStore.items.length === 0" class="bg-white p-12 text-center rounded-lg border border-[#A3A3A3] max-w-2xl mx-auto">
          <div class="w-24 h-24 bg-[#F5F5F5] rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-[#5E5E5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-[#1E3A34] mb-4">Tu carrito está vacío</h2>
          <p class="text-[#5E5E5E] mb-8 text-lg">Descubre productos increíbles y comienza a llenarlo</p>
          <router-link 
            to="/products" 
            class="inline-flex items-center space-x-3 bg-[#1E3A34] text-white px-8 py-4 font-bold text-sm hover:bg-[#2A4A40] transition-all duration-300 rounded-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>EXPLORAR PRODUCTOS</span>
          </router-link>
        </div>

        <!-- Contenido del carrito -->
        <div v-else class="lg:grid lg:grid-cols-12 lg:gap-8">
          <!-- Lista de productos -->
          <div class="lg:col-span-8 space-y-6">
            <!-- Tarjeta de selección -->
            <div class="bg-white rounded-lg border border-[#A3A3A3] overflow-hidden">
              <div class="p-6 border-b border-[#A3A3A3] bg-[#F5F5F5]">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <input 
                      type="checkbox" 
                      :checked="selectedItems.length === cartStore.items.length"
                      @change="toggleSelectAll"
                      class="h-5 w-5 accent-[#1E3A34]"
                    >
                    <span class="font-bold text-[#1E3A34] text-lg">
                      Seleccionar todo ({{ selectedItems.length }}/{{ cartStore.items.length }})
                    </span>
                  </div>
                  <button 
                    @click="removeSelectedItems"
                    :disabled="selectedItems.length === 0"
                    :class="{
                      'text-[#E57C23] hover:text-[#D2691E] cursor-pointer': selectedItems.length > 0,
                      'text-[#A3A3A3] cursor-not-allowed': selectedItems.length === 0
                    }"
                    class="font-bold text-sm transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>ELIMINAR SELECCIONADOS</span>
                  </button>
                </div>
              </div>

              <!-- Lista de productos -->
              <div class="divide-y divide-[#A3A3A3]">
                <div v-for="item in cartStore.items" :key="item.producto._id" class="p-6 hover:bg-[#F9F9F9] transition-all duration-300">
                  <div class="flex space-x-4">
                    <!-- Checkbox -->
                    <div class="flex-shrink-0 flex items-start pt-2">
                      <input 
                        type="checkbox" 
                        :checked="selectedItems.includes(item.producto._id)"
                        @change="toggleSelectItem(item.producto._id)"
                        class="h-5 w-5 accent-[#1E3A34]"
                      >
                    </div>
                    
                    <!-- Contenido del producto -->
                    <div class="flex-1 flex flex-col sm:flex-row space-x-6">
                      <!-- Imagen -->
                        <div class="flex-shrink-0">
                          <router-link :to="`/producto/${item.producto._id}`" class="block">
                            <div class="w-28 h-28 bg-[#F5F5F5] rounded-lg overflow-hidden border border-[#A3A3A3]">
                              <img 
                                :src="item.producto.imagen"
                                :alt="item.producto.nombre" 
                                @error="handleImageError"
                                class="w-full h-full object-cover"
                              >
                            </div>
                          </router-link>
                        </div>
                      <!-- Detalles -->
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                          <div class="flex-1">
                            <router-link 
                              :to="`/producto/${item.producto._id}`"
                              class="font-bold text-xl text-[#1E3A34] hover:text-[#2A4A40] transition-colors duration-300 line-clamp-2"
                            >
                              {{ item.producto.nombre }}
                            </router-link>
                            <p v-if="item.producto.descripcion" class="mt-2 text-[#5E5E5E] line-clamp-2">
                              {{ item.producto.descripcion }}
                            </p>
                          </div>
                          <p class="font-bold text-2xl text-[#1E3A34] whitespace-nowrap">
                            ${{ (item.producto.precio * item.cantidad).toLocaleString() }}
                          </p>
                        </div>
                        
                        <!-- Controles -->
                        <div class="mt-6 flex items-center justify-between">
                          <!-- Selector de cantidad -->
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center border border-[#A3A3A3] rounded-lg overflow-hidden">
                              <button 
                                @click="decrementQuantity(item.producto._id)"
                                :disabled="quantityInputs[item.producto._id] <= 1 || isUpdating[item.producto._id]"
                                class="w-12 h-12 bg-white text-[#5E5E5E] hover:bg-[#F5F5F5] disabled:bg-[#F0F0F0] disabled:text-[#A3A3A3] transition-all duration-300 flex items-center justify-center"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                                </svg>
                              </button>
                              <input 
                                v-model.number="quantityInputs[item.producto._id]" 
                                @input="handleQuantityInput(item.producto._id, $event)"
                                type="number" 
                                min="1" 
                                max="99"
                                :disabled="isUpdating[item.producto._id]"
                                class="w-16 h-12 text-center border-0 focus:ring-0 focus:outline-none font-bold bg-white text-[#1E3A34]"
                              >
                              <button 
                                @click="incrementQuantity(item.producto._id)"
                                :disabled="quantityInputs[item.producto._id] >= 99 || isUpdating[item.producto._id]"
                                class="w-12 h-12 bg-white text-[#5E5E5E] hover:bg-[#F5F5F5] disabled:bg-[#F0F0F0] disabled:text-[#A3A3A3] transition-all duration-300 flex items-center justify-center"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                              </button>
                            </div>
                            
                            <!-- Loading indicator -->
                            <div v-if="isUpdating[item.producto._id]" class="flex items-center space-x-2 text-[#5E5E5E]">
                              <div class="animate-spin rounded-full h-5 w-5 border-2 border-[#C2B280] border-t-[#1E3A34]"></div>
                              <span class="text-sm font-medium">Actualizando...</span>
                            </div>
                          </div>
                          
                          <!-- Acciones -->
                          <button 
                            @click="confirmRemoveItem(item.producto._id)"
                            class="font-bold text-sm text-[#E57C23] hover:text-[#D2691E] transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-[#F5F5F5]"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            <span>ELIMINAR</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cupón de descuento -->
            <div class="bg-white rounded-lg border border-[#A3A3A3] p-6">
              <h3 class="font-bold text-xl text-[#1E3A34] mb-4 flex items-center space-x-3">
                <div class="w-10 h-10 bg-[#C2B280] rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                  </svg>
                </div>
                <span>CUPÓN DE DESCUENTO</span>
              </h3>
              <div class="flex space-x-4">
                <input 
                  v-model="couponCode"
                  type="text" 
                  placeholder="Ingresa tu código (ej: DESCUENTO10)" 
                  class="flex-1 border border-[#A3A3A3] px-4 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A34] rounded-lg bg-white focus:bg-white transition-all duration-300"
                >
                <button 
                  @click="applyCoupon"
                  class="bg-[#C2B280] text-white px-8 py-4 font-bold text-sm hover:bg-[#B8A476] transition-all duration-300 rounded-lg"
                >
                  APLICAR
                </button>
              </div>
              <p v-if="couponError" class="text-sm font-bold text-[#E57C23] mt-3 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ couponError }}</span>
              </p>
              <p v-if="discount > 0" class="text-sm font-bold text-[#4F7C63] mt-3 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>DESCUENTO APLICADO: ${{ discount.toLocaleString() }}</span>
              </p>
            </div>
          </div>
          
          <!-- Resumen del pedido -->
          <div class="lg:col-span-4 mt-8 lg:mt-0">
            <div class="sticky top-8 space-y-6">
              <!-- Resumen -->
              <div class="bg-white rounded-lg border border-[#A3A3A3] overflow-hidden">
                <div class="p-6 border-b border-[#A3A3A3] bg-[#F5F5F5]">
                  <h2 class="font-bold text-2xl text-[#1E3A34]">RESUMEN DEL PEDIDO</h2>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-[#5E5E5E]">
                      Subtotal ({{ selectedProductsCount }} items)
                    </span>
                    <span class="font-bold text-xl text-[#1E3A34]">${{ selectedSubtotal.toLocaleString() }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-[#5E5E5E]">Envío</span>
                    <span class="font-bold text-lg text-[#4F7C63]">GRATIS</span>
                  </div>
                  
                  <div v-if="discount > 0" class="flex justify-between items-center">
                    <span class="font-medium text-[#5E5E5E]">Descuento</span>
                    <span class="font-bold text-lg text-[#4F7C63]">-${{ discount.toLocaleString() }}</span>
                  </div>
                  
                  <div class="border-t border-[#A3A3A3] pt-6 flex justify-between items-center">
                    <span class="text-2xl font-bold text-[#1E3A34]">TOTAL</span>
                    <span class="text-3xl font-bold text-[#1E3A34]">${{ selectedTotal.toLocaleString() }}</span>
                  </div>
                  
                  <button 
                    @click="proceedToCheckout"
                    :disabled="selectedItems.length === 0"
                    :class="{
                      'bg-[#1E3A34] text-white hover:bg-[#2A4A40]': selectedItems.length > 0,
                      'bg-[#A3A3A3] text-[#5E5E5E] cursor-not-allowed': selectedItems.length === 0
                    }"
                    class="w-full py-5 font-bold text-lg transition-all duration-300 rounded-lg flex items-center justify-center space-x-3"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span>PROCESAR PAGO ({{ selectedItems.length }})</span>
                  </button>
                  
                  <div class="flex items-center justify-center space-x-3 text-sm font-medium text-[#5E5E5E] pt-4">
                    <svg class="w-5 h-5 text-[#4F7C63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>COMPRA 100% PROTEGIDA Y SEGURA</span>
                  </div>
                </div>
              </div>

              <!-- Métodos de pago -->
              <div class="bg-white rounded-lg border border-[#A3A3A3] p-6">
                <h3 class="font-bold text-lg text-[#1E3A34] mb-4 flex items-center space-x-3">
                  <div class="w-8 h-8 bg-[#7CAFBF] rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                  </div>
                  <span>MÉTODOS DE PAGO</span>
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-[#F5F5F5] px-4 py-3 rounded-lg border border-[#A3A3A3] text-center">
                    <span class="font-bold text-sm text-[#1E3A34]">VISA</span>
                  </div>
                  <div class="bg-[#F5F5F5] px-4 py-3 rounded-lg border border-[#A3A3A3] text-center">
                    <span class="font-bold text-sm text-[#1E3A34]">MASTERCARD</span>
                  </div>
                  <div class="bg-[#F5F5F5] px-4 py-3 rounded-lg border border-[#A3A3A3] text-center">
                    <span class="font-bold text-sm text-[#1E3A34]">PAYPAL</span>
                  </div>
                  <div class="bg-[#F5F5F5] px-4 py-3 rounded-lg border border-[#A3A3A3] text-center">
                    <span class="font-bold text-sm text-[#1E3A34]">AMEX</span>
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
  }, 4000)
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

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>