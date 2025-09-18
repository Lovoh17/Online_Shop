<template>
  <header class="bg-white sticky top-0 z-50 border-b border-gray-100">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link 
            to="/" 
            class="text-2xl font-black text-gray-900 tracking-tight hover:text-black transition-colors"
          >
            DRIPP-SHOP
          </router-link>
        </div>
        
        <!-- Navegación de autenticación -->
        <nav class="flex items-center space-x-4">
          <!-- Botón de Login -->
          <router-link 
            to="/login" 
            class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
            :class="{ 
              'text-gray-900 bg-gray-100': $route.path === '/login',
              'text-gray-700': $route.path !== '/login'
            }"
          >
            Iniciar Sesión
          </router-link>
          
          <!-- Separador -->
          <div class="w-px h-6 bg-gray-300"></div>
          
          <!-- Botón de Register -->
          <router-link 
            to="/register" 
            class="px-4 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-all"
            :class="{ 
              'bg-gray-800': $route.path === '/register'
            }"
          >
            Crear Cuenta
          </router-link>
          
          <!-- Botón back to shop (opcional) -->
          <router-link 
            to="/" 
            class="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all ml-2"
            title="Volver a la tienda"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
          </router-link>
          
          <!-- Menú móvil para pantallas pequeñas -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              :class="{ 'rotate-90': mobileMenuOpen }"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <!-- Menú móvil desplegable -->
    <div 
      v-show="mobileMenuOpen"
      class="md:hidden border-t border-gray-100 bg-white"
    >
      <div class="px-4 py-3 space-y-2">
        <router-link 
          to="/login" 
          @click="mobileMenuOpen = false"
          class="block w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
          :class="{ 
            'text-gray-900 bg-gray-100': $route.path === '/login'
          }"
        >
          Iniciar Sesión
        </router-link>
        
        <router-link 
          to="/register" 
          @click="mobileMenuOpen = false"
          class="block w-full text-left px-4 py-3 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-all"
          :class="{ 
            'bg-gray-800': $route.path === '/register'
          }"
        >
          Crear Cuenta
        </router-link>
        
        <div class="border-t border-gray-100 pt-2 mt-3">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
          >
            ← Volver a la tienda
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Local state
const mobileMenuOpen = ref(false);

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Close mobile menu when clicking outside (optional)
const handleClickOutside = (event) => {
  if (mobileMenuOpen.value && !event.target.closest('header')) {
    mobileMenuOpen.value = false;
  }
};

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside);
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Animación para el icono del menú móvil */
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

/* Hover effects */
.hover\:bg-gray-50:hover {
  background-color: rgb(249 250 251);
}

.hover\:text-gray-900:hover {
  color: rgb(17 24 39);
}

.hover\:bg-gray-800:hover {
  background-color: rgb(31 41 55);
}

/* Animación suave para el menú móvil */
.md\:hidden {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estado activo mejorado */
.bg-gray-100 {
  background-color: rgb(243 244 246);
}

.bg-gray-900 {
  background-color: rgb(17 24 39);
}

/* Separador vertical */
.w-px {
  width: 1px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>