<!-- NewProducts.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const productos = ref([]);
const allCategories = ref([]);
const imageError = ref({});
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const selectedColor = ref(0);
const selectedSize = ref('S');
const quantity = ref(1);

// Filtros
const activeGender = ref('Todos');
const activeCategory = ref(null);
const sortOption = ref('Destacados');
const loading = ref(false);
const error = ref(null);

// Quick View
const quickViewProduct = ref(null);

// Géneros
const genders = ref([
  { name: 'Todos', count: 0 },
  { name: 'Hombre', count: 0 },
  { name: 'Mujer', count: 0 },
  { name: 'Unisex', count: 0 }
]);

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCartFromQuickView = async () => {
  await addToCart(quickViewProduct.value._id, quantity.value);
  closeQuickView();
};

/**
 * Cargar productos nuevos desde la API
 * Filtra productos donde nuevo === true
 */
const cargarProductosNuevos = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const productsRes = await fetch("http://localhost:4000/api/productos");
    
    if (!productsRes.ok) {
      throw new Error(`Error al cargar productos: ${productsRes.status}`);
    }
    
    const productsData = await productsRes.json();
    
    if (!productsData.success) {
      throw new Error(productsData.message || 'Error al cargar productos');
    }
    
    const allProducts = productsData.productos || [];
    console.log('Total productos recibidos:', allProducts.length);
    
    // Filtrar SOLO productos con nuevo === true
    const productosNuevos = allProducts.filter(producto => {
      return producto.nuevo === true;
    });
    
    console.log('Productos nuevos filtrados:', productosNuevos.length);
    
    // Extraer categorías únicas
    const categoriasUnicas = new Set();
    productosNuevos.forEach(producto => {
      if (producto.categoria) {
        categoriasUnicas.add(producto.categoria);
      }
    });
    
    // Obtener información de categorías
    const categoriesRes = await fetch("http://localhost:4000/api/categorias");
    
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      
      if (categoriesData.success) {
        const todasLasCategorias = categoriesData.categorias || [];
        
        allCategories.value = todasLasCategorias.filter(cat => 
          categoriasUnicas.has(cat.nombre) || categoriasUnicas.has(cat._id)
        );
        
        console.log('Categorías disponibles:', allCategories.value.length);
      }
    }
    
    // Crear categorías desde productos si no hay
    if (allCategories.value.length === 0) {
      const categoriasMap = new Map();
      
      productosNuevos.forEach(producto => {
        if (producto.categoria && !categoriasMap.has(producto.categoria)) {
          categoriasMap.set(producto.categoria, {
            _id: producto.categoria,
            nombre: producto.categoria,
            slug: producto.categoriaSlug || producto.categoria.toLowerCase()
          });
        }
      });
      
      allCategories.value = Array.from(categoriasMap.values());
    }
    
    // Procesar productos
    productos.value = productosNuevos
      .map(producto => {
        const categoriaObj = allCategories.value.find(cat => 
          cat._id === producto.categoria || cat.nombre === producto.categoria
        );
        
        return {
          ...producto,
          _id: producto._id || producto.id,
          imagenes: Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagenes || '/placeholder-product.jpg',
          precio: parseFloat(producto.precio) || 0,
          precioOriginal: producto.precioOriginal ? parseFloat(producto.precioOriginal) : null,
          categoria: producto.categoria,
          categoriaNombre: categoriaObj?.nombre || producto.categoria || 'Sin categoría',
          rating: producto.rating || producto.valoracion || (Math.random() * 1 + 4).toFixed(1),
          descuento: producto.descuento || 0,
          nuevo: true,
          stock: producto.stock || 0,
          enStock: (producto.stock || 0) > 0,
          genero: producto.genero || 'Unisex'
        };
      })
      .filter(producto => producto.enStock);
    
    console.log('Productos procesados:', productos.value.length);
    
    updateGenderCounts();
    
  } catch (err) {
    console.error("Error al cargar productos nuevos:", err);
    error.value = err.message || 'Error al cargar los productos';
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  // Filtrar por género
  if (activeGender.value !== 'Todos') {
    result = result.filter(p => 
      p.genero && p.genero.toLowerCase() === activeGender.value.toLowerCase()
    );
  }
  
  // Filtrar por categoría
  if (activeCategory.value) {
    result = result.filter(p => 
      p.categoria === activeCategory.value._id || 
      p.categoria === activeCategory.value.nombre ||
      p.categoriaNombre === activeCategory.value.nombre
    );
  }
  
  // Ordenar
  switch (sortOption.value) {
    case 'Precio: menor a mayor':
      result.sort((a, b) => a.precio - b.precio);
      break;
    case 'Precio: mayor a menor':
      result.sort((a, b) => b.precio - a.precio);
      break;
    case 'Más recientes':
      result.sort((a, b) => {
        const dateA = new Date(b.createdAt || b.fechaCreacion || 0);
        const dateB = new Date(a.createdAt || a.fechaCreacion || 0);
        return dateB - dateA;
      });
      break;
    case 'Mejor valorados':
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
      break;
    default:
      result.sort((a, b) => {
        const dateA = new Date(b.createdAt || b.fechaCreacion || 0);
        const dateB = new Date(a.createdAt || a.fechaCreacion || 0);
        return dateB - dateA;
      });
      break;
  }
  
  return result;
});

const setActiveGender = (gender) => {
  activeGender.value = gender;
};

const setActiveCategory = (category) => {
  activeCategory.value = category;
};

const clearGender = () => {
  activeGender.value = 'Todos';
};

const clearCategory = () => {
  activeCategory.value = null;
};

const resetFilters = () => {
  activeGender.value = 'Todos';
  activeCategory.value = null;
  sortOption.value = 'Destacados';
};

const getGenderCount = (genderName) => {
  let products = [...productos.value];
  
  if (activeCategory.value) {
    products = products.filter(p => 
      p.categoria === activeCategory.value._id || 
      p.categoria === activeCategory.value.nombre ||
      p.categoriaNombre === activeCategory.value.nombre
    );
  }
  
  if (genderName === 'Todos') return products.length;
  return products.filter(p => p.genero && p.genero.toLowerCase() === genderName.toLowerCase()).length;
};

const getCategoryProductCount = (categoriaId) => {
  let products = productos.value;
  
  if (activeGender.value !== 'Todos') {
    products = products.filter(p => 
      p.genero && p.genero.toLowerCase() === activeGender.value.toLowerCase()
    );
  }
  
  return products.filter(p => 
    p.categoria === categoriaId || p.categoriaNombre === categoriaId
  ).length;
};

const updateGenderCounts = () => {
  genders.value = genders.value.map(gender => ({
    ...gender,
    count: getGenderCount(gender.name)
  }));
};

const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const openQuickView = (producto) => {
  quickViewProduct.value = producto;
  selectedColor.value = 0;
  selectedSize.value = 'S';
  quantity.value = 1;
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
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error al agregar al carrito');
    }
    
    await cartStore.fetchCart();
    mostrarNotificacion('Producto agregado al carrito ✓');
    
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    mostrarNotificacion('Error al agregar el producto', 'error');
  }
};

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    tipo === 'success' ? 'bg-[#1E3A34] text-white' : 'bg-red-500 text-white'
  }`;
  notification.textContent = mensaje;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

onMounted(() => {
  cargarProductosNuevos();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="relative overflow-hidden h-[550px] ">
      <div class="absolute inset-0 ">
        <div class="absolute inset-0">
        <img 
          src="../assets/new2.png" 
          alt="Mujer" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#1E3A34]/90 via-[#1E3A34]/70 to-[#1E3A34]/50"></div>
      </div>
      </div>
      
      <div class="relative z-10 h-full flex items-center">
        <div class="container mx-auto px-4 md:px-8">
          <div class="max-w-3xl">
            <!-- Badge -->
            <div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <svg class="h-5 w-5 text-[#D8C69E]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-white text-sm font-semibold tracking-wide">NUEVOS INGRESOS</span>
            </div>
            
            <!-- Breadcrumb -->
            <div class="flex items-center space-x-2 text-sm text-white/80 mb-4">
              <router-link to="/" class="hover:text-white transition-colors">Collections</router-link>
              <span>/</span>
              <span class="text-white font-semibold">New Arrivals</span>
            </div>
            
            <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white leading-none">
              NEW<br>ARRIVALS
            </h1>
            
            <p class="text-xl md:text-2xl text-[#D8C69E] font-light mb-4">
              Los últimos productos que acabamos de recibir
            </p>
            <p class="text-sm text-white/70">
              {{ productos.length }} productos nuevos disponibles
            </p>
          </div>
        </div>
      </div>
      
      <div class="absolute right-8 top-1/2 transform -translate-y-1/2 rotate-90 origin-right hidden lg:block">
        <div class="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
          <span class="text-white text-sm font-bold tracking-widest">LATEST COLLECTION 2025</span>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Filtros Horizontales Mejorados -->
      <div class="bg-white rounded-xl shadow-sm border border-[#D8C69E] mb-8">
        <div class="p-6">
          <!-- Header de Filtros -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 class="text-lg font-black text-[#1E3A34] tracking-tight">FILTROS</h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ filteredProducts.length }} productos encontrados
              </p>
            </div>
            
            <!-- Ordenar por -->
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-[#1E3A34] whitespace-nowrap">Ordenar por:</span>
              <select 
                v-model="sortOption"
                class="px-4 py-2.5 border-2 border-[#D8C69E] rounded-lg text-sm focus:outline-none focus:border-[#1E3A34] transition-colors bg-white min-w-[180px]"
              >
                <option>Destacados</option>
                <option>Más recientes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Mejor valorados</option>
              </select>
            </div>
          </div>

          <!-- Filtros Activos -->
          <div v-if="activeGender !== 'Todos' || activeCategory" class="flex flex-wrap gap-2 mb-6 p-4 bg-[#F8F6F0] rounded-lg border border-[#D8C69E]">
            <span class="text-sm font-semibold text-[#1E3A34] mr-2">Filtros activos:</span>
            <span 
              v-if="activeGender !== 'Todos'"
              class="bg-[#1E3A34] text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
            >
              {{ activeGender }}
              <button @click="clearGender" class="hover:text-[#D8C69E] transition-colors">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <span 
              v-if="activeCategory"
              class="bg-[#1E3A34] text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
            >
              {{ activeCategory.nombre }}
              <button @click="clearCategory" class="hover:text-[#D8C69E] transition-colors">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
            <button 
              v-if="activeGender !== 'Todos' || activeCategory"
              @click="resetFilters"
              class="text-xs text-gray-600 hover:text-[#1E3A34] transition-colors ml-2 flex items-center gap-1"
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              Limpiar todos
            </button>
          </div>

          <!-- Géneros y Categorías en Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Géneros -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-[#1E3A34] uppercase tracking-wide flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Géneros
                </h3>
                <button 
                  v-if="activeGender !== 'Todos'"
                  @click="clearGender"
                  class="text-xs text-gray-500 hover:text-[#1E3A34] transition-colors flex items-center gap-1"
                >
                  Limpiar
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="gender in genders"
                  :key="gender.name"
                  @click="setActiveGender(gender.name)"
                  :class="{
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 flex items-center gap-2': true,
                    'bg-[#1E3A34] border-[#1E3A34] text-white shadow-md hover:shadow-lg': activeGender === gender.name,
                    'bg-white border-[#D8C69E] text-[#1E3A34] hover:bg-[#F8F6F0] hover:border-[#1E3A34]': activeGender !== gender.name
                  }"
                >
                  <span>{{ gender.name }}</span>
                  <span class="text-xs opacity-75 bg-white/20 px-1.5 py-0.5 rounded-full">
                    {{ gender.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Categorías -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-[#1E3A34] uppercase tracking-wide flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Categorías
                </h3>
                <button 
                  v-if="activeCategory"
                  @click="clearCategory"
                  class="text-xs text-gray-500 hover:text-[#1E3A34] transition-colors flex items-center gap-1"
                >
                  Limpiar
                  <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div v-if="loading && allCategories.length === 0" class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#D8C69E] border-t-[#1E3A34]"></div>
              </div>
              
              <div v-else class="flex flex-wrap gap-2">
                <button
                  v-for="category in allCategories"
                  :key="category._id"
                  @click="setActiveCategory(category)"
                  :class="{
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border-2 flex items-center gap-2': true,
                    'bg-[#1E3A34] border-[#1E3A34] text-white shadow-md hover:shadow-lg': activeCategory?._id === category._id || activeCategory?.nombre === category.nombre,
                    'bg-white border-[#D8C69E] text-[#1E3A34] hover:bg-[#F8F6F0] hover:border-[#1E3A34]': activeCategory?._id !== category._id && activeCategory?.nombre !== category.nombre
                  }"
                >
                  <span>{{ category.nombre }}</span>
                  <span class="text-xs opacity-75 bg-white/20 px-1.5 py-0.5 rounded-full">
                    {{ getCategoryProductCount(category._id || category.nombre) }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Products Grid -->
        <div class="lg:w-full">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D8C69E] border-t-[#1E3A34]"></div>
            <p class="mt-4 text-gray-600">Cargando productos nuevos...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <button @click="cargarProductosNuevos" class="bg-[#1E3A34] text-white px-6 py-2 rounded-lg">
              Reintentar
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-600 mb-4">No se encontraron productos nuevos</p>
            <button @click="resetFilters" class="text-[#1E3A34] underline">
              Limpiar filtros
            </button>
          </div>

          <!-- Products -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="producto in filteredProducts"
              :key="producto._id"
              class="bg-white border border-[#D8C69E] rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div class="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  v-if="!imageError[producto._id]"
                  :src="producto.imagenes"
                  :alt="producto.nombre"
                  @error="handleImageError(producto._id)"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                  class="absolute bottom-0 left-0 right-0 bg-[#1E3A34] text-white py-3 px-4 font-semibold text-sm uppercase tracking-wide transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Quick view</span>
                </button>
                
                <!-- Eye Icon -->
                <button 
                  @click="openQuickView(producto)"
                  class="absolute top-3 right-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 duration-300"
                >
                  <svg class="h-5 w-5 text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                <!-- NEW Badge -->
                <div class="absolute top-3 left-3 flex flex-col space-y-2">
                  <span class="bg-gradient-to-r from-[#D8C69E] to-[#C5B38E] text-[#1E3A34] text-xs px-3 py-1.5 font-black rounded shadow-md">
                    NEW
                  </span>
                </div>
                
                <!-- Rating Badge -->
                <div 
                  v-if="producto.rating >= 4"
                  class="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md"
                >
                  <svg class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-xs font-bold text-[#1E3A34]">{{ producto.rating }}</span>
                  <span class="text-xs text-gray-600">({{ Math.floor(Math.random() * 200) + 10 }})</span>
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-bold text-sm text-[#1E3A34] mb-1 tracking-wide truncate">{{ producto.nombre }}</h3>

                <div class="flex items-center mb-3">
                  <span class="text-lg font-black text-[#1E3A34]">${{ producto.precio.toFixed(2) }}</span>
                  <span v-if="producto.precioOriginal" class="text-sm text-gray-400 line-through ml-2">${{ producto.precioOriginal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="filteredProducts.length > 0 && filteredProducts.length >= 12" class="text-center mt-12">
            <button class="border-2 border-[#1E3A34] text-[#1E3A34] hover:bg-[#1E3A34] hover:text-white px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors rounded-lg shadow-md hover:shadow-xl">
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
          <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <div class="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-4xl w-full border border-gray-200">
              <div class="bg-white relative">
                <!-- Close Button -->
                <button 
                  @click="closeQuickView"
                  class="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors shadow-md"
                >
                  <svg class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  <!-- Product Image -->
                  <div class="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      v-if="!imageError[quickViewProduct._id]"
                      :src="quickViewProduct.imagenes"
                      :alt="quickViewProduct.nombre"
                      class="w-full h-full object-cover"
                      @error="handleImageError(quickViewProduct._id)"
                    />
                    <div 
                      v-else
                      class="w-full h-full bg-[#D8C69E] flex items-center justify-center"
                    >
                      <span class="text-gray-600">Sin imagen</span>
                    </div>
                    
                    <!-- NEW Badge -->
                    <div class="absolute top-4 left-4 flex flex-col space-y-2">
                      <span class="bg-gradient-to-r from-[#D8C69E] to-[#C5B38E] text-[#1E3A34] text-xs px-3 py-1.5 font-black rounded shadow-md">
                        NEW
                      </span>
                      <span 
                        v-if="quickViewProduct.descuento > 0"
                        class="bg-[#E57C23] text-white text-xs px-3 py-1 font-bold"
                      >
                        -{{ quickViewProduct.descuento }}%
                      </span>
                    </div>

                    <!-- Pagination dots -->
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <div 
                        v-for="i in 6" 
                        :key="i"
                        :class="['w-2 h-2 rounded-full', i === 1 ? 'bg-[#1E3A34]' : 'bg-gray-300']"
                      ></div>
                    </div>
                  </div>

                  <!-- Product Details -->
                  <div class="flex flex-col">
                    <h2 class="text-3xl font-bold text-[#1E3A34] mb-2 uppercase tracking-tight">
                      {{ quickViewProduct.nombre }}
                    </h2>
                    
                    <div class="flex items-center mb-6">
                      <span class="text-3xl font-black text-[#1E3A34]">${{ quickViewProduct.precio.toFixed(2) }}</span>
                      <span v-if="quickViewProduct.precioOriginal" class="text-xl text-gray-400 line-through ml-3">
                        ${{ quickViewProduct.precioOriginal.toFixed(2) }}
                      </span>
                    </div>

                    <!-- Shop Pay Info -->
                    <p class="text-sm text-gray-600 mb-6">
                      Pay in 2 interest-free installments of <strong>${{ (quickViewProduct.precio / 2).toFixed(2) }}</strong> with 
                      <span class="font-bold text-[#5A31F4]">shop</span><span class="font-bold">Pay</span>
                      <a href="#" class="underline ml-1">Learn more</a>
                    </p>

                    <!-- Color Selection -->
                    <div class="mb-6">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-sm font-semibold text-[#1E3A34]">Color:</label>
                        <span class="text-sm text-gray-600">Grisaille</span>
                      </div>
                      <div class="grid grid-cols-9 gap-2">
                        <button 
                          v-for="(color, index) in 9" 
                          :key="'color-' + index"
                          @click="selectedColor = index"
                          :class="{
                            'w-full aspect-square rounded-md border-2 transition-all hover:scale-110 overflow-hidden': true,
                            'border-[#1E3A34]': selectedColor === index,
                            'border-gray-300': selectedColor !== index
                          }"
                        >
                          <img 
                            :src="quickViewProduct.imagenes" 
                            :alt="'Color ' + (index + 1)"
                            class="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    </div>

                    <!-- Size Selection -->
                    <div class="mb-6">
                      <div class="flex items-center justify-between mb-3">
                        <label class="text-sm font-semibold text-[#1E3A34]">Size:</label>
                        <span class="text-sm text-gray-600">{{ selectedSize }}</span>
                      </div>
                      <div class="grid grid-cols-6 gap-2">
                        <button
                          v-for="size in ['S', 'M', 'L', 'XL', '2XL', '3XL']"
                          :key="size"
                          @click="selectedSize = size"
                          :class="{
                            'px-4 py-3 rounded-lg text-sm font-medium border-2 transition-all': true,
                            'bg-[#1E3A34] text-white border-[#1E3A34]': selectedSize === size,
                            'bg-white text-[#1E3A34] border-gray-300 hover:border-[#1E3A34]': selectedSize !== size
                          }"
                        >
                          {{ size }}
                        </button>
                      </div>
                    </div>

                    <!-- Quantity and Add to Cart -->
                    <div class="flex space-x-4 mb-6">
                      <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button 
                          @click="decreaseQuantity"
                          class="px-4 py-3 hover:bg-gray-100 transition-colors"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <input 
                          type="text" 
                          v-model="quantity"
                          class="w-16 text-center border-x-2 border-gray-300 py-3 focus:outline-none font-semibold"
                          readonly
                        />
                        <button 
                          @click="increaseQuantity"
                          class="px-4 py-3 hover:bg-gray-100 transition-colors"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <button 
                        @click="addToCartFromQuickView"
                        class="flex-1 bg-[#1E3A34] text-white rounded-lg py-3 px-6 font-semibold hover:bg-[#4F7C63] transition-colors"
                      >
                        Add to cart
                      </button>
                    </div>

                    <button class="text-sm text-[#1E3A34] underline hover:no-underline mb-6 text-center">
                      More payment options
                    </button>

                    <!-- View Full Details -->
                    <router-link 
                      :to="`/producto/${quickViewProduct._id}`"
                      @click="closeQuickView"
                      class="flex items-center justify-between text-sm font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors"
                    >
                      <span>View full details</span>
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>