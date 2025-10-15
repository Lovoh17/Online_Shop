<template>
  <div class="min-h-screen bg-[#FFFFFF]">
    <!-- Imagen Flotante -->
    <transition name="floating">
      <div 
        v-if="showFloatingLogo"
        class="floating-logo"
        :style="floatingLogoStyle"
      >
        <div class="w-24 h-24 bg-[#1E3A34] shadow-2xl flex items-center justify-center">
          <svg class="w-12 h-12 text-[#C2B280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
      </div>
    </transition>

    <!-- Notificación -->
    <div 
      v-if="notification.show"
      :class="{
        'bg-[#4F7C63] text-white': notification.type === 'success',
        'bg-[#E57C23] text-white': notification.type === 'error'
      }"
      class="fixed top-0 right-0 z-50 px-8 py-4 shadow-lg transition-all duration-300"
    >
      <div class="flex items-center space-x-3">
        <svg v-if="notification.type === 'success'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-bold uppercase tracking-wider">{{ notification.message }}</span>
      </div>
    </div>

    <main class="max-w-6xl mx-auto px-6 py-16">
      <!-- Header -->
      <div class="bg-white shadow-lg p-10 mb-10 border-l-8 border-[#1E3A34]">
        <div class="flex items-center space-x-6 mb-10">
          <div class="w-16 h-16 bg-[#1E3A34] flex items-center justify-center">
            <svg class="w-8 h-8 text-[#C2B280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-black text-[#1E3A34] tracking-tight uppercase">Proceso de Pago</h1>
            <p class="text-[#5E5E5E] mt-2 font-bold text-lg">Paso {{ step }} de 4</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-4">
          <div class="flex justify-between text-sm font-black tracking-widest">
            <span :class="step >= 1 ? 'text-[#1E3A34]' : 'text-[#5E5E5E]'">RESUMEN</span>
            <span :class="step >= 2 ? 'text-[#1E3A34]' : 'text-[#5E5E5E]'">PAGO</span>
            <span :class="step >= 3 ? 'text-[#1E3A34]' : 'text-[#5E5E5E]'">CONFIRMAR</span>
            <span :class="step >= 4 ? 'text-[#1E3A34]' : 'text-[#5E5E5E]'">FINALIZAR</span>
          </div>
          <div class="h-1 bg-[#E5E5E5]">
            <div 
              class="h-full bg-[#1E3A34] transition-all duration-500 ease-out"
              :style="{ width: `${(step / 4) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && step === 1" class="bg-white shadow-lg p-20 text-center">
        <div class="relative w-24 h-24 mx-auto mb-8">
          <div class="absolute inset-0 border-4 border-[#E5E5E5] animate-spin"></div>
          <div class="absolute inset-2 border-4 border-t-[#1E3A34] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p class="text-[#5E5E5E] font-bold text-xl uppercase tracking-wide">Cargando datos del pago...</p>
      </div>

      <!-- Step 1: Resumen -->
      <div v-else-if="step === 1" class="space-y-8">
        <div class="bg-white shadow-lg border-l-8 border-[#C2B280]">
          <div class="bg-[#F8F5F0] px-10 py-6 border-b-2 border-[#E5E5E5]">
            <h2 class="text-3xl font-black text-[#1E3A34] tracking-tight uppercase">Resumen de tu Compra</h2>
          </div>
          
          <div class="divide-y-2 divide-[#E5E5E5]">
            <div v-for="item in orderData?.items || []" :key="item.producto._id" class="p-8 hover:bg-[#F8F5F0] transition-colors duration-200">
              <div class="flex items-center space-x-8">
                <div class="w-28 h-28 bg-[#E5E5E5] flex-shrink-0">
                  <img :src="item.producto.imagen" :alt="item.producto.nombre" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                  <h3 class="font-black text-xl text-[#1E3A34] mb-2 uppercase">{{ item.producto.nombre }}</h3>
                  <p class="text-[#5E5E5E] font-bold text-lg">{{ item.cantidad }} × ${{ item.producto.precio.toFixed(2) }}</p>
                </div>
                <p class="font-black text-3xl text-[#1E3A34]">${{ (item.producto.precio * item.cantidad).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-[#1E3A34] px-10 py-8">
            <div class="flex justify-between items-center">
              <span class="text-2xl font-black text-white uppercase tracking-widest">Total</span>
              <span class="text-4xl font-black text-[#C2B280]">${{ orderData?.total?.toFixed(2) || '0.00' }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <button @click="cancelPayment" class="flex-1 bg-white text-[#5E5E5E] py-5 px-8 font-black uppercase tracking-widest hover:bg-[#F8F5F0] hover:text-[#1E3A34] transition-colors duration-200 shadow-lg border-2 border-[#E5E5E5]">
            Cancelar
          </button>
          <button @click="step = 2" class="flex-1 bg-[#1E3A34] text-white py-5 px-8 font-black uppercase tracking-widest hover:bg-[#4F7C63] transition-colors duration-200 shadow-lg">
            Continuar al Pago
          </button>
        </div>
      </div>

      <!-- Step 2: Datos de pago -->
      <div v-if="step === 2" class="space-y-8">
        <div class="bg-white shadow-lg border-l-8 border-[#E57C23]">
          <div class="bg-[#F8F5F0] px-10 py-6 border-b-2 border-[#E5E5E5]">
            <h2 class="text-3xl font-black text-[#1E3A34] tracking-tight uppercase">Método de Pago</h2>
          </div>
          
          <div class="p-10">
            <div class="bg-[#F8F5F0] p-10 border-l-4 border-[#1E3A34]">
              <h3 class="font-black text-2xl text-[#1E3A34] mb-8 uppercase tracking-wider">Datos de la Tarjeta</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-black text-[#1E3A34] mb-3 uppercase tracking-widest">Número de Tarjeta</label>
                  <input 
                    v-model="cardData.numero" 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    @input="formatCardNumber"
                    maxlength="19"
                    class="w-full border-2 border-[#E5E5E5] px-5 py-4 focus:outline-none focus:border-[#1E3A34] bg-white transition-colors font-semibold"
                  >
                  <div v-if="cardErrors.numero" class="text-sm font-bold text-[#E57C23] mt-3 uppercase tracking-wide">{{ cardErrors.numero }}</div>
                </div>
                
                <div>
                  <label class="block text-sm font-black text-[#1E3A34] mb-3 uppercase tracking-widest">Nombre en la Tarjeta</label>
                  <input 
                    v-model="cardData.nombre" 
                    type="text" 
                    placeholder="Como aparece en la tarjeta"
                    class="w-full border-2 border-[#E5E5E5] px-5 py-4 focus:outline-none focus:border-[#1E3A34] bg-white transition-colors font-semibold"
                  >
                  <div v-if="cardErrors.nombre" class="text-sm font-bold text-[#E57C23] mt-3 uppercase tracking-wide">{{ cardErrors.nombre }}</div>
                </div>
                
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-black text-[#1E3A34] mb-3 uppercase tracking-widest">Expiración</label>
                    <input 
                      v-model="cardData.expiracion" 
                      type="text" 
                      placeholder="MM/AA" 
                      @input="formatExpiry"
                      maxlength="5"
                      class="w-full border-2 border-[#E5E5E5] px-5 py-4 focus:outline-none focus:border-[#1E3A34] bg-white transition-colors font-semibold"
                    >
                    <div v-if="cardErrors.expiracion" class="text-sm font-bold text-[#E57C23] mt-3 uppercase tracking-wide">{{ cardErrors.expiracion }}</div>
                  </div>
                  <div>
                    <label class="block text-sm font-black text-[#1E3A34] mb-3 uppercase tracking-widest">CVV</label>
                    <input 
                      v-model="cardData.cvv" 
                      type="password" 
                      placeholder="123" 
                      maxlength="4"
                      class="w-full border-2 border-[#E5E5E5] px-5 py-4 focus:outline-none focus:border-[#1E3A34] bg-white transition-colors font-semibold"
                    >
                    <div v-if="cardErrors.cvv" class="text-sm font-bold text-[#E57C23] mt-3 uppercase tracking-wide">{{ cardErrors.cvv }}</div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-black text-[#1E3A34] mb-3 uppercase tracking-widest">Dirección de Envío</label>
                  <textarea 
                    v-model="direccionEnvio" 
                    placeholder="Ingresa tu dirección completa"
                    rows="4"
                    class="w-full border-2 border-[#E5E5E5] px-5 py-4 focus:outline-none focus:border-[#1E3A34] bg-white transition-colors resize-none font-semibold"
                  ></textarea>
                  <div v-if="!direccionEnvio && showAddressError" class="text-sm font-bold text-[#E57C23] mt-3 uppercase tracking-wide">La dirección de envío es requerida</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <button @click="step = 1" class="flex-1 bg-white text-[#5E5E5E] py-5 px-8 font-black uppercase tracking-widest hover:bg-[#F8F5F0] hover:text-[#1E3A34] transition-colors duration-200 shadow-lg border-2 border-[#E5E5E5]">
            Volver
          </button>
          <button @click="validateAndContinue" class="flex-1 bg-[#1E3A34] text-white py-5 px-8 font-black uppercase tracking-widest hover:bg-[#4F7C63] transition-colors duration-200 shadow-lg">
            Continuar
          </button>
        </div>
      </div>

      <!-- Step 3: Confirmación -->
      <div v-if="step === 3" class="space-y-8">
        <div class="bg-white shadow-lg border-l-8 border-[#4F7C63]">
          <div class="bg-[#F8F5F0] px-10 py-6 border-b-2 border-[#E5E5E5]">
            <h2 class="text-3xl font-black text-[#1E3A34] tracking-tight uppercase">Confirma tu Pago</h2>
          </div>
          
          <div class="p-10 space-y-6">
            <div class="bg-[#F8F5F0] p-8 border-l-4 border-[#C2B280]">
              <h4 class="font-black text-xl text-[#1E3A34] mb-4 uppercase tracking-wider">Resumen de la Compra</h4>
              <p class="text-[#5E5E5E] mb-3 font-bold text-lg">{{ orderData?.items?.length || 0 }} productos</p>
              <p class="font-black text-3xl text-[#1E3A34]">TOTAL: ${{ orderData?.total?.toFixed(2) || '0.00' }}</p>
            </div>
            
            <div class="bg-[#F8F5F0] p-8 border-l-4 border-[#E57C23]">
              <h4 class="font-black text-xl text-[#1E3A34] mb-4 uppercase tracking-wider">Método de Pago</h4>
              <p class="text-[#5E5E5E] font-bold text-lg mb-2">**** **** **** {{ getLastFourDigits(cardData.numero) }}</p>
              <p class="text-[#5E5E5E] font-bold text-lg">{{ cardData.nombre }}</p>
            </div>

            <div class="bg-[#F8F5F0] p-8 border-l-4 border-[#7CAFBF]">
              <h4 class="font-black text-xl text-[#1E3A34] mb-4 uppercase tracking-wider">Dirección de Envío</h4>
              <p class="text-[#5E5E5E] font-bold text-lg">{{ direccionEnvio || orderData?.usuario?.direccion || 'No especificada' }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-6">
          <button @click="step = 2" class="flex-1 bg-white text-[#5E5E5E] py-5 px-8 font-black uppercase tracking-widest hover:bg-[#F8F5F0] hover:text-[#1E3A34] transition-colors duration-200 shadow-lg border-2 border-[#E5E5E5]">
            Cambiar Datos
          </button>
          <button 
            @click="processPayment" 
            :disabled="isProcessing"
            :class="{
              'bg-[#1E3A34] hover:bg-[#4F7C63]': !isProcessing,
              'bg-[#5E5E5E] cursor-not-allowed': isProcessing
            }"
            class="flex-1 text-white py-5 px-8 font-black uppercase tracking-widest transition-colors duration-200 shadow-lg"
          >
            {{ isProcessing ? 'PROCESANDO...' : 'PAGAR AHORA' }}
          </button>
        </div>
      </div>

      <!-- Step 4: Resultado -->
      <div v-if="step === 4" class="bg-white shadow-lg">
        <!-- Processing -->
        <div v-if="paymentStatus === 'processing'" class="p-20 text-center">
          <div class="relative w-28 h-28 mx-auto mb-10">
            <div class="absolute inset-0 border-4 border-[#E5E5E5] animate-spin"></div>
            <div class="absolute inset-2 border-4 border-t-[#1E3A34] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p class="text-[#1E3A34] font-black text-3xl mb-3 uppercase tracking-tight">Procesando tu pago...</p>
          <p class="text-[#5E5E5E] font-bold text-lg uppercase tracking-wide">No cierres esta ventana</p>
        </div>
        
        <!-- Success -->
        <div v-if="paymentStatus === 'success'" class="p-20 text-center">
          <div class="w-28 h-28 bg-[#4F7C63] flex items-center justify-center mx-auto mb-10 shadow-lg">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-5xl font-black text-[#1E3A34] mb-8 uppercase tracking-tight">Pago Aprobado</h2>
          
          <div class="bg-[#F8F5F0] p-6 mb-8 border-l-4 border-[#4F7C63]">
            <p class="text-base text-[#5E5E5E] flex items-center justify-center font-bold">
              <svg class="w-6 h-6 inline-block mr-3 text-[#1E3A34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span v-if="emailSent">Hemos enviado tu factura a: <span class="font-black text-[#1E3A34]">{{ orderData?.usuario?.email }}</span></span>
              <span v-else class="text-[#E57C23] font-black">No se pudo enviar el correo automáticamente. Por favor contacta soporte.</span>
            </p>
          </div>
          
          <div class="bg-[#F8F5F0] p-10 text-left border-l-4 border-[#C2B280] mb-10">
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b-2 border-[#E5E5E5]">
                <span class="font-black text-[#1E3A34] uppercase tracking-widest text-lg">Referencia:</span>
                <span class="text-[#5E5E5E] font-mono font-bold text-lg">{{ paymentResult.referencia }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b-2 border-[#E5E5E5]">
                <span class="font-black text-[#1E3A34] uppercase tracking-widest text-lg">Fecha:</span>
                <span class="text-[#5E5E5E] font-bold text-lg">{{ new Date().toLocaleDateString() }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b-2 border-[#E5E5E5]">
                <span class="font-black text-[#1E3A34] uppercase tracking-widest text-lg">Total:</span>
                <span class="text-[#1E3A34] font-black text-2xl">${{ paymentResult.total?.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="font-black text-[#1E3A34] uppercase tracking-widest text-lg">Orden:</span>
                <span class="text-[#5E5E5E] font-mono font-bold text-lg">#{{ paymentResult.ordenId }}</span>
              </div>
            </div>
          </div>
          
          <button @click="finishPayment" class="bg-[#1E3A34] text-white px-14 py-5 font-black uppercase tracking-widest hover:bg-[#4F7C63] transition-colors duration-200 shadow-lg text-lg">
            Continuar Comprando
          </button>
        </div>
        
        <!-- Error -->
        <div v-if="paymentStatus === 'error'" class="p-20 text-center">
          <div class="w-28 h-28 bg-[#E57C23] flex items-center justify-center mx-auto mb-10 shadow-lg">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-5xl font-black text-[#1E3A34] mb-6 uppercase tracking-tight">Pago Rechazado</h2>
          <p class="text-[#E57C23] font-black mb-12 text-xl uppercase tracking-wide">{{ errorMessage }}</p>
          
          <div class="flex gap-6 justify-center">
            <button @click="retryPayment" class="bg-[#1E3A34] text-white px-12 py-5 font-black uppercase tracking-widest hover:bg-[#4F7C63] transition-colors duration-200 shadow-lg">
              Reintentar
            </button>
            <button @click="step = 2" class="bg-white text-[#5E5E5E] px-12 py-5 font-black uppercase tracking-widest hover:bg-[#F8F5F0] hover:text-[#1E3A34] transition-colors duration-200 shadow-lg border-2 border-[#E5E5E5]">
              Cambiar Método
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error && !isLoading" class="bg-white shadow-lg p-20 text-center border-l-8 border-[#E57C23]">
        <div class="w-28 h-28 bg-[#E57C23] bg-opacity-20 flex items-center justify-center mx-auto mb-10">
          <svg class="w-16 h-16 text-[#E57C23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-black text-[#1E3A34] mb-6 uppercase tracking-tight">Error al Cargar</h2>
        <p class="text-[#5E5E5E] mb-10 text-xl font-bold">{{ error }}</p>
        <button @click="cancelPayment" class="bg-white text-[#5E5E5E] px-12 py-5 font-black uppercase tracking-widest hover:bg-[#F8F5F0] hover:text-[#1E3A34] transition-colors duration-200 shadow-lg border-2 border-[#E5E5E5]">
          Volver al Carrito
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

// Logo flotante
const showFloatingLogo = ref(false)
const floatingLogoStyle = ref({})

// Estados reactivos
const step = ref(1)
const paymentStatus = ref(null)
const orderData = ref(null)
const paymentResult = ref(null)
const errorMessage = ref('')
const error = ref('')
const isLoading = ref(false)
const isProcessing = ref(false)
const showAddressError = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })
const emailSent = ref(true)

// Datos de la tarjeta
const cardData = reactive({
  numero: '',
  nombre: '',
  expiracion: '',
  cvv: ''
})

// Errores de validación
const cardErrors = reactive({
  numero: '',
  nombre: '',
  expiracion: '',
  cvv: ''
})

const direccionEnvio = ref('')

// Computed properties
const isCardFormValid = computed(() => {
  const cleanCardNumber = cardData.numero.replace(/\s/g, '')
  return cleanCardNumber.length >= 13 &&
         cardData.nombre.trim().length >= 3 &&
         cardData.expiracion.length === 5 &&
         cardData.cvv.length >= 3 &&
         direccionEnvio.value.trim().length > 0
})

// Métodos
const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
  cardData.numero = value
  validateCardField('numero', value.replace(/\s/g, ''))
}

const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  cardData.expiracion = value
  validateCardField('expiracion', value)
}

const validateCardField = (field, value) => {
  switch (field) {
    case 'numero':
      const cleanNumber = value.replace(/\s/g, '')
      cardErrors.numero = cleanNumber.length >= 13 && cleanNumber.length <= 19 ? '' : 'Número de tarjeta inválido (13-19 dígitos)'
      break
    case 'nombre':
      cardErrors.nombre = value.trim().length >= 3 ? '' : 'Nombre debe tener al menos 3 caracteres'
      break
    case 'expiracion':
      const regex = /^\d{2}\/\d{2}$/
      cardErrors.expiracion = regex.test(value) ? '' : 'Formato MM/AA requerido'
      break
    case 'cvv':
      cardErrors.cvv = value.length >= 3 && value.length <= 4 ? '' : 'CVV debe tener 3-4 dígitos'
      break
  }
}

const getLastFourDigits = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  return cleanNumber.slice(-4)
}

const validateAndContinue = () => {
  // Validar todos los campos
  validateCardField('numero', cardData.numero)
  validateCardField('nombre', cardData.nombre)
  validateCardField('expiracion', cardData.expiracion)
  validateCardField('cvv', cardData.cvv)
  
  // Validar dirección
  showAddressError.value = !direccionEnvio.value.trim()

  // Si no hay errores, continuar
  const hasErrors = Object.values(cardErrors).some(error => error) || showAddressError.value
  if (!hasErrors) {
    step.value = 3
  }
}

const fetchPaymentData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await authStore.authenticatedFetch('http://localhost:4000/api/pago/datos')
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al cargar datos de pago')
    }
    
    const data = await response.json()
    
    orderData.value = data
    
    if (data.productos && data.productos.length > 0) {
      console.log('📦 Productos recibidos:', data.productos)
    }
    
    direccionEnvio.value = data.usuario?.direccion || ''
    
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar datos de pago:', err)
  } finally {
    isLoading.value = false
  }
}

const processPayment = async () => {
  try {
    isProcessing.value = true
    paymentStatus.value = 'processing'
    step.value = 4
    
    console.log('📤 Enviando datos de pago:', {
      carritoId: orderData.value.carritoId,
      direccionEnvio: direccionEnvio.value
    })

    const paymentData = {
      carritoId: orderData.value.carritoId,
      datosTarjeta: {
        numero: cardData.numero.replace(/\s/g, ''),
        nombre: cardData.nombre.trim(),
        expiracion: cardData.expiracion,
        cvv: cardData.cvv
      },
      direccionEnvio: direccionEnvio.value.trim()
    }

    const response = await authStore.authenticatedFetch('http://localhost:4000/api/pago/procesar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al procesar el pago')
    }

    const data = await response.json()
    
    paymentStatus.value = 'success'
    paymentResult.value = data
    
    await cartStore.fetchCart()
    
  } catch (err) {
    paymentStatus.value = 'error'
    errorMessage.value = err.message
    console.error('Error al procesar pago:', err)
  } finally {
    isProcessing.value = false
  }
}

const cancelPayment = () => {
  router.push('/carrito')
}

const retryPayment = () => {
  paymentStatus.value = null
  errorMessage.value = ''
  step.value = 3
  isProcessing.value = false
}

const finishPayment = () => {
  router.push('/')
}

// Watchers para validación en tiempo real
watch(() => cardData.nombre, (value) => {
  validateCardField('nombre', value)
})

watch(() => cardData.cvv, (value) => {
  validateCardField('cvv', value)
})

onMounted(async () => {
  // Logo flotante
  showFloatingLogo.value = true
  floatingLogoStyle.value = {
    left: `${Math.random() * 80 + 10}%`,
    top: '-10%'
  }
  
  setTimeout(() => {
    showFloatingLogo.value = false
  }, 3500)

  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Verificar carrito
  if (!cartStore.items.length) {
    await cartStore.fetchCart()
  }
  
  if (!cartStore.items.length) {
    router.push('/carrito')
    return
  }
  
  await fetchPaymentData()
})
</script>

<style scoped>
/* Animación logo flotante */
.floating-logo {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  animation: floatDown 3.5s ease-out forwards;
}

@keyframes floatDown {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(10vh) rotate(15deg) scale(1);
  }
  50% {
    transform: translateY(50vh) rotate(180deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(120vh) rotate(360deg) scale(0.8);
    opacity: 0;
  }
}

.floating-enter-active {
  animation: floatDown 3.5s ease-out;
}

.floating-leave-active {
  opacity: 0;
  transition: opacity 0.3s;
}

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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.transition-colors {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}
</style>