<!-- ProductosView.vue -->
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
const brandImageErrors = ref({});

// Quick View Modal
const quickViewProduct = ref(null);
const selectedColor = ref(0);
const selectedSize = ref('S');
const quantity = ref(1);

// Marcas para el carrusel
const brands = ref([
  { name: 'Columbia', logo: new URL('../assets/brands/logo_columbia.jpg', import.meta.url).href },
  { name: 'The North Face', logo: new URL('../assets/brands/The-North-Face-Logo.png', import.meta.url).href },
  { name: 'Free Country', logo: new URL('../assets/brands/Free_Country_logoBlack_Logo.jpg', import.meta.url).href },
  { name: 'Bimimi Bay', logo: new URL('../assets/brands/bimini_bay_logo_1edb5d13-23e4-4ca1-90d9-376fc602add9_140x@2x.avif', import.meta.url).href },
  { name: 'Patagonia', logo: new URL('../assets/brands/OIP.webp', import.meta.url).href },
  { name: 'Marmot', logo: new URL('../assets/brands/marmot-logo.jpg', import.meta.url).href },
]);

// Categorías dinámicas
const categories = ref(['Todos']);

onMounted(async () => {
  try {
    loading.value = true;
    
    const res = await fetch("http://localhost:4000/api/productos");
    const data = await res.json();
    
    if (data.success) {
      productos.value = data.productos.map(p => ({
        ...p,
        _id: p._id || p.id,
        imagenes: p.imagenes || '/placeholder-product.jpg',
        precio: parseFloat(p.precio) || 0,
        categoria: p.categoria || 'Sin categoría',
        rating: p.rating || Math.floor(Math.random() * 2) + 4,
        descuento: p.descuento || 0,
        nuevo: p.nuevo || (new Date() - new Date(p.createdAt || p.fechaCreacion)) < (30 * 24 * 60 * 60 * 1000)
      }));
      
      const categoriasUnicas = [...new Set(productos.value.map(p => p.categoria).filter(Boolean))];
      categories.value = ['Todos', ...categoriasUnicas, 'Ofertas', 'Nuevos'];
    } else {
      console.error("Error al cargar productos:", data.message);
    }
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
      (producto.descripcion && producto.descripcion.toLowerCase().includes(query)) ||
      (producto.categoria && producto.categoria.toLowerCase().includes(query))
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

const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const handleBrandImageError = (brandName) => {
  brandImageErrors.value[brandName] = true;
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

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async (productoId, cantidad = 1) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    if (cartStore.addToCart) {
      await cartStore.addToCart(productoId, cantidad);
    } else {
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
    }
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50';
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

const addToCartFromQuickView = async () => {
  await addToCart(quickViewProduct.value._id, quantity.value);
  closeQuickView();
};

const resetFilters = () => {
  searchQuery.value = '';
  activeCategory.value = 'Todos';
  priceRange.value = [0, 1000];
  sortOption.value = 'Recomendados';
};

const toggleMobileFilters = () => {
  mobileFiltersOpen.value = !mobileFiltersOpen.value;
};
</script>

<template>
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
                    :src="quickViewProduct.imagenes"
                    :alt="quickViewProduct.nombre"
                    class="w-full h-full object-cover"
                    v-if="!imageError[quickViewProduct._id]"
                    @error="handleImageError(quickViewProduct._id)"
                  />
                  <div 
                    v-else
                    class="w-full h-full bg-[#D8C69E] flex items-center justify-center"
                  >
                    <span class="text-gray-600">Sin imagen</span>
                  </div>
                  
                  <!-- Badges -->
                  <div class="absolute top-4 left-4 flex flex-col space-y-2">
                    <span 
                      v-if="quickViewProduct.nuevo"
                      class="bg-[#1E3A34] text-white text-xs px-3 py-1 font-bold"
                    >
                      NUEVO
                    </span>
                    <span 
                      v-if="quickViewProduct.descuento"
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
            <h3 class="text-xl font-bold text-[#1E3A34]">Filtros</h3>
            <button @click="mobileFiltersOpen = false" class="text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Búsqueda móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-[#1E3A34] mb-2">Buscar</label>
            <div class="flex items-center bg-gray-100 border border-[#D8C69E] rounded-lg px-4 py-3">
              <svg class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <label class="block text-sm font-semibold text-[#1E3A34] mb-2">Categorías</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="category in categories"
                :key="'mobile-' + category"
                @click="activeCategory = category"
                :class="{
                  'px-4 py-2 rounded-lg text-sm font-medium': true,
                  'bg-[#1E3A34] text-white': activeCategory === category,
                  'bg-gray-100 text-gray-600 hover:bg-[#D8C69E]': activeCategory !== category
                }"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Rango de precio móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-[#1E3A34] mb-2">Precio</label>
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
                  class="w-full accent-[#1E3A34]"
                >
                <input 
                  type="range" 
                  v-model="priceRange[1]" 
                  :min="0" 
                  :max="1000" 
                  step="10"
                  class="w-full accent-[#1E3A34]"
                >
              </div>
            </div>
          </div>
          
          <!-- Ordenamiento móvil -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-[#1E3A34] mb-2">Ordenar por</label>
            <select 
              v-model="sortOption"
              class="w-full border border-[#D8C69E] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A34]"
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
            class="flex-1 border border-gray-600 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Limpiar
          </button>
          <button
            @click="mobileFiltersOpen = false"
            class="flex-1 bg-[#1E3A34] text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#4F7C63]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Hero Section -->
  <section class="bg-[#4F7C63] text-white relative overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img 
        src="../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.svg" 
        alt="Drip Outdoor Background"
        class="w-full h-full object-cover opacity-20"
      />
    </div>
    
    <div class="relative z-10 h-96 flex items-center justify-center">
      <div class="text-center px-4 max-w-4xl">
        <h1 class="text-5xl md:text-6xl font-black mb-6 tracking-tight text-white">DRIP OUTDOOR</h1>
        <p class="text-xl mb-8 text-[#C2B280]">Descubre nuestros productos exclusivos</p>
        <router-link 
          to="/products"
          class="inline-block bg-[#C2B280] text-[#1E3A34] font-bold px-8 py-4 text-sm uppercase tracking-wider hover:bg-[#D8C69E] transition-colors rounded-lg shadow-lg"
        >
          Comprar ahora
        </router-link>
      </div>
    </div>
    
    <!-- Carrusel de Marcas -->
    <div class="container mx-auto px-4 -mt-12 relative z-20">
      <div class="bg-white rounded-lg shadow-md p-6 border border-[#D8C69E]">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-black text-[#1E3A34] mb-1 tracking-tight">MARCAS RECONOCIDAS</h2>
          <p class="text-gray-600 text-sm">Trabajamos con las mejores marcas outdoor</p>
        </div>
        
        <div class="relative overflow-hidden">
          <div class="overflow-x-hidden">
            <div class="flex animate-scroll space-x-6">
              <!-- Primera pasada -->
              <div 
                v-for="(brand, index) in brands" 
                :key="'first-' + index"
                class="flex-none w-36 h-16 flex items-center justify-center bg-white border border-[#D8C69E] rounded-lg hover:border-[#4F7C63] hover:shadow-md transition-all duration-200 p-3"
              >
                <img 
                  v-if="!brandImageErrors[brand.name]"
                  :src="brand.logo" 
                  :alt="brand.name"
                  class="max-h-10 max-w-full object-contain"
                  @error="handleBrandImageError(brand.name)"
                />
                <div v-else class="text-center">
                  <div class="font-semibold text-xs text-[#1E3A34] text-center">{{ brand.name }}</div>
                </div>
              </div>
              
              <!-- Segunda pasada -->
              <div 
                v-for="(brand, index) in brands" 
                :key="'second-' + index"
                class="flex-none w-36 h-16 flex items-center justify-center bg-white border border-[#D8C69E] rounded-lg hover:border-[#4F7C63] hover:shadow-md transition-all duration-200 p-3"
              >
                <img 
                  v-if="!brandImageErrors[brand.name]"
                  :src="brand.logo" 
                  :alt="brand.name"
                  class="max-h-10 max-w-full object-contain"
                  @error="handleBrandImageError(brand.name)"
                />
                <div v-else class="text-center">
                  <div class="font-semibold text-xs text-[#1E3A34] text-center">{{ brand.name }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- NAVBAR DE FILTROS MEJORADO -->
  <div class="sticky top-0 z-40 bg-white border-b-2 border-[#D8C69E] shadow-md">
    <div class="container mx-auto px-4">
      <!-- Navbar Principal -->
      <div class="flex items-center justify-between py-4 gap-4">
        <!-- Búsqueda -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Buscar productos..." 
              class="w-full pl-12 pr-4 py-3 border-2 border-[#D8C69E] rounded-lg focus:outline-none focus:border-[#1E3A34] transition-colors text-sm"
            >
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Filtros Desktop -->
        <div class="hidden md:flex items-center gap-4">
          <!-- Rango de Precio -->
          <div class="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-[#D8C69E]">
            <svg class="h-5 w-5 text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex items-center gap-2">
              <input 
                type="number" 
                v-model="priceRange[0]" 
                :min="0" 
                :max="priceRange[1]"
                class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#1E3A34]"
              >
              <span class="text-gray-400">-</span>
              <input 
                type="number" 
                v-model="priceRange[1]" 
                :min="priceRange[0]" 
                :max="1000"
                class="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#1E3A34]"
              >
            </div>
          </div>

          <!-- Ordenar -->
          <div class="relative">
            <select 
              v-model="sortOption"
              class="appearance-none pl-4 pr-10 py-3 bg-gray-50 border-2 border-[#D8C69E] rounded-lg text-sm font-medium focus:outline-none focus:border-[#1E3A34] cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option>Recomendados</option>
              <option>Más nuevos</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mejor valorados</option>
            </select>
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Botón Limpiar Filtros -->
          <button 
            v-if="searchQuery || activeCategory !== 'Todos' || priceRange[0] > 0 || priceRange[1] < 1000 || sortOption !== 'Recomendados'"
            @click="resetFilters"
            class="px-4 py-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        </div>

        <!-- Botón Filtros Móvil -->
        <button 
          @click="mobileFiltersOpen = true"
          class="md:hidden flex items-center gap-2 px-4 py-3 bg-[#1E3A34] text-white rounded-lg text-sm font-medium hover:bg-[#4F7C63] transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filtros
        </button>
      </div>

      <!-- Categorías como Navbar -->
      <div class="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div class="flex gap-2 min-w-max">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="{
              'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap': true,
              'bg-[#1E3A34] text-white shadow-md': activeCategory === category,
              'bg-white text-gray-700 hover:bg-[#D8C69E] border-2 border-gray-200 hover:border-[#1E3A34]': activeCategory !== category
            }"
          >
            <span class="flex items-center gap-2">
              <!-- Iconos para categorías especiales -->
              <svg v-if="category === 'Ofertas'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <svg v-if="category === 'Nuevos'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {{ category }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <main class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Contador de Resultados -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-black text-[#1E3A34] tracking-tight">PRODUCTOS</h2>
          <p class="text-sm text-gray-600 mt-1">
            Mostrando <span class="font-semibold text-[#1E3A34]">{{ filteredProducts.length }}</span> de <span class="font-semibold">{{ productos.length }}</span> productos
          </p>
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D8C69E] border-t-[#1E3A34]"></div>
        <p class="mt-4 text-gray-600 font-medium">Cargando productos...</p>
      </div>
      
      <!-- Productos -->
      <div v-else>
        <div v-if="filteredProducts.length === 0" class="text-center py-20 bg-white rounded-lg shadow-md">
          <svg class="h-20 w-20 mx-auto text-[#D8C69E] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-2xl font-bold text-[#1E3A34] mb-2">No se encontraron productos</h3>
          <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
          <button 
            @click="resetFilters"
            class="bg-[#1E3A34] text-white px-8 py-3 font-semibold text-sm hover:bg-[#4F7C63] rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="producto in filteredProducts"
            :key="producto._id"
            class="bg-white border border-[#D8C69E] rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <img
                :src="producto.imagenes"
                :alt="producto.nombre"
                @error="handleImageError(producto._id)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
        
        <div class="text-center mt-12">
          <button class="border-2 border-[#1E3A34] text-[#1E3A34] hover:bg-[#1E3A34] hover:text-white px-8 py-3 font-bold text-sm uppercase tracking-wider transition-colors rounded-lg shadow-md hover:shadow-xl">
            Cargar más
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
  display: flex;
  width: max-content;
}

.animate-scroll:hover {
  animation-play-state: paused;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
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

.modal-enter-active .inline-block,
.modal-leave-active .inline-block {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .inline-block {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-leave-to .inline-block {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* Soporte para navegadores que no tienen backdrop-filter */
@supports not (backdrop-filter: blur(8px)) {
  .backdrop-blur-md {
    background-color: rgba(255, 255, 255, 0.85);
  }
}
</style>