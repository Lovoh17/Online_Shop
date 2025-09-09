<template>
  <header class="bg-white sticky top-0 z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y búsqueda -->
        <div class="flex items-center space-x-8">
          <router-link 
            to="/" 
            class="text-2xl font-black text-gray-900 tracking-tight hover:text-black transition-colors"
          >
            DRIPP-SHOP
          </router-link>
          
          <!-- Búsqueda desktop -->
          <div class="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-80 focus-within:border-gray-900 focus-within:bg-white transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery"
              @input="$emit('search', searchQuery)"
              placeholder="Buscar productos..." 
              class="bg-transparent border-none focus:outline-none text-sm ml-3 w-full placeholder-gray-500"
            >
            <kbd v-if="!searchQuery" class="hidden sm:inline-block text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">⌘K</kbd>
          </div>
        </div>
        
        <!-- Navegación -->
        <nav class="flex items-center space-x-1">
          <!-- Links desktop -->
          <router-link 
            to="/" 
            class="hidden md:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            active-class="text-gray-900 bg-gray-100"
          >
            INICIO
          </router-link>
          <!-- Botones de acción -->
          <div class="flex items-center space-x-2 ml-4">
            <!-- Búsqueda móvil -->
            <button 
              @click="toggleMobileSearch"
              class="lg:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <!-- Perfil -->
            <router-link 
              to="/perfil" 
              class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </router-link>
            
            <!-- Carrito -->
            <router-link 
              to="/carrito" 
              class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span 
                v-if="cartItemCount > 0" 
                class="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartItemCount > 9 ? '9+' : cartItemCount }}
              </span>
            </router-link>
            
            <!-- Menú móvil -->
            <button 
              @click="$emit('toggle-mobile-filters')"
              class="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <!-- Menú de categorías -->
      <div class="hidden md:flex items-center justify-center space-x-8 py-3 border-t border-gray-100">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="$emit('category-change', category)"
          :class="{
            'text-sm font-semibold uppercase tracking-wide transition-all': true,
            'text-gray-900 border-b-2 border-gray-900 pb-1': activeCategory === category,
            'text-gray-600 hover:text-gray-900': activeCategory !== category
          }"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Búsqueda móvil expandible -->
    <div 
      v-show="mobileSearchOpen"
      class="lg:hidden border-t border-gray-100 px-4 py-3 bg-gray-50"
    >
      <div class="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="$emit('search', searchQuery)"
          placeholder="Buscar productos..." 
          class="bg-transparent border-none focus:outline-none text-sm ml-3 w-full placeholder-gray-500"
          ref="mobileSearchInput"
        >
        <button 
          @click="toggleMobileSearch"
          class="text-gray-400 hover:text-gray-600 ml-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// Props
const props = defineProps({
  cartItemCount: {
    type: Number,
    default: 0
  },
  activeCategory: {
    type: String,
    default: 'Todos'
  }
});

// Emits
const emit = defineEmits(['search', 'category-change', 'toggle-mobile-filters']);

// Local state
const searchQuery = ref('');
const mobileSearchOpen = ref(false);
const mobileSearchInput = ref(null);

// Methods
const toggleMobileSearch = async () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
  if (mobileSearchOpen.value) {
    await nextTick();
    mobileSearchInput.value?.focus();
  }
};

// Keyboard shortcut for search (Command/Ctrl + K)
const handleKeyDown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault();
    // Focus search input or open mobile search
    if (window.innerWidth >= 1024) {
      document.querySelector('input[placeholder="Buscar productos..."]')?.focus();
    } else {
      toggleMobileSearch();
    }
  }
};

// Add keyboard listener
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', handleKeyDown);
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animación para el indicador de categoría activa */
.border-b-2 {
  transition: border-color 0.2s ease;
}

/* Estilo para el contador del carrito */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce-subtle {
  animation: bounce 0.8s ease;
}

/* Hover effects mejorados */
.hover\:bg-gray-50:hover {
  background-color: rgb(249 250 251);
}

.hover\:text-gray-900:hover {
  color: rgb(17 24 39);
}

/* Focus states */
.focus-within\:border-gray-900:focus-within {
  border-color: rgb(17 24 39);
}

.focus-within\:bg-white:focus-within {
  background-color: rgb(255 255 255);
}
</style>