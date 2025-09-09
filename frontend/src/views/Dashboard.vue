<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const productos = ref([]);
const imageError = ref({});
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const sortOption = ref('Recomendados');
const activeCategory = ref('Todos');
const priceRange = ref([0, 1000]);
const loading = ref(false);
const mobileFiltersOpen = ref(false);

const categories = ref([
  'Todos',
  'Ropa',
  'Accesorios',
  'Hogar',
  'Ofertas',
  'Nuevos'
]);

onMounted(async () => {
  try {
    loading.value = true;
    const res = await fetch("http://localhost:4000/productos");
    const data = await res.json();
    productos.value = data.map(p => ({
      ...p,
      categoria: p.categoria || ['Ropa', 'Accesorios', 'Hogar'][Math.floor(Math.random() * 3)],
      rating: p.rating || Math.floor(Math.random() * 5) + 1
    }));
  } catch (error) {
    console.error("Error al cargar los productos", error);
  } finally {
    loading.value = false;
  }
});

const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(producto => 
      producto.nombre.toLowerCase().includes(query) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );
  }
  
  if (activeCategory.value !== 'Todos') {
    result = result.filter(producto => {
      if (activeCategory.value === 'Ofertas') {
        return producto.descuento > 0;
      } else if (activeCategory.value === 'Nuevos') {
        return producto.nuevo;
      }
      return producto.categoria === activeCategory.value;
    });
  }
  
  result = result.filter(producto => 
    producto.precio >= priceRange.value[0] && 
    producto.precio <= priceRange.value[1]
  );
  
  switch (sortOption.value) {
    case 'Precio: menor a mayor':
      result.sort((a, b) => a.precio - b.precio);
      break;
    case 'Precio: mayor a menor':
      result.sort((a, b) => b.precio - a.precio);
      break;
    case 'Más nuevos':
      result.sort((a, b) => new Date(b.fechaCreacion || new Date()) - new Date(a.fechaCreacion || new Date()));
      break;
    case 'Mejor valorados':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      break;
  }
  
  return result;
});

const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const addToCart = async (productoId) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    await cartStore.addToCart(productoId);
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Producto agregado al carrito';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito');
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  activeCategory.value = 'Todos';
  priceRange.value = [0, 1000];
  sortOption.value = 'Recomendados';
};

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category) => {
  activeCategory.value = category;
};

const toggleMobileFilters = () => {
  mobileFiltersOpen.value = !mobileFiltersOpen.value;
};
</script>

<template>
  <!-- Filtros móviles -->
  <div 
    class="fixed inset-0 z-50 md:hidden"
    v-show="mobileFiltersOpen"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="mobileFiltersOpen = false"></div>

      <div class="inline-block align-bottom bg-white rounded-t-lg px-6 pt-6 pb-4 text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">Filtros</h3>
            <button @click="mobileFiltersOpen = false" class="text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Búsqueda móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">Buscar</label>
            <div class="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Buscar productos..." 
                class="bg-transparent border-none focus:outline-none text-sm ml-3 w-full"
              >
            </div>
          </div>
          
          <!-- Categorías móviles -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">Categorías</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="category in categories"
                :key="'mobile-' + category"
                @click="activeCategory = category"
                :class="{
                  'px-4 py-2 rounded-lg text-sm font-medium': true,
                  'bg-black text-white': activeCategory === category,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200': activeCategory !== category
                }"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Rango de precio móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">Precio</label>
            <div class="px-2">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>${{ priceRange[0] }}</span>
                <span>${{ priceRange[1] }}</span>
              </div>
              <div class="flex space-x-4">
                <input 
                  type="range" 
                  v-model="priceRange[0]" 
                  :min="0" 
                  :max="1000" 
                  step="10"
                  class="w-full accent-black"
                >
                <input 
                  type="range" 
                  v-model="priceRange[1]" 
                  :min="0" 
                  :max="1000" 
                  step="10"
                  class="w-full accent-black"
                >
              </div>
            </div>
          </div>
          
          <!-- Ordenamiento móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-900 mb-2">Ordenar por</label>
            <select 
              v-model="sortOption"
              class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>Recomendados</option>
              <option>Más nuevos</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mejor valorados</option>
            </select>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="resetFilters"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpiar
          </button>
          <button
            @click="mobileFiltersOpen = false"
            class="flex-1 bg-black text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Hero Section -->
  <section class="bg-gray-900 text-white">
    <div class="h-96 flex items-center justify-center">
      <div class="text-center px-4 max-w-4xl">
        <h1 class="text-5xl md:text-6xl font-black mb-6 tracking-tight">NUEVA COLECCIÓN</h1>
        <p class="text-xl mb-8 text-gray-300">Hasta 70% de descuento en seleccionados</p>
        <router-link 
          to="/productos"
          class="inline-block bg-white text-black font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
        >
          Comprar ahora
        </router-link>
      </div>
    </div>
    
    <div class="container mx-auto px-4 -mt-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white text-black p-6 text-center">
          <div class="text-gray-900 mb-3">
            <svg class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h3 class="font-bold text-sm">ENVÍO GRATIS</h3>
          <p class="text-xs text-gray-600">En pedidos +$50</p>
        </div>
        <div class="bg-white text-black p-6 text-center">
          <div class="text-gray-900 mb-3">
            <svg class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-sm">GARANTÍA</h3>
          <p class="text-xs text-gray-600">30 días devolución</p>
        </div>
        <div class="bg-white text-black p-6 text-center">
          <div class="text-gray-900 mb-3">
            <svg class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="font-bold text-sm">PAGO SEGURO</h3>
          <p class="text-xs text-gray-600">100% protegido</p>
        </div>
        <div class="bg-white text-black p-6 text-center">
          <div class="text-gray-900 mb-3">
            <svg class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-sm">SOPORTE 24/7</h3>
          <p class="text-xs text-gray-600">Atención personalizada</p>
        </div>
      </div>
    </div>
  </section>

  <main class="py-12 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 class="text-3xl font-black text-gray-900 mb-4 md:mb-0 tracking-tight">PRODUCTOS</h2>
        <div class="flex items-center space-x-6">
          <!-- Filtro de precio desktop -->
          <div class="hidden md:flex items-center">
            <span class="text-sm font-semibold text-gray-900 mr-3">Precio:</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium">${{ priceRange[0] }}</span>
              <input 
                type="range" 
                v-model="priceRange[0]" 
                :min="0" 
                :max="priceRange[1]" 
                step="10"
                class="w-24 accent-black"
              >
              <span class="text-sm">-</span>
              <input 
                type="range" 
                v-model="priceRange[1]" 
                :min="priceRange[0]" 
                :max="1000" 
                step="10"
                class="w-24 accent-black"
              >
              <span class="text-sm font-medium">${{ priceRange[1] }}</span>
            </div>
          </div>
          
          <!-- Botón filtros móvil -->
          <button 
            @click="mobileFiltersOpen = true"
            class="md:hidden flex items-center text-sm font-semibold text-gray-900 border border-gray-300 px-4 py-2 rounded-lg"
          >
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
          
          <!-- Selector ordenamiento -->
          <div class="flex items-center">
            <span class="text-sm font-semibold text-gray-900 mr-3">Ordenar:</span>
            <select 
              v-model="sortOption"
              class="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>Recomendados</option>
              <option>Más nuevos</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mejor valorados</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
        <p class="mt-4 text-gray-600 font-medium">Cargando productos...</p>
      </div>
      
      <!-- Productos -->
      <div v-else>
        <!-- Contador y filtros -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-sm font-medium text-gray-600">
            {{ filteredProducts.length }} de {{ productos.length }} productos
          </p>
          <button 
            @click="resetFilters"
            v-if="searchQuery || activeCategory !== 'Todos' || priceRange[0] > 0 || priceRange[1] < 1000 || sortOption !== 'Recomendados'"
            class="text-sm font-semibold text-gray-900 underline hover:no-underline"
          >
            Limpiar filtros
          </button>
        </div>
        
        <div v-if="filteredProducts.length === 0" class="text-center py-20">
          <svg class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Sin resultados</h3>
          <p class="text-gray-600 mb-6">Intenta ajustar tus filtros</p>
          <button 
            @click="resetFilters"
            class="bg-black text-white px-6 py-3 font-semibold text-sm hover:bg-gray-800"
          >
            Mostrar todos
          </button>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="producto in filteredProducts"
            :key="producto._id"
            class="bg-white border border-gray-200 overflow-hidden group"
          >
            <div class="relative aspect-square overflow-hidden bg-gray-50">
              <img
                :src="producto.imagenes"
                :alt="producto.nombre"
                @error="handleImageError(producto._id)"
                class="w-full h-full object-cover"
                v-if="!imageError[producto._id]"
              />
              <div 
                v-else
                class="w-full h-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-gray-500 text-sm">Sin imagen</span>
              </div>
              
              <button 
                @click="addToCart(producto._id)"
                class="absolute bottom-3 right-3 bg-black text-white w-10 h-10 flex items-center justify-center hover:bg-gray-800"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <div class="absolute top-3 left-3 flex flex-col space-y-2">
                <span 
                  v-if="producto.nuevo"
                  class="bg-black text-white text-xs px-2 py-1 font-bold"
                >
                  NUEVO
                </span>
                <span 
                  v-if="producto.descuento"
                  class="bg-red-600 text-white text-xs px-2 py-1 font-bold"
                >
                  -{{ producto.descuento }}%
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="font-bold text-sm text-gray-900 mb-1 uppercase tracking-wide truncate">{{ producto.nombre }}</h3>
              <p class="text-xs text-gray-500 mb-3 uppercase">{{ producto.categoria }}</p>

              <div class="flex items-center mb-2">
                <span class="text-lg font-black text-gray-900">${{ producto.precio.toFixed(2) }}</span>
                <span v-if="producto.precioOriginal" class="text-sm text-gray-400 line-through ml-2">${{ producto.precioOriginal.toFixed(2) }}</span>
              </div>

              <div class="flex items-center">
                <div class="flex text-gray-400">
                  <svg v-for="i in 5" :key="i" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 ml-1 font-medium">({{ producto.rating || 0 }})</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <button class="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors">
            Cargar más
          </button>
        </div>
      </div>
    </div>
  </main>
  
  <!-- Newsletter -->
  <section class="py-16 bg-gray-900 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-black mb-4 tracking-tight">ÚNETE A LA COMUNIDAD</h2>
      <p class="text-gray-300 mb-8 max-w-2xl mx-auto">10% de descuento en tu primera compra</p>
      <div class="flex max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Email" 
          class="px-4 py-4 w-full bg-white text-black focus:outline-none font-medium"
        >
        <button class="bg-black border-2 border-black text-white px-8 py-4 font-bold hover:bg-white hover:text-black transition-colors">
          SUSCRIBIR
        </button>
      </div>
    </div>
  </section>
</template>