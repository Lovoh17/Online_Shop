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
      // Agregar categoría aleatoria si no existe (para demostración)
      categoria: p.categoria || ['Ropa', 'Accesorios', 'Hogar'][Math.floor(Math.random() * 3)],
      // Agregar rating aleatorio si no existe (para demostración)
      rating: p.rating || Math.floor(Math.random() * 5) + 1
    }));
  } catch (error) {
    console.error("Error al cargar los productos", error);
  } finally {
    loading.value = false;
  }
});

// Productos filtrados y ordenados
const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(producto => 
      producto.nombre.toLowerCase().includes(query) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );
  }
  
  // Filtro por categoría
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
  
  // Filtro por rango de precio
  result = result.filter(producto => 
    producto.precio >= priceRange.value[0] && 
    producto.precio <= priceRange.value[1]
  );
  
  // Ordenamiento
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
      // Orden por defecto (Recomendados)
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
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up';
    notification.textContent = 'Producto agregado al carrito';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fade-out');
      setTimeout(() => notification.remove(), 300);
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
</script>

<template>
  <header class="bg-white sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-14">
        <div class="flex items-center space-x-6">
          <router-link to="/" class="text-2xl font-bold text-pink-600">Dripp - Shop</router-link>
          <div class="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1 w-64">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Buscar productos..." 
              class="bg-transparent border-none focus:outline-none text-sm ml-2 w-full"
            >
          </div>
        </div>
        
        <nav class="flex items-center space-x-6">
          <router-link 
            to="/" 
            class="hidden md:block text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
            active-class="text-pink-500"
          >
            Inicio
          </router-link>
          <router-link 
            to="/productos" 
            class="hidden md:block text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
            active-class="text-pink-500"
          >
            Productos
          </router-link>
          
          <router-link to="/perfil" class="p-2 text-gray-700 hover:text-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </router-link>
          
          <router-link to="/carrito" class="p-2 text-gray-700 hover:text-pink-500 relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </router-link>
          
          <button 
            @click="mobileFiltersOpen = true"
            class="md:hidden p-2 text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>

      <!-- Menú de categorías para desktop -->
      <div class="hidden md:flex items-center justify-center space-x-6 py-2 border-t border-gray-100">
        <a 
          v-for="category in categories" 
          :key="category"
          href="#" 
          @click.prevent="activeCategory = category"
          :class="{
            'text-sm hover:text-pink-500': true,
            'text-pink-500 font-medium': activeCategory === category,
            'text-gray-700': activeCategory !== category
          }"
        >
          {{ category }}
        </a>
      </div>
    </div>
  </header>
  
  <!-- Filtros móviles (off-canvas) -->
  <div 
    class="fixed inset-0 z-50 overflow-y-auto md:hidden"
    v-show="mobileFiltersOpen"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="mobileFiltersOpen = false"></div>
      </div>

      <div class="inline-block align-bottom bg-white rounded-t-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Filtros</h3>
            <button @click="mobileFiltersOpen = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Búsqueda móvil -->
          <div class="mb-4">
            <label for="mobile-search" class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div class="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                id="mobile-search"
                type="text" 
                v-model="searchQuery"
                placeholder="Buscar productos..." 
                class="bg-transparent border-none focus:outline-none text-sm ml-2 w-full"
              >
            </div>
          </div>
          
          <!-- Categorías móviles -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="category in categories"
                :key="'mobile-' + category"
                @click="activeCategory = category"
                :class="{
                  'px-3 py-2 rounded-full text-sm': true,
                  'bg-pink-100 text-pink-700': activeCategory === category,
                  'bg-gray-100 text-gray-700': activeCategory !== category
                }"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Rango de precio móvil -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rango de precio</label>
            <div class="px-2">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
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
                  class="w-full"
                >
                <input 
                  type="range" 
                  v-model="priceRange[1]" 
                  :min="0" 
                  :max="1000" 
                  step="10"
                  class="w-full"
                >
              </div>
            </div>
          </div>
          
          <!-- Ordenamiento móvil -->
          <div class="mb-4">
            <label for="mobile-sort" class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select 
              id="mobile-sort"
              v-model="sortOption"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
            >
              <option>Recomendados</option>
              <option>Más nuevos</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mejor valorados</option>
            </select>
          </div>
        </div>
        
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            @click="resetFilters"
            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:col-start-1 sm:text-sm"
          >
            Limpiar filtros
          </button>
          <button
            type="button"
            @click="mobileFiltersOpen = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 sm:mt-0 sm:col-start-2 sm:text-sm"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <section class="relative bg-gray-100 overflow-hidden">
    <div class="h-96 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center">
      <div class="text-center px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">NUEVA COLECCIÓN 2025</h1>
        <p class="text-xl text-white mb-6">Hasta 70% de descuento en seleccionados</p>
        <router-link 
          to="/productos"
          class="inline-block bg-white text-pink-600 hover:bg-gray-50 font-medium px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm uppercase tracking-wider"
        >
          Comprar ahora
        </router-link>
      </div>
    </div>
    
    <div class="container mx-auto px-4 -mt-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-pink-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h3 class="text-sm font-medium">Envío gratis</h3>
          <p class="text-xs text-gray-500">En pedidos +$50</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-pink-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-sm font-medium">Garantía</h3>
          <p class="text-xs text-gray-500">30 días devolución</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-pink-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="text-sm font-medium">Pago seguro</h3>
          <p class="text-xs text-gray-500">100% protegido</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 text-center">
          <div class="text-pink-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-sm font-medium">Soporte 24/7</h3>
          <p class="text-xs text-gray-500">Atención personalizada</p>
        </div>
      </div>
    </div>
  </section>

  <main class="py-8 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">PRODUCTOS DESTACADOS</h2>
        <div class="flex items-center space-x-4">
          <!-- Filtro de rango de precio para desktop -->
          <div class="hidden md:flex items-center">
            <span class="text-sm text-gray-600 mr-2">Precio:</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm">${{ priceRange[0] }}</span>
              <input 
                type="range" 
                v-model="priceRange[0]" 
                :min="0" 
                :max="priceRange[1]" 
                step="10"
                class="w-24"
              >
              <span class="text-sm">-</span>
              <input 
                type="range" 
                v-model="priceRange[1]" 
                :min="priceRange[0]" 
                :max="1000" 
                step="10"
                class="w-24"
              >
              <span class="text-sm">${{ priceRange[1] }}</span>
            </div>
          </div>
          
          <!-- Botón de filtros para móvil -->
          <button 
            @click="mobileFiltersOpen = true"
            class="md:hidden flex items-center text-sm text-gray-700 hover:text-pink-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
          
          <!-- Selector de ordenamiento -->
          <div class="flex items-center">
            <span class="text-sm text-gray-600 mr-2">Ordenar por:</span>
            <select 
              v-model="sortOption"
              class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
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
      
      <!-- Mostrar loading si está cargando -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        <p class="mt-2 text-gray-600">Cargando productos...</p>
      </div>
      
      <!-- Mostrar productos filtrados -->
      <div v-else>
        <!-- Contador de resultados y botón para limpiar filtros -->
        <div class="flex justify-between items-center mb-4">
          <p class="text-sm text-gray-600">
            Mostrando {{ filteredProducts.length }} de {{ productos.length }} productos
          </p>
          <button 
            @click="resetFilters"
            v-if="searchQuery || activeCategory !== 'Todos' || priceRange[0] > 0 || priceRange[1] < 1000 || sortOption !== 'Recomendados'"
            class="text-sm text-pink-500 hover:text-pink-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar filtros
          </button>
        </div>
        
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No se encontraron productos</h3>
          <p class="mt-1 text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          <button 
            @click="resetFilters"
            class="mt-4 px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700"
          >
            Mostrar todos los productos
          </button>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="producto in filteredProducts"
            :key="producto._id"
            class="bg-white rounded-lg overflow-hidden group relative hover:shadow-md transition-shadow"
          >
            <div class="relative aspect-square overflow-hidden">
              <img
                :src="producto.imagenes"
                :alt="producto.nombre"
                @error="handleImageError(producto._id)"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                v-if="!imageError[producto._id]"
              />
              <div 
                v-else
                class="w-full h-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-gray-500">Imagen no disponible</span>
              </div>
              
              <button 
                @click="addToCart(producto._id)"
                class="absolute bottom-2 right-2 bg-pink-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <div class="absolute top-2 left-2 flex flex-col space-y-1">
                <span 
                  v-if="producto.nuevo"
                  class="bg-pink-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  Nuevo
                </span>
                <span 
                  v-if="producto.descuento"
                  class="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  -{{ producto.descuento }}%
                </span>
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 mb-1 truncate">{{ producto.nombre }}</h3>
              <p class="text-xs text-gray-500 truncate">{{ producto.categoria }}</p>

              <div class="flex items-center mt-1">
                <span class="text-base font-bold text-pink-600">${{ producto.precio.toFixed(2) }}</span>
                <span v-if="producto.precioOriginal" class="text-xs text-gray-500 line-through ml-2">${{ producto.precioOriginal.toFixed(2) }}</span>
              </div>

              <div class="flex items-center mt-1">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="text-xs text-gray-500 ml-1">({{ producto.rating || 0 }})</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-10">
          <button class="border border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">
            Ver más productos
          </button>
        </div>
      </div>
    </div>
  </main>
  
  <section class="py-12 bg-gradient-to-r from-pink-100 to-purple-100 my-8">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">¡ÚNETE A NUESTRA COMUNIDAD!</h2>
      <p class="text-gray-700 mb-6 max-w-2xl mx-auto">Recibe un 10% de descuento en tu primera compra al suscribirte a nuestro newsletter</p>
      <div class="flex max-w-md mx-auto">
        <input type="email" placeholder="Tu dirección de email" class="px-4 py-3 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-pink-500">
        <button class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
          Suscribirse
        </button>
      </div>
    </div>
  </section>
  
  <footer class="bg-gray-100 text-gray-700 pt-12 pb-6 border-t border-gray-200">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-4">CAMILLE</h3>
          <p class="text-sm mb-4">Tu destino de moda online con las últimas tendencias a precios increíbles.</p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-500 hover:text-pink-500">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-pink-500">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900 uppercase mb-4">Comprar</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Mujer</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Hombre</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Niños</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Accesorios</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Ofertas</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900 uppercase mb-4">Servicio al cliente</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Contacto</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Preguntas frecuentes</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Envíos y devoluciones</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Métodos de pago</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Guía de tallas</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900 uppercase mb-4">Sobre nosotros</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Nuestra historia</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Trabaja con nosotros</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Responsabilidad social</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Términos y condiciones</a></li>
            <li><a href="#" class="text-sm hover:text-pink-500 transition">Política de privacidad</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-sm font-bold text-gray-900 uppercase mb-4">Contacto</h4>
          <address class="text-sm not-italic">
            <p class="mb-2">Av. de la Moda 123</p>
            <p class="mb-2">08025 Barcelona, España</p>
            <p class="mb-2">info@camille.com</p>
            <p>+34 123 456 789</p>
          </address>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-xs text-gray-500 mb-4 md:mb-0">&copy; 2025 Camille. Todos los derechos reservados.</p>
        <div class="flex space-x-4">
          <img src="https://th.bing.com/th/id/R.c7b8552689fc9bf2cf541d80c817d8c2?rik=6%2fQpNehhAsOOZg&pid=ImgRaw&r=0" alt="Visa" class="h-6">
          <img src="https://th.bing.com/th/id/OIP.2GBsE98iH4hZsEB-8DZqNQHaHa?r=0&rs=1&pid=ImgDetMain" alt="Mastercard" class="h-6">
          <img src="https://th.bing.com/th/id/R.bd1419f2f730ef7ba64126743e0e391e?rik=9ZRBG8q8wWAKmA&pid=ImgRaw&r=0" alt="PayPal" class="h-6">
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #ec4899;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #db2777;
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}

.transition-opacity {
  transition-property: opacity;
}

.transition-transform {
  transition-property: transform;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}

.ease-out {
  transition-timing-function: ease-out;
}

.ease-in-out {
  transition-timing-function: ease-in-out;
}
</style>