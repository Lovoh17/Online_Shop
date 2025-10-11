<template>
  <!-- Navbar Mejorado -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
    <div class="container mx-auto px-4 h-20 flex items-center justify-center">
      <!-- Menu completo centrado -->
      <div class="hidden lg:flex items-center justify-center space-x-12">
        <router-link 
          to="/products"
          class="text-[#1E3A34] font-semibold text-sm uppercase tracking-wide hover:text-[#C2B280] transition-colors"
        >
          Shop All
        </router-link>
        <a 
          href="/products-Mens"
          class="text-[#1E3A34] font-semibold text-sm uppercase tracking-wide hover:text-[#C2B280] transition-colors"
        >
          Men's
        </a>
        <a 
          href="#"
          class="text-[#1E3A34] font-semibold text-sm uppercase tracking-wide hover:text-[#C2B280] transition-colors"
        >
          Women's
        </a>

        <!-- Logo Centro - Destacado -->
        <div class="flex items-center justify-center px-12 py-2 border-l border-r border-[#E5E5E5]">
          <img src="../assets/Gemini_Generated_Image_yjx0cbyjx0cbyjx0-removebg-preview.png" alt="DRIP OUTDOOR" class="h-14 w-14">
        </div>

        <a 
          href="#"
          class="text-[#1E3A34] font-semibold text-sm uppercase tracking-wide hover:text-[#C2B280] transition-colors"
        >
          By Activity
        </a>
        <a 
          href="#"
          class="text-[#1E3A34] font-semibold text-sm uppercase tracking-wide hover:text-[#C2B280] transition-colors"
        >
          News
        </a>
        <a 
          href="#"
          class="text-[#E57C23] font-semibold text-sm uppercase tracking-wide hover:text-[#1E3A34] transition-colors"
        >
          Sale
        </a>
      </div>

      <!-- Iconos Derecha (siempre visibles) -->
      <div class="absolute right-4 flex items-center space-x-6">
        <!-- Search -->
        <button class="text-[#1E3A34] hover:text-[#C2B280] transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- User -->
        <router-link 
          to="/login"
          class="text-[#1E3A34] hover:text-[#C2B280] transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </router-link>

        <!-- Cart -->
        <router-link 
          to="/carrito"
          class="text-[#1E3A34] hover:text-[#C2B280] transition-colors relative"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </router-link>

        <!-- Mobile Menu Button -->
        <button class="lg:hidden text-[#1E3A34] hover:text-[#C2B280] transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Logo para móvil (centrado) -->
      <div class="lg:hidden flex items-center space-x-2">
        <img src="../assets/logo-drip-outdoor.svg" alt="DRIP OUTDOOR" class="h-8 w-8">
        <span class="text-[#1E3A34] font-black text-lg tracking-tight">DRIP</span>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative h-screen overflow-hidden bg-gradient-to-br from-[#1E3A34] to-[#2D5A4B]">
    <div class="absolute inset-0 z-0">
      <video 
        autoplay 
        muted 
        loop 
        class="w-full h-full object-cover"
        poster="../assets/hero-poster.jpg"
      >
        <source src="../assets/brands/envato_video_gen_Oct_11_2025_18_30_38.mp4" type="video/mp4">
      </video>
    </div>

    <!-- Hero Content -->
    <div class="relative z-20 h-full flex items-center justify-center text-center px-4">
      <div class="max-w-4xl">
        <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white uppercase">
          Vive la <span class="text-[#C2B280]">Aventura</span>
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
          Equipamiento premium para quienes desafían los límites. Donde la naturaleza encuentra su estilo.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link 
            to="/products"
            class="bg-[#C2B280] text-[#1E3A34] font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-[#D8C69E] transition-all duration-300 transform hover:scale-105 rounded-lg shadow-lg"
          >
            Descubrir Colección
          </router-link>
          <a 
            href="#aventuras"
            class="border-2 border-white text-white font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-white hover:text-[#1E3A34] transition-all duration-300 rounded-lg"
          >
            Nuestras Aventuras
          </a>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div class="animate-bounce">
        <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>

  <!-- Sección Identidad de Marca -->
  <section id="nosotros" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Imagen -->
        <div class="relative">
          <div class="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="../assets/Rafa_Note_20_-_2025-10-11_18.36.54-removebg-preview.png" 
              alt="Identidad DRIP OUTDOOR"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="absolute -bottom-6 -right-6 w-48 h-48 bg-[#C2B280] rounded-2xl -z-10"></div>
        </div>

        <!-- Contenido -->
        <div class="space-y-6">
          <h2 class="text-5xl font-black text-[#1E3A34] tracking-tight">
            Más que <span class="text-[#C2B280]">ropa</span>, una <span class="text-[#E57C23]">actitud</span>
          </h2>
          <p class="text-lg text-[#5E5E5E] leading-relaxed">
            En DRIP OUTDOOR fusionamos el rendimiento técnico con el diseño urbano. Creemos que la aventura no tiene horarios y que el equipamiento debe acompañarte desde la montaña hasta la ciudad.
          </p>
          
          <div class="grid grid-cols-2 gap-6 pt-6">
            <div class="space-y-2">
              <div class="w-12 h-12 bg-[#1E3A34] rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="font-bold text-[#1E3A34]">Rendimiento</h3>
              <p class="text-sm text-[#5E5E5E]">Tecnología outdoor de alto nivel</p>
            </div>
            
            <div class="space-y-2">
              <div class="w-12 h-12 bg-[#C2B280] rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-[#1E3A34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="font-bold text-[#1E3A34]">Estilo</h3>
              <p class="text-sm text-[#5E5E5E]">Diseño que trasciende lo convencional</p>
            </div>
            
            <div class="space-y-2">
              <div class="w-12 h-12 bg-[#E57C23] rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 class="font-bold text-[#1E3A34]">Sostenibilidad</h3>
              <p class="text-sm text-[#5E5E5E]">Comprometidos con el planeta</p>
            </div>
            
            <div class="space-y-2">
              <div class="w-12 h-12 bg-[#4F7C63] rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="font-bold text-[#1E3A34]">Comunidad</h3>
              <p class="text-sm text-[#5E5E5E]">Unidos por la pasión outdoor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sección Colección Destacada -->
  <section id="coleccion" class="py-20 bg-[#F8F5F0]">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-black text-[#1E3A34] mb-4 tracking-tight">COLECCIÓN <span class="text-[#E57C23]">2025</span></h2>
        <p class="text-xl text-[#5E5E5E] max-w-2xl mx-auto">
          Diseñada para los exploradores urbanos, los aventureros de fin de semana y los amantes de la naturaleza.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Producto 1 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
          <div class="aspect-[4/5] overflow-hidden">
            <img 
              src="../assets/termica.png" 
              alt="Chaquetas Térmicas"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            >
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-2xl font-black mb-2">TECHWEAR</h3>
            <p class="text-sm opacity-90">Rendimiento extremo, estilo urbano</p>
            <button class="mt-4 bg-[#C2B280] text-[#1E3A34] px-6 py-2 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors rounded-lg">
              Explorar
            </button>
          </div>
        </div>

        <!-- Producto 2 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
          <div class="aspect-[4/5] overflow-hidden">
            <img 
              src="../assets/equipamiento.jpg" 
              alt="Equipamento Montaña"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            >
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-2xl font-black mb-2">ALTA MONTAÑA</h3>
            <p class="text-sm opacity-90">Para los que buscan las cumbres</p>
            <button class="mt-4 bg-[#C2B280] text-[#1E3A34] px-6 py-2 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors rounded-lg">
              Explorar
            </button>
          </div>
        </div>

        <!-- Producto 3 -->
        <div class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
          <div class="aspect-[4/5] overflow-hidden">
            <img 
              src="../assets/accesorios.jpg" 
              alt="Accesorios Outdoor"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            >
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 class="text-2xl font-black mb-2">URBAN EXPLORER</h3>
            <p class="text-sm opacity-90">De la ciudad a la naturaleza</p>
            <button class="mt-4 bg-[#C2B280] text-[#1E3A34] px-6 py-2 font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors rounded-lg">
              Explorar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sección Aventuras -->
  <section id="aventuras" class="py-20 bg-[#1E3A34] text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-black mb-4 tracking-tight">NUESTRAS <span class="text-[#C2B280]">AVENTURAS</span></h2>
        <p class="text-xl text-white/80 max-w-2xl mx-auto">
          Conoce las historias de nuestra comunidad y descubre nuevos destinos.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Galería -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <div class="aspect-square rounded-2xl overflow-hidden">
              <img src="../assets/brands/envato_video_gen_Oct_11_2025_18_23_35.mp4" alt="Aventura Montaña" class="w-full h-full object-cover hover:scale-110 transition-transform duration-700">
            </div>
            <div class="aspect-video rounded-2xl overflow-hidden">
              <img src="../assets/adventure-2.jpg" alt="Camping" class="w-full h-full object-cover hover:scale-110 transition-transform duration-700">
            </div>
          </div>
          <div class="space-y-4 pt-8">
            <div class="aspect-video rounded-2xl overflow-hidden">
              <img src="../assets/adventure-3.jpg" alt="Escalada" class="w-full h-full object-cover hover:scale-110 transition-transform duration-700">
            </div>
            <div class="aspect-square rounded-2xl overflow-hidden">
              <img src="../assets/adventure-4.jpg" alt="Senderismo" class="w-full h-full object-cover hover:scale-110 transition-transform duration-700">
            </div>
          </div>
        </div>

        <!-- Contenido -->
        <div class="space-y-6">
          <h3 class="text-4xl font-black">Explora. Descubre. <span class="text-[#E57C23]">Vive.</span></h3>
          <p class="text-lg leading-relaxed text-white/80">
            Cada producto DRIP OUTDOOR está diseñado para acompañarte en tus aventuras. Desde las montañas más altas hasta los senderos urbanos, nuestra comunidad comparte una pasión común: explorar el mundo con estilo y propósito.
          </p>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-[#C2B280] rounded-full"></div>
              <span class="font-semibold">Expediciones organizadas</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-[#C2B280] rounded-full"></div>
              <span class="font-semibold">Comunidad global de aventureros</span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-[#C2B280] rounded-full"></div>
              <span class="font-semibold">Guías y recursos exclusivos</span>
            </div>
          </div>

          <button class="bg-[#C2B280] text-[#1E3A34] font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-white transition-all duration-300 transform hover:scale-105 rounded-lg">
            Unirse a la Comunidad
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Sección Marcas -->
  <section id="marcas" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-black text-[#1E3A34] mb-4 tracking-tight">MARCAS <span class="text-[#E57C23]">RECONOCIDAS</span></h2>
        <p class="text-xl text-[#5E5E5E] max-w-2xl mx-auto">
          Trabajamos con los líderes en equipamiento outdoor para ofrecerte lo mejor.
        </p>
      </div>

      <!-- Carrusel de Marcas Mejorado -->
      <div class="relative">
        <div class="overflow-hidden py-8">
          <div class="flex animate-scroll space-x-12">
            <div 
              v-for="(brand, index) in brands" 
              :key="index"
              class="flex-none w-48 h-24 flex items-center justify-center bg-white border border-[#E5E5E5] rounded-lg hover:shadow-lg transition-all duration-300 p-4"
            >
              <img 
                :src="brand.logo" 
                :alt="brand.name"
                class="max-h-16 max-w-full object-contain"
                @error="handleBrandImageError(brand.name)"
              />
            </div>
            <!-- Duplicado para efecto infinito -->
            <div 
              v-for="(brand, index) in brands" 
              :key="index + brands.length"
              class="flex-none w-48 h-24 flex items-center justify-center bg-white border border-[#E5E5E5] rounded-lg hover:shadow-lg transition-all duration-300 p-4"
            >
              <img 
                :src="brand.logo" 
                :alt="brand.name"
                class="max-h-16 max-w-full object-contain"
                @error="handleBrandImageError(brand.name)"
              />
            </div>
          </div>
        </div>
        
        <!-- Overlay sólidos -->
        <div class="absolute left-0 top-0 w-16 h-full bg-white z-10"></div>
        <div class="absolute right-0 top-0 w-16 h-full bg-white z-10"></div>
      </div>
    </div>
  </section>

  <!-- CTA Final -->
  <section class="py-20 bg-gradient-to-br from-[#1E3A34] to-[#2D5A4B] text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-5xl font-black mb-6 tracking-tight">¿LISTO PARA LA <span class="text-[#C2B280]">AVENTURA</span>?</h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto text-white/90">
        Únete a miles de exploradores que ya confían en DRIP OUTDOOR para sus aventuras.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link 
          to="/productos"
          class="bg-[#C2B280] text-[#1E3A34] font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300 rounded-lg shadow-lg"
        >
          Comprar Ahora
        </router-link>
        <a 
          href="#"
          class="border-2 border-white text-white font-bold px-8 py-4 text-lg uppercase tracking-wider hover:bg-white hover:text-[#1E3A34] transition-all duration-300 rounded-lg"
        >
          Contactar Asesor
        </a>
      </div>
    </div>
  </section>


</template>

<script setup>
import { ref } from 'vue';

// Marcas para el carrusel
const brands = ref([
  { name: 'Columbia', logo: new URL('../assets/brands/logo_columbia.jpg', import.meta.url).href },
  { name: 'The North Face', logo: new URL('../assets/brands/The-North-Face-Logo.png', import.meta.url).href },
  { name: 'Free Country', logo: new URL('../assets/brands/Free_Country_logoBlack_Logo.jpg', import.meta.url).href },
  { name: 'Bimimi Bay', logo: new URL('../assets/brands/bimini_bay_logo_1edb5d13-23e4-4ca1-90d9-376fc602add9_140x@2x.avif', import.meta.url).href },
  { name: 'Patagonia', logo: new URL('../assets/brands/OIP.webp', import.meta.url).href },
  { name: 'Marmot', logo: new URL('../assets/brands/marmot-logo.jpg', import.meta.url).href },
]);

const handleBrandImageError = (brandName) => {
  console.error(`Error cargando logo de ${brandName}`);
};
</script>

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
  animation: scroll 40s linear infinite;
  display: flex;
  width: max-content;
}

.animate-scroll:hover {
  animation-play-state: paused;
}

/* Smooth scrolling para anchor links */
html {
  scroll-behavior: smooth;
}

/* Efectos de hover mejorados */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>