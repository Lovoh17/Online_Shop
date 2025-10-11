<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-500 hover:text-gray-700">Inicio</router-link>
          <span class="text-gray-400">/</span>
          <router-link to="/productos" class="text-gray-500 hover:text-gray-700">Productos</router-link>
          <span v-if="categoriaActual" class="text-gray-400">/</span>
          <span v-if="categoriaActual" class="text-gray-900 font-medium">{{ categoriaActual }}</span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#1E3A34] mb-2">
          {{ categoriaActual || 'Todos los Productos' }}
        </h1>
        <p class="text-gray-600">{{ totalProductos }} productos encontrados</p>
      </div>

      <!-- Loading State -->
      <div v-if="cargando" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n" class="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
          <div class="w-full h-64 bg-gray-200"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar productos</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="cargarProductos" 
          class="px-6 py-2 bg-[#1E3A34] text-white rounded-lg hover:bg-[#4F7C63] transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="productos.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
        <p class="text-gray-600 mb-4">No se encontraron productos en esta categoría</p>
        <router-link 
          to="/productos" 
          class="inline-block px-6 py-2 bg-[#1E3A34] text-white rounded-lg hover:bg-[#4F7C63] transition-colors"
        >
          Ver todos los productos
        </router-link>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="producto in productos" 
          :key="producto._id"
          class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
          @click="irADetalle(producto._id)"
        >
          <!-- Imagen -->
          <div class="relative overflow-hidden">
            <img 
              :src="producto.imagenes[0]" 
              :alt="producto.nombre"
              class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            >
            <!-- Badges -->
            <div class="absolute top-2 left-2 flex flex-col gap-2">
              <span v-if="producto.nuevo" class="px-2 py-1 bg-[#E57C23] text-white text-xs font-bold rounded">
                NUEVO
              </span>
              <span v-if="producto.descuento > 0" class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                -{{ producto.descuento }}%
              </span>
            </div>
            <!-- Quick Actions -->
            <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click.stop="agregarAWishlist(producto._id)"
                class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Información del Producto -->
          <div class="p-4">
            <div class="mb-2">
              <span class="text-xs text-[#4F7C63] font-semibold uppercase">{{ producto.marca }}</span>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10">
              {{ producto.nombre }}
            </h3>
            
            <!-- Rating -->
            <div class="flex items-center mb-2">
              <div class="flex items-center">
                <svg v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= Math.round(producto.valoracion) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="ml-2 text-xs text-gray-600">({{ producto.numeroReviews }})</span>
            </div>

            <!-- Precio -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-lg font-bold text-[#1E3A34]">${{ producto.precio.toFixed(2) }}</span>
                <span v-if="producto.precioOriginal > producto.precio" class="ml-2 text-sm text-gray-400 line-through">
                  ${{ producto.precioOriginal.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Colores disponibles -->
            <div v-if="producto.colores && producto.colores.length > 0" class="mt-3 flex items-center gap-1">
              <div 
                v-for="(color, index) in producto.colores.slice(0, 4)" 
                :key="index"
                class="w-4 h-4 rounded-full border border-gray-300"
                :style="{ backgroundColor: obtenerColorHex(color) }"
                :title="color"
              ></div>
              <span v-if="producto.colores.length > 4" class="text-xs text-gray-500 ml-1">
                +{{ producto.colores.length - 4 }}
              </span>
            </div>

            <!-- Stock -->
            <div class="mt-3">
              <span v-if="producto.stock > 10" class="text-xs text-green-600 font-medium">
                En stock
              </span>
              <span v-else-if="producto.stock > 0" class="text-xs text-orange-600 font-medium">
                ¡Últimas {{ producto.stock }} unidades!
              </span>
              <span v-else class="text-xs text-red-600 font-medium">
                Agotado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Estado
const productos = ref([]);
const cargando = ref(true);
const error = ref(null);
const categoriaActual = ref('');
const totalProductos = ref(0);

// API Base URL
const API_URL = 'http://localhost:3000/api/productos';

// Cargar productos
const cargarProductos = async () => {
  cargando.value = true;
  error.value = null;

  try {
    let url = 'http://localhost:4000/api/productos';
    
    // Si hay parámetro de categoría en la ruta
    if (route.params.categoria) {
      categoriaActual.value = decodeURIComponent(route.params.categoria);
      url = `http://localhost:4000/api/productos/categoria/${encodeURIComponent(categoriaActual.value)}`;
    } 
    // Si hay query params (búsqueda, filtros, etc)
    else if (Object.keys(route.query).length > 0) {
      const params = new URLSearchParams();
      
      if (route.query.search) {
        params.append('search', route.query.search);
        categoriaActual.value = `Resultados para "${route.query.search}"`;
      }
      if (route.query.genero) {
        params.append('genero', route.query.genero);
        categoriaActual.value = route.query.genero.charAt(0).toUpperCase() + route.query.genero.slice(1);
      }
      if (route.query.etiqueta) {
        params.append('etiqueta', route.query.etiqueta);
        categoriaActual.value = route.query.etiqueta.charAt(0).toUpperCase() + route.query.etiqueta.slice(1);
      }
      if (route.query.descuento) {
        categoriaActual.value = 'Ofertas y Descuentos';
      }
      
      url = `http://localhost:4000/api/productos?${params.toString()}`;
    }
    // Todos los productos
    else {
      categoriaActual.value = '';
    }

    const response = await fetch(url);
    const data = await response.json();
    
    // Manejar respuesta
    if (data.success) {
      productos.value = data.productos.map(p => ({
        ...p,
        _id: p._id || p.id,
        imagenes: p.imagenes || '/placeholder-product.jpg',
        precio: parseFloat(p.precio) || 0,
        categoria: p.categoria || 'Sin categoría',
        rating: p.valoracion || p.rating || Math.floor(Math.random() * 2) + 4,
        descuento: p.descuento || 0,
        nuevo: p.nuevo || (new Date() - new Date(p.createdAt || p.fechaCreacion)) < (30 * 24 * 60 * 60 * 1000)
      }));
    } else if (data.data) {
      productos.value = data.data.map(p => ({
        ...p,
        _id: p._id || p.id,
        imagenes: p.imagenes || '/placeholder-product.jpg',
        precio: parseFloat(p.precio) || 0,
        categoria: p.categoria || 'Sin categoría',
        rating: p.valoracion || p.rating || Math.floor(Math.random() * 2) + 4,
        descuento: p.descuento || 0,
        nuevo: p.nuevo || (new Date() - new Date(p.createdAt || p.fechaCreacion)) < (30 * 24 * 60 * 60 * 1000)
      }));
    } else if (Array.isArray(data)) {
      productos.value = data.map(p => ({
        ...p,
        _id: p._id || p.id,
        imagenes: p.imagenes || '/placeholder-product.jpg',
        precio: parseFloat(p.precio) || 0,
        categoria: p.categoria || 'Sin categoría',
        rating: p.valoracion || p.rating || Math.floor(Math.random() * 2) + 4,
        descuento: p.descuento || 0,
        nuevo: p.nuevo || (new Date() - new Date(p.createdAt || p.fechaCreacion)) < (30 * 24 * 60 * 60 * 1000)
      }));
    } else {
      productos.value = [];
    }

    // Filtrar por descuento si es necesario
    if (route.query.descuento === 'true') {
      productos.value = productos.value.filter(p => p.descuento > 0);
    }

    totalProductos.value = productos.value.length;
  } catch (err) {
    console.error('Error al cargar productos:', err);
    error.value = err.message || 'No se pudieron cargar los productos';
    productos.value = [];
    totalProductos.value = 0;
  } finally {
    cargando.value = false;
  }
};

// Ir a detalle del producto
const irADetalle = (id) => {
  router.push(`/producto/${id}`);
};

// Agregar a wishlist
const agregarAWishlist = (id) => {
  // TODO: Implementar lógica de wishlist
  console.log('Agregar a wishlist:', id);
};

// Obtener color hexadecimal
const obtenerColorHex = (nombreColor) => {
  const colores = {
    'Azul': '#3B82F6',
    'Negro': '#000000',
    'Gris': '#6B7280',
    'Verde Oliva': '#84A98C',
    'Khaki': '#C3B091',
    'Marrón': '#8B4513',
    'Rojo': '#EF4444',
    'Blanco': '#FFFFFF'
  };
  return colores[nombreColor] || '#9CA3AF';
};

// Watch para cambios en la ruta
watch(() => [route.params.categoria, route.query], () => {
  cargarProductos();
}, { deep: true });

// Cargar productos al montar
onMounted(() => {
  cargarProductos();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>