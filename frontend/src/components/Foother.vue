<template>
  <footer class="relative text-white py-12 overflow-hidden">
    <!-- Imagen de fondo con overlay -->
    <div class="absolute inset-0 z-0">
      <img 
        src="../assets/footherbakgrauns.png" 
        alt="Background" 
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-[#0F2A22]/90 backdrop-blur-none"></div>
    </div>
    
    <!-- Contenido -->
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo y Descripción -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <img src="../assets/logo-Naranja.png" alt="DRIP OUTDOOR" class="min-h-20 min-w-20">
            <span class="text-white font-black text-xl tracking-tight">DRIP OUTDOOR</span>
          </div>
          <p class="text-sm text-white/70">
            Equipamiento premium para aventureros urbanos y exploradores de la naturaleza.
          </p>
        </div>

        <!-- Enlaces Rápidos -->
        <div>
          <h3 class="font-bold text-lg mb-4">Explorar</h3>
          <ul class="space-y-2 text-sm text-white/70">
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Colección 2025</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Nuevos Lanzamientos</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Ofertas Especiales</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Guías de Tallas</a></li>
          </ul>
        </div>

        <!-- Soporte -->
        <div>
          <h3 class="font-bold text-lg mb-4">Soporte</h3>
          <ul class="space-y-2 text-sm text-white/70">
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Contacto</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Envíos y Devoluciones</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#" class="hover:text-[#C2B280] transition-colors">Garantías</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="font-bold text-lg mb-4">Newsletter</h3>
          <p class="text-sm text-white/70 mb-4">Recibe novedades y ofertas exclusivas</p>
          <div class="flex">
            <input 
              type="email" 
              placeholder="Tu email" 
              class="px-4 py-2 w-full bg-white/20 border border-[#C2B280] text-white placeholder-white/50 focus:outline-none rounded-l-lg backdrop-blur-sm"
            >
            <button class="bg-[#C2B280] text-[#1E3A34] px-4 py-2 font-bold hover:bg-white transition-colors rounded-r-lg">
              →
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/50">
        <p>&copy; 2025 DRIP OUTDOOR. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>