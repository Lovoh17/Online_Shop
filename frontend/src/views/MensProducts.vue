<!-- MensProducts.vue -->
<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <section class="bg-[#1E3A34] text-white relative overflow-hidden">
      <div class="absolute inset-0 z-0 opacity-10">
        <div class="w-full h-full bg-gradient-to-br from-[#4F7C63] to-[#D8C69E]"></div>
      </div>
      
      <div class="relative z-10 py-16">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-black mb-4 tracking-tight">HOMBRE</h1>
          <p class="text-xl text-[#D8C69E] font-light">Colección exclusiva para hombres</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Categorías como navbar horizontal -->
      <div class="bg-white border border-[#D8C69E] rounded-lg p-6 mb-8">
        <h2 class="text-lg font-bold text-[#1E3A34] mb-4 uppercase tracking-wide text-center">Explorar Categorías</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <button
            v-for="category in mensCategories"
            :key="category._id"
            @click="setActiveCategory(category)"
            :class="{
              'flex flex-col items-center px-6 py-4 rounded-lg border-2 transition-all duration-300 min-w-[120px]': true,
              'bg-[#1E3A34] border-[#1E3A34] text-white': activeCategory?._id === category._id,
              'bg-white border-[#D8C69E] text-[#1E3A34] hover:bg-[#F8F6F0] hover:border-[#1E3A34]': activeCategory?._id !== category._id
            }"
          >
            <span class="text-2xl mb-2">{{ category.icono }}</span>
            <span class="text-sm font-semibold text-center">{{ category.nombre.replace(' Hombre', '') }}</span>
            <span class="text-xs opacity-75 mt-1">{{ getCategoryProductCount(category._id) }} productos</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:w-1/4">
          <!-- Collections -->
          <div class="bg-white border border-[#D8C69E] rounded-lg p-6 mb-6">
            <h3 class="text-lg font-bold text-[#1E3A34] mb-4 uppercase tracking-wide">Colecciones</h3>
            <ul class="space-y-3">
              <li v-for="collection in collections" :key="collection.name">
                <button 
                  @click="setActiveCollection(collection.name)"
                  :class="{
                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all': true,
                    'bg-[#1E3A34] text-white': activeCollection === collection.name,
                    'text-gray-700 hover:bg-[#F8F6F0] hover:text-[#1E3A34]': activeCollection !== collection.name
                  }"
                >
                  {{ collection.name }}
                  <span class="float-right text-xs opacity-75">({{ getCollectionCount(collection.name) }})</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Live Chat Button -->
          <div class="bg-[#4F7C63] rounded-lg p-6 text-center">
            <div class="text-white mb-3">
              <svg class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 class="font-bold text-lg">Live Chat</h3>
              <p class="text-sm opacity-90">¿Necesitas ayuda?</p>
            </div>
            <button class="bg-white text-[#1E3A34] px-6 py-2 rounded-lg font-semibold hover:bg-[#F8F6F0] transition-colors text-sm">
              Chatear Ahora
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:w-3/4">
          <!-- Products Header -->
          <div class="bg-white border border-[#D8C69E] rounded-lg p-6 mb-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="flex items-center space-x-4 mb-4 md:mb-0">
                <h2 class="text-2xl font-black text-[#1E3A34]">
                  {{ activeCategory ? activeCategory.nombre : 'TODOS LOS PRODUCTOS' }}
                </h2>
                <span class="bg-[#F0F7F4] text-[#1E3A34] px-3 py-1 rounded-full text-sm font-semibold">
                  {{ filteredProducts.length }} productos
                </span>
              </div>
              
              <div class="flex items-center space-x-4">
                <!-- Sort Options -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-semibold text-[#1E3A34]">Ordenar:</span>
                  <select 
                    v-model="sortOption"
                    class="border border-[#D8C69E] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A34]"
                  >
                    <option>Destacados</option>
                    <option>Más nuevos</option>
                    <option>Precio: menor a mayor</option>
                    <option>Precio: mayor a menor</option>
                    <option>Mejor valorados</option>
                  </select>
                </div>

                <!-- View Toggle -->
                <div class="flex items-center space-x-1 border border-[#D8C69E] rounded-lg p-1">
                  <button class="p-2 rounded hover:bg-[#F8F6F0] text-[#1E3A34]">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button class="p-2 rounded bg-[#1E3A34] text-white">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Active Filters -->
            <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span 
                v-if="activeCollection !== 'Todos'"
                class="bg-[#F0F7F4] text-[#1E3A34] px-3 py-1 rounded-full text-xs font-medium flex items-center"
              >
                {{ activeCollection }}
                <button @click="clearCollection" class="ml-2 hover:text-red-500">
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              <span 
                v-if="activeCategory"
                class="bg-[#F0F7F4] text-[#1E3A34] px-3 py-1 rounded-full text-xs font-medium flex items-center"
              >
                {{ activeCategory.nombre }}
                <button @click="clearCategory" class="ml-2 hover:text-red-500">
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="loading" class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D8C69E] border-t-[#1E3A34]"></div>
            <p class="mt-4 text-gray-600 font-medium">Cargando productos...</p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
            <svg class="h-16 w-16 mx-auto text-[#D8C69E] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-bold text-[#1E3A34] mb-2">Sin resultados</h3>
            <p class="text-gray-600 mb-6">No hay productos en esta categoría</p>
            <button 
              @click="resetFilters"
              class="bg-[#1E3A34] text-white px-6 py-3 font-semibold text-sm hover:bg-[#4F7C63] rounded-lg"
            >
              Ver todos los productos
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="producto in filteredProducts"
              :key="producto._id"
              class="bg-white border border-[#D8C69E] rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div class="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  :src="producto.imagenes"
                  :alt="producto.nombre"
                  @error="handleImageError(producto._id)"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  v-if="!imageError[producto._id]"
                />
                <div 
                  v-else
                  class="w-full h-full bg-[#D8C69E] flex items-center justify-center"
                >
                  <span class="text-gray-600 text-sm">Sin imagen</span>
                </div>
                
                <!-- Quick View Button -->
                <button 
                  @click="openQuickView(producto)"
                  class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1E3A34] text-white py-2 px-6 font-semibold text-xs uppercase tracking-wide rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Vista rápida
                </button>
                
                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col space-y-2">
                  <span 
                    v-if="producto.nuevo"
                    class="bg-[#1E3A34] text-white text-xs px-2 py-1 font-bold rounded"
                  >
                    NUEVO
                  </span>
                  <span 
                    v-if="producto.descuento"
                    class="bg-[#E57C23] text-white text-xs px-2 py-1 font-bold rounded"
                  >
                    -{{ producto.descuento }}%
                  </span>
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-bold text-sm text-[#1E3A34] mb-2 tracking-wide line-clamp-2">{{ producto.nombre }}</h3>
                
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-black text-[#1E3A34]">${{ producto.precio.toFixed(2) }}</span>
                    <span v-if="producto.precioOriginal" class="text-sm text-gray-400 line-through">${{ producto.precioOriginal.toFixed(2) }}</span>
                  </div>
                  
                  <!-- Rating -->
                  <div class="flex items-center space-x-1">
                    <svg class="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="text-xs font-bold text-[#1E3A34]">{{ producto.rating }}</span>
                  </div>
                </div>
                
                <button 
                  @click="addToCart(producto._id)"
                  class="w-full bg-[#4F7C63] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1E3A34] transition-colors"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="filteredProducts.length > 0" class="text-center mt-12">
            <button class="border-2 border-[#1E3A34] text-[#1E3A34] hover:bg-[#1E3A34] hover:text-white px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors rounded-lg">
              Cargar más productos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="quickViewProduct"
          class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-white/30"
          @click.self="closeQuickView"
        >
          <!-- Modal content (same as before) -->
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const productos = ref([]);
const mensCategories = ref([]);
const imageError = ref({});
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// Filtros
const activeCollection = ref('Todos');
const activeCategory = ref(null);
const sortOption = ref('Destacados');
const loading = ref(false);

// Quick View
const quickViewProduct = ref(null);

// Colecciones
const collections = ref([
  { name: 'Todos', count: 0 },
  { name: 'Nuevos', count: 0 },
  { name: 'Ofertas', count: 0 },
  { name: 'Más Vendidos', count: 0 }
]);

onMounted(async () => {
  try {
    loading.value = true;
    
    // 1. Cargar categorías de hombre
    const categoriesRes = await fetch("http://localhost:4000/api/categorias/hombre");
    const categoriesData = await categoriesRes.json();
    
    if (categoriesData.success) {
      mensCategories.value = categoriesData.categorias;
    }
    
    // 2. Cargar todos los productos
    const productsRes = await fetch("http://localhost:4000/api/productos");
    const productsData = await productsRes.json();
    
    if (productsData.success) {
      // Filtrar solo productos de categorías de hombre
      const allProducts = productsData.productos;
      const mensCategoryIds = mensCategories.value.map(cat => cat._id);
      
      productos.value = allProducts
        .filter(p => mensCategoryIds.includes(p.categoria))
        .map(p => ({
          ...p,
          _id: p._id || p.id,
          imagenes: p.imagenes || '/placeholder-product.jpg',
          precio: parseFloat(p.precio) || 0,
          categoria: p.categoria || 'Sin categoría',
          rating: p.rating || Math.floor(Math.random() * 2) + 4,
          descuento: p.descuento || 0,
          nuevo: p.nuevo || (new Date() - new Date(p.createdAt || p.fechaCreacion)) < (30 * 24 * 60 * 60 * 1000)
        }));
      
      // Actualizar contadores
      updateCollectionCounts();
    } else {
      console.error("Error al cargar productos:", productsData.message);
    }
  } catch (error) {
    console.error("Error al cargar los datos", error);
  } finally {
    loading.value = false;
  }
});

// Computed
const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  // Filtrar por categoría activa
  if (activeCategory.value) {
    result = result.filter(p => p.categoria === activeCategory.value._id);
  }
  
  // Filtrar por colección
  if (activeCollection.value !== 'Todos') {
    if (activeCollection.value === 'Nuevos') {
      result = result.filter(p => p.nuevo);
    } else if (activeCollection.value === 'Ofertas') {
      result = result.filter(p => p.descuento > 0);
    } else if (activeCollection.value === 'Más Vendidos') {
      result = result.filter(p => p.rating >= 4.5);
    }
  }
  
  // Ordenar
  switch (sortOption.value) {
    case 'Precio: menor a mayor':
      result.sort((a, b) => a.precio - b.precio);
      break;
    case 'Precio: mayor a menor':
      result.sort((a, b) => b.precio - a.precio);
      break;
    case 'Más nuevos':
      result.sort((a, b) => new Date(b.createdAt || b.fechaCreacion) - new Date(a.createdAt || a.fechaCreacion));
      break;
    case 'Mejor valorados':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      break;
  }
  
  return result;
});

// Métodos
const setActiveCollection = (collection) => {
  activeCollection.value = collection;
};

const setActiveCategory = (category) => {
  activeCategory.value = category;
};

const clearCollection = () => {
  activeCollection.value = 'Todos';
};

const clearCategory = () => {
  activeCategory.value = null;
};

const resetFilters = () => {
  activeCollection.value = 'Todos';
  activeCategory.value = null;
  sortOption.value = 'Destacados';
};

const getCollectionCount = (collectionName) => {
  let products = [...productos.value];
  
  // Si hay categoría activa, filtrar primero por categoría
  if (activeCategory.value) {
    products = products.filter(p => p.categoria === activeCategory.value._id);
  }
  
  if (collectionName === 'Todos') return products.length;
  if (collectionName === 'Nuevos') return products.filter(p => p.nuevo).length;
  if (collectionName === 'Ofertas') return products.filter(p => p.descuento > 0).length;
  if (collectionName === 'Más Vendidos') return products.filter(p => p.rating >= 4.5).length;
  return 0;
};

const getCategoryProductCount = (categoryId) => {
  return productos.value.filter(p => p.categoria === categoryId).length;
};

const updateCollectionCounts = () => {
  collections.value = collections.value.map(collection => ({
    ...collection,
    count: getCollectionCount(collection.name)
  }));
};

// Métodos existentes
const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const openQuickView = (producto) => {
  quickViewProduct.value = producto;
  document.body.style.overflow = 'hidden';
};

const closeQuickView = () => {
  quickViewProduct.value = null;
  document.body.style.overflow = 'auto';
};

const addToCart = async (productoId, cantidad = 1) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/api/carrito', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        productoId: productoId,
        cantidad: cantidad
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al agregar al carrito');
    }
    
    // Notificación
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[#1E3A34] text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Producto agregado al carrito';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito: ' + error.message);
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transiciones para el modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  backdrop-filter: blur(8px);
}
</style>