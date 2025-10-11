<template>
  <div class="min-h-screen bg-[#F5F5F5] flex flex-col">
    <main class="flex-grow flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md bg-white shadow-lg overflow-hidden border border-[#E2E8F0]">
        <!-- Encabezado -->
        <div class="bg-[#1E3A34] p-8 text-center">
          <div class="relative">
            <div class="w-20 h-20 bg-white rounded flex items-center justify-center mx-auto mb-4 p-2">
              <img 
                src="../assets//DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.png" 
                alt="DRIP OUTDOOR Logo" 
                class="w-full h-full object-contain"
                @error="handleImageError"
              />
            </div>
            <h1 class="text-2xl font-bold text-white">Acceso Restringido</h1>
            <p class="text-[#C2B280] mt-2">Contenido exclusivo para miembros</p>
          </div>
        </div>
        <div class="p-8 text-center">
          <h2 class="text-xl font-semibold text-[#1E3A34] mb-3">Acceso Requerido</h2>
          <p class="text-[#5E5E5E] leading-relaxed">
            Esta área está reservada para usuarios registrados. Inicia sesión o crea una cuenta para acceder a todas las funcionalidades.
          </p>
          
          <div class="mt-8 space-y-4">
            <router-link 
              to="/login" 
              class="block w-full py-3.5 px-4 bg-[#1E3A34] hover:bg-[#2A4A40] text-white font-medium transition-all duration-300 shadow hover:shadow-lg"
            >
              Iniciar Sesión
            </router-link>
            
            <router-link 
              to="/register" 
              class="block w-full py-3.5 px-4 bg-white border-2 border-[#1E3A34] text-[#1E3A34] hover:bg-[#1E3A34] hover:text-white font-medium transition-all duration-300"
            >
              Crear Cuenta
            </router-link>
            
            <router-link 
              to="/" 
              class="block w-full py-3.5 px-4 text-[#5E5E5E] hover:text-[#1E3A34] font-medium transition-colors duration-300"
            >
              <span class="flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Inicio
              </span>
            </router-link>
          </div>

          <!-- Información Adicional -->
          <div class="mt-8 pt-6 border-t border-[#E2E8F0]">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="w-8 h-8 bg-[#4F7C63] flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p class="text-xs text-[#5E5E5E]">Seguro</p>
              </div>
              <div>
                <div class="w-8 h-8 bg-[#C2B280] flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-xs text-[#5E5E5E]">Comunidad</p>
              </div>
              <div>
                <div class="w-8 h-8 bg-[#E57C23] flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p class="text-xs text-[#5E5E5E]">Rápido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>