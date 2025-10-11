<!-- ProductDetailsView.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const producto = ref(null);
const loading = ref(true);
const selectedImage = ref(0);
const selectedColor = ref(0);
const selectedSize = ref('S');
const quantity = ref(1);
const activeTab = ref('description');
const imageError = ref(false);

// Imágenes del producto (en un caso real vendrían del backend)
const productImages = computed(() => {
  if (!producto.value) return [];
  // Si el producto tiene múltiples imágenes, las usamos, si no, repetimos la principal
  return producto.value.imagenes ? 
    [producto.value.imagenes, producto.value.imagenes, producto.value.imagenes] : 
    ['/placeholder-product.jpg'];
});

const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

onMounted(async () => {
  await cargarProducto();
});

const cargarProducto = async () => {
  try {
    loading.value = true;
    const productId = route.params.id;
    
    const res = await fetch(`http://localhost:4000/api/productos/${productId}`);
    const data = await res.json();
    
    if (data.success) {
      producto.value = {
        ...data.producto,
        _id: data.producto._id || data.producto.id,
        imagenes: data.producto.imagenes || '/placeholder-product.jpg',
        precio: parseFloat(data.producto.precio) || 0,
        categoria: data.producto.categoria || 'Sin categoría',
        rating: data.producto.rating || Math.floor(Math.random() * 2) + 4,
        descuento: data.producto.descuento || 0,
        nuevo: data.producto.nuevo || false,
        descripcion: data.producto.descripcion || 'Este es un producto de alta calidad diseñado para aventureros outdoor. Fabricado con materiales resistentes y duraderos.',
        caracteristicas: data.producto.caracteristicas || [
          'Material resistente al agua',
          'Protección UV 50+',
          'Secado rápido',
          'Costuras reforzadas',
          'Bolsillos funcionales',
          'Ajuste ergonómico'
        ],
        stock: data.producto.stock || 10
      };
    } else {
      console.error("Error al cargar producto:", data.message);
      router.push('/productos');
    }
  } catch (error) {
    console.error("Error al cargar el producto", error);
    router.push('/productos');
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  if (quantity.value < producto.value.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    if (cartStore.addToCart) {
      await cartStore.addToCart(producto.value._id, quantity.value);
    } else {
      const response = await fetch('http://localhost:4000/api/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({
          productoId: producto.value._id,
          cantidad: quantity.value
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al agregar al carrito');
      }
    }
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = `${quantity.value} producto(s) agregado(s) al carrito`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito: ' + error.message);
  }
};

const handleImageError = () => {
  imageError.value = true;
};

const goBack = () => {
  router.push('/productos');
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Breadcrumb -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-600 hover:text-[#1E3A34] transition-colors">
            Inicio
          </router-link>
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <router-link to="/productos" class="text-gray-600 hover:text-[#1E3A34] transition-colors">
            Productos
          </router-link>
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-[#1E3A34] font-semibold" v-if="producto">{{ producto.nombre }}</span>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D8C69E] border-t-[#1E3A34]"></div>
      <p class="mt-4 text-gray-600 font-medium">Cargando producto...</p>
    </div>

    <!-- Product Details -->
    <div v-else-if="producto" class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Images Gallery -->
        <div>
          <!-- Main Image -->
          <div class="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 group">
            <img
              :src="productImages[selectedImage]"
              :alt="producto.nombre"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              v-if="!imageError"
              @error="handleImageError"
            />
            <div 
              v-else
              class="w-full h-full bg-[#D8C69E] flex items-center justify-center"
            >
              <span class="text-gray-600 text-lg">Sin imagen</span>
            </div>
            
            <!-- Badges -->
            <div class="absolute top-6 left-6 flex flex-col space-y-2">
              <span 
                v-if="producto.nuevo"
                class="bg-[#1E3A34] text-white text-sm px-4 py-2 font-bold rounded-lg shadow-lg"
              >
                NUEVO
              </span>
              <span 
                v-if="producto.descuento"
                class="bg-[#E57C23] text-white text-sm px-4 py-2 font-bold rounded-lg shadow-lg"
              >
                -{{ producto.descuento }}% OFF
              </span>
            </div>

            <!-- Navigation Arrows -->
            <button 
              v-if="productImages.length > 1"
              @click="selectedImage = selectedImage > 0 ? selectedImage - 1 : productImages.length - 1"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <svg class="h-6 w-6 text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              v-if="productImages.length > 1"
              @click="selectedImage = selectedImage < productImages.length - 1 ? selectedImage + 1 : 0"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <svg class="h-6 w-6 text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Thumbnail Images -->
          <div class="grid grid-cols-4 gap-4" v-if="productImages.length > 1">
            <button
              v-for="(image, index) in productImages"
              :key="index"
              @click="selectedImage = index"
              :class="{
                'aspect-square rounded-lg overflow-hidden border-2 transition-all': true,
                'border-[#1E3A34] ring-2 ring-[#1E3A34] ring-offset-2': selectedImage === index,
                'border-gray-200 hover:border-[#D8C69E]': selectedImage !== index
              }"
            >
              <img :src="image" :alt="`Vista ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <div class="mb-4">
            <span class="inline-block bg-[#D8C69E] text-[#1E3A34] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {{ producto.categoria }}
            </span>
          </div>

          <h1 class="text-4xl font-black text-[#1E3A34] mb-4 tracking-tight uppercase">
            {{ producto.nombre }}
          </h1>

          <!-- Rating -->
          <div class="flex items-center mb-6">
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm text-gray-600 ml-2 font-medium">
              {{ producto.rating }} ({{ Math.floor(Math.random() * 200) + 10 }} reseñas)
            </span>
          </div>

          <!-- Price -->
          <div class="flex items-baseline mb-6 pb-6 border-b border-gray-200">
            <span class="text-5xl font-black text-[#1E3A34]">${{ producto.precio.toFixed(2) }}</span>
            <span v-if="producto.precioOriginal" class="text-2xl text-gray-400 line-through ml-4">
              ${{ producto.precioOriginal.toFixed(2) }}
            </span>
            <span v-if="producto.descuento" class="ml-4 bg-[#E57C23] text-white text-sm font-bold px-3 py-1 rounded-full">
              Ahorras {{ producto.descuento }}%
            </span>
          </div>

          <!-- Shop Pay -->
          <p class="text-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-lg">
            💳 Paga en 2 cuotas sin interés de <strong>${{ (producto.precio / 2).toFixed(2) }}</strong> con 
            <span class="font-bold text-[#5A31F4]">shop</span><span class="font-bold">Pay</span>
            <a href="#" class="underline ml-1 text-[#1E3A34]">Más información</a>
          </p>

          <!-- Color Selection -->
          <div class="mb-8">
            <label class="block text-sm font-bold text-[#1E3A34] mb-3 uppercase tracking-wide">
              Color: <span class="font-normal text-gray-600">Grisaille</span>
            </label>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="(color, index) in 9" 
                :key="'color-' + index"
                @click="selectedColor = index"
                :class="{
                  'w-16 h-16 rounded-lg border-2 transition-all hover:scale-110': true,
                  'border-[#1E3A34] ring-2 ring-[#1E3A34] ring-offset-2': selectedColor === index,
                  'border-gray-300': selectedColor !== index
                }"
              >
                <img 
                  :src="producto.imagenes" 
                  :alt="'Color ' + (index + 1)"
                  class="w-full h-full object-cover rounded"
                />
              </button>
            </div>
          </div>

          <!-- Size Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-bold text-[#1E3A34] uppercase tracking-wide">
                Talla: <span class="font-normal text-gray-600">{{ selectedSize }}</span>
              </label>
              <button class="text-sm text-[#1E3A34] underline hover:no-underline font-medium">
                Guía de tallas
              </button>
            </div>
            <div class="grid grid-cols-6 gap-3">
              <button
                v-for="size in sizes"
                :key="size"
                @click="selectedSize = size"
                :class="{
                  'px-4 py-3 rounded-lg text-sm font-bold border-2 transition-all hover:scale-105': true,
                  'bg-[#1E3A34] text-white border-[#1E3A34]': selectedSize === size,
                  'bg-white text-[#1E3A34] border-gray-300 hover:border-[#1E3A34]': selectedSize !== size
                }"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Stock -->
          <div class="mb-8">
            <div class="flex items-center space-x-2">
              <div :class="{
                'w-3 h-3 rounded-full': true,
                'bg-green-500': producto.stock > 10,
                'bg-yellow-500': producto.stock > 0 && producto.stock <= 10,
                'bg-red-500': producto.stock === 0
              }"></div>
              <span class="text-sm font-medium text-gray-700">
                <span v-if="producto.stock > 10">En stock</span>
                <span v-else-if="producto.stock > 0">Solo quedan {{ producto.stock }} unidades</span>
                <span v-else class="text-red-600">Agotado</span>
              </span>
            </div>
          </div>

          <!-- Quantity and Add to Cart -->
          <div class="flex space-x-4 mb-6">
            <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              <button 
                @click="decreaseQuantity"
                class="px-5 py-4 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <input 
                type="text" 
                v-model="quantity"
                class="w-20 text-center border-x-2 border-gray-300 py-4 focus:outline-none font-bold text-lg"
                readonly
              />
              <button 
                @click="increaseQuantity"
                class="px-5 py-4 hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            <button 
              @click="addToCart"
              :disabled="producto.stock === 0"
              :class="{
                'flex-1 rounded-lg py-4 px-8 font-bold text-lg uppercase tracking-wider transition-all transform hover:scale-105': true,
                'bg-[#1E3A34] text-white hover:bg-[#4F7C63] shadow-lg': producto.stock > 0,
                'bg-gray-300 text-gray-500 cursor-not-allowed': producto.stock === 0
              }"
            >
              <span v-if="producto.stock > 0">Agregar al carrito</span>
              <span v-else>Agotado</span>
            </button>
          </div>

          <!-- Buy Now -->
          <button 
            class="w-full bg-[#5A31F4] text-white rounded-lg py-4 px-8 font-bold text-lg hover:bg-[#4A28D4] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
            :disabled="producto.stock === 0"
          >
            Comprar ahora
          </button>

          <!-- Additional Info -->
          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div class="text-center">
              <svg class="h-8 w-8 mx-auto text-[#1E3A34] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <p class="text-xs font-semibold text-gray-700">Envío gratis</p>
              <p class="text-xs text-gray-500">En pedidos +$50</p>
            </div>
            <div class="text-center">
              <svg class="h-8 w-8 mx-auto text-[#1E3A34] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs font-semibold text-gray-700">Garantía</p>
              <p class="text-xs text-gray-500">1 año</p>
            </div>
            <div class="text-center">
              <svg class="h-8 w-8 mx-auto text-[#1E3A34] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p class="text-xs font-semibold text-gray-700">Devolución</p>
              <p class="text-xs text-gray-500">30 días</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="mt-20">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              @click="activeTab = 'description'"
              :class="{
                'py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-colors': true,
                'border-[#1E3A34] text-[#1E3A34]': activeTab === 'description',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'description'
              }"
            >
              Descripción
            </button>
            <button
              @click="activeTab = 'features'"
              :class="{
                'py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-colors': true,
                'border-[#1E3A34] text-[#1E3A34]': activeTab === 'features',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'features'
              }"
            >
              Características
            </button>
            <button
              @click="activeTab = 'shipping'"
              :class="{
                'py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-colors': true,
                'border-[#1E3A34] text-[#1E3A34]': activeTab === 'shipping',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'shipping'
              }"
            >
              Envío
            </button>
          </nav>
        </div>

        <div class="py-8">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose prose-lg max-w-none">
            <p class="text-gray-700 leading-relaxed">
              {{ producto.descripcion }}
            </p>
            <p class="text-gray-700 leading-relaxed mt-4">
              Perfecto para tus aventuras outdoor, este producto combina funcionalidad y estilo. 
              Diseñado con materiales de primera calidad que garantizan durabilidad y comodidad en cualquier condición.
            </p>
          </div>

          <!-- Features Tab -->
          <div v-if="activeTab === 'features'">
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li 
                v-for="(feature, index) in producto.caracteristicas" 
                :key="index"
                class="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
              >
                <svg class="h-6 w-6 text-[#4F7C63] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-700 font-medium">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Shipping Tab -->
          <div v-if="activeTab === 'shipping'" class="space-y-6">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-bold text-[#1E3A34] mb-3 text-lg">🚚 Envío estándar</h3>
              <p class="text-gray-700">Entrega en 5-7 días hábiles. Gratis en pedidos superiores a $50.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-bold text-[#1E3A34] mb-3 text-lg">⚡ Envío express</h3>
              <p class="text-gray-700">Entrega en 2-3 días hábiles. Costo adicional de $15.</p>
            </div>
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="font-bold text-[#1E3A34] mb-3 text-lg">🔄 Política de devolución</h3>
              <p class="text-gray-700">Devoluciones gratuitas dentro de los 30 días posteriores a la compra.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-12 text-center">
        <button 
          @click="goBack"
          class="inline-flex items-center space-x-2 text-[#1E3A34] font-semibold hover:text-[#4F7C63] transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver a productos</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones suaves */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container > div {
  animation: fadeIn 0.6s ease-out;
}
</style>