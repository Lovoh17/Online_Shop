<template>
  <nav class="bg-white border-b border-[#D8C69E] sticky top-0 z-50">
    <!-- Main Navigation -->
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 r from-[#1E3A34] to-[#4F7C63] rounded-lg flex items-center justify-center" style="height: 70px; width: 70px; margin-left: -10px; margin-right: 10px;">
              <img src="../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.svg">
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black text-[#1E3A34] tracking-tight">DRIP</span>
              <span class="text-sm font-medium text-[#4F7C63] -mt-1 tracking-wider">OUTDOOR</span>
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden lg:flex items-center space-x-8" style="margin-left: 10px;">
          <router-link 
            to="/productos?etiqueta=nuevo" 
            class="font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Nuevo
          </router-link>
          
          <!-- Hombres Dropdown -->
          <div class="relative group">
            <button class="font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide flex items-center">
              Hombres
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white border border-[#D8C69E] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div class="py-2">
                <router-link 
                  to="/productos/categoria/Camisas Hombre" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Camisas
                </router-link>
                <router-link 
                  to="/productos/categoria/Chaquetas Hombre" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Chaquetas
                </router-link>
                <router-link 
                  to="/productos/categoria/Pantalones Hombre" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Pantalones
                </router-link>
                <router-link 
                  to="/productos/categoria/Calzado Hombre" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Calzado
                </router-link>
                <router-link 
                  to="/productos/categoria/Accesorios Hombre" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Accesorios
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Mujeres Dropdown -->
          <div class="relative group">
            <button class="font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide flex items-center">
              Mujeres
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white border border-[#D8C69E] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div class="py-2">
                <router-link 
                  to="/productos/categoria/Camisas Mujer" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Camisas
                </router-link>
                <router-link 
                  to="/productos/categoria/Chaquetas Mujer" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Chaquetas
                </router-link>
                <router-link 
                  to="/productos/categoria/Pantalones Mujer" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Pantalones
                </router-link>
                <router-link 
                  to="/productos/categoria/Calzado Mujer" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Calzado
                </router-link>
                <router-link 
                  to="/productos/categoria/Accesorios Mujer" 
                  class="block px-4 py-2 text-sm text-[#5E5E5E] hover:bg-[#F5F5F5] hover:text-[#1E3A34]"
                >
                  Accesorios
                </router-link>
              </div>
            </div>
          </div>
          
          <router-link 
            to="/productos?genero=ninos" 
            class="font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Niños
          </router-link>
          <router-link 
            to="/productos?etiqueta=equipamiento" 
            class="font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Equipamiento
          </router-link>
          <router-link 
            to="/productos?descuento=true" 
            class="font-semibold text-[#E57C23] hover:text-[#1E3A34] transition-colors text-sm uppercase tracking-wide"
          >
            Ofertas
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="Buscar productos..." 
              class="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] border border-[#D8C69E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-[#1E3A34] text-sm"
            >
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search Icon Mobile -->
          <button @click="toggleMobileSearch" class="md:hidden text-[#1E3A34]">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <!-- Account -->
          <router-link to="/perfil" class="text-[#1E3A34] hover:text-[#4F7C63] transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </router-link>
          
          <!-- Wishlist -->
          <router-link to="/wishlist" class="text-[#1E3A34] hover:text-[#4F7C63] transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </router-link>
          
          <!-- Cart -->
          <router-link to="/carrito" class="text-[#1E3A34] hover:text-[#4F7C63] transition-colors relative">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-[#E57C23] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ cartItemCount }}
            </span>
          </router-link>
          
          <!-- Mobile Menu -->
          <button @click="toggleMobileMenu" class="lg:hidden text-[#1E3A34]">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Search -->
    <div v-if="mobileSearchOpen" class="md:hidden px-4 pb-4">
      <div class="relative">
        <input 
          ref="mobileSearchInput"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Buscar productos..." 
          class="w-full pl-10 pr-4 py-2 bg-[#F5F5F5] border border-[#D8C69E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A34] focus:border-[#1E3A34] text-sm"
        >
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-[#D8C69E]">
      <div class="container mx-auto px-4 py-4">
        <div class="space-y-4">
          <router-link 
            to="/productos?etiqueta=nuevo" 
            @click="closeMobileMenu"
            class="block font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Nuevo
          </router-link>
          
          <!-- Mobile Hombres -->
          <div>
            <button 
              @click="toggleMobileCategory('hombres')"
              class="w-full flex justify-between items-center font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
            >
              Hombres
              <svg 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': mobileCategoryOpen === 'hombres' }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="mobileCategoryOpen === 'hombres'" class="mt-2 ml-4 space-y-2">
              <router-link 
                to="/productos/categoria/Camisas Hombre" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Camisas
              </router-link>
              <router-link 
                to="/productos/categoria/Chaquetas Hombre" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Chaquetas
              </router-link>
              <router-link 
                to="/productos/categoria/Pantalones Hombre" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Pantalones
              </router-link>
              <router-link 
                to="/productos/categoria/Calzado Hombre" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Calzado
              </router-link>
              <router-link 
                to="/productos/categoria/Accesorios Hombre" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Accesorios
              </router-link>
            </div>
          </div>

          <!-- Mobile Mujeres -->
          <div>
            <button 
              @click="toggleMobileCategory('mujeres')"
              class="w-full flex justify-between items-center font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
            >
              Mujeres
              <svg 
                class="w-4 h-4 transition-transform" 
                :class="{ 'rotate-180': mobileCategoryOpen === 'mujeres' }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="mobileCategoryOpen === 'mujeres'" class="mt-2 ml-4 space-y-2">
              <router-link 
                to="/productos/categoria/Camisas Mujer" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Camisas
              </router-link>
              <router-link 
                to="/productos/categoria/Chaquetas Mujer" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Chaquetas
              </router-link>
              <router-link 
                to="/productos/categoria/Pantalones Mujer" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Pantalones
              </router-link>
              <router-link 
                to="/productos/categoria/Calzado Mujer" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Calzado
              </router-link>
              <router-link 
                to="/productos/categoria/Accesorios Mujer" 
                @click="closeMobileMenu"
                class="block text-sm text-[#5E5E5E] hover:text-[#1E3A34]"
              >
                Accesorios
              </router-link>
            </div>
          </div>

          <router-link 
            to="/productos?genero=ninos" 
            @click="closeMobileMenu"
            class="block font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Niños
          </router-link>
          <router-link 
            to="/productos?etiqueta=equipamiento" 
            @click="closeMobileMenu"
            class="block font-semibold text-[#1E3A34] hover:text-[#4F7C63] transition-colors text-sm uppercase tracking-wide"
          >
            Equipamiento
          </router-link>
          <router-link 
            to="/productos?descuento=true" 
            @click="closeMobileMenu"
            class="block font-semibold text-[#E57C23] hover:text-[#1E3A34] transition-colors text-sm uppercase tracking-wide"
          >
            Ofertas
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  cartItemCount: {
    type: Number,
    default: 0
  }
});

// Router
const router = useRouter();

// Local state
const searchQuery = ref('');
const mobileSearchOpen = ref(false);
const mobileSearchInput = ref(null);
const mobileMenuOpen = ref(false);
const mobileCategoryOpen = ref(null);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/productos?search=${encodeURIComponent(searchQuery.value.trim())}`);
    mobileSearchOpen.value = false;
  }
};

const toggleMobileSearch = async () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
  if (mobileSearchOpen.value) {
    await nextTick();
    mobileSearchInput.value?.focus();
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) {
    mobileCategoryOpen.value = null;
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  mobileCategoryOpen.value = null;
};

const toggleMobileCategory = (category) => {
  mobileCategoryOpen.value = mobileCategoryOpen.value === category ? null : category;
};

// Keyboard shortcut for search (Command/Ctrl + K)
const handleKeyDown = (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault();
    if (window.innerWidth >= 768) {
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

.rotate-180 {
  transform: rotate(180deg);
}
</style>