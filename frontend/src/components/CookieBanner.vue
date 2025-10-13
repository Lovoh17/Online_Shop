<script setup>
import { ref, onMounted } from 'vue';

const showBanner = ref(false);
const showSettings = ref(false);

// Preferencias de cookies
const cookiePreferences = ref({
  necessary: true, // Siempre activadas
  analytics: false,
  marketing: false,
  functional: false
});

// Verificar si ya se aceptaron las cookies
onMounted(() => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    showBanner.value = true;
  } else {
    // Cargar preferencias guardadas
    const saved = JSON.parse(consent);
    cookiePreferences.value = { ...cookiePreferences.value, ...saved };
    activateCookies(cookiePreferences.value);
  }
});

// Aceptar todas las cookies
const acceptAll = () => {
  cookiePreferences.value = {
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true
  };
  savePreferences();
  showBanner.value = false;
};

// Rechazar cookies opcionales
const rejectAll = () => {
  cookiePreferences.value = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  };
  savePreferences();
  showBanner.value = false;
};

// Guardar preferencias personalizadas
const saveCustomPreferences = () => {
  savePreferences();
  showSettings.value = false;
  showBanner.value = false;
};

// Guardar en localStorage
const savePreferences = () => {
  localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences.value));
  activateCookies(cookiePreferences.value);
};

// Activar cookies según preferencias
const activateCookies = (preferences) => {
  // Cookies necesarias (siempre activas)
  document.cookie = "session=active; path=/; max-age=86400; SameSite=Lax";
  
  // Cookies de análisis (Google Analytics, etc.)
  if (preferences.analytics) {
    console.log('Activando cookies de análisis...');
    // Ejemplo: Activar Google Analytics
    // window.gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  }
  
  // Cookies de marketing
  if (preferences.marketing) {
    console.log('Activando cookies de marketing...');
    // Ejemplo: Activar Facebook Pixel, Google Ads, etc.
  }
  
  // Cookies funcionales
  if (preferences.functional) {
    console.log('Activando cookies funcionales...');
    // Ejemplo: Preferencias de usuario, carrito, etc.
    document.cookie = "userPrefs=enabled; path=/; max-age=31536000; SameSite=Lax";
  }
};

// Abrir configuración de cookies
const openSettings = () => {
  showSettings.value = true;
};
</script>

<template>
  <!-- Banner de Cookies -->
  <Transition name="slide-up">
    <div 
      v-if="showBanner && !showSettings"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-[#1E3A34] shadow-2xl"
    >
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex-1">
            <div class="flex items-start mb-4">
              <svg class="h-8 w-8 text-[#1E3A34] mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <div>
                <h3 class="text-xl font-black text-[#1E3A34] mb-2 tracking-tight">
                  CONFIGURACIÓN DE COOKIES
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia de navegación, personalizar contenido y anuncios, 
                  proporcionar funciones de redes sociales y analizar nuestro tráfico. 
                  <router-link to="/privacidad" class="text-[#4F7C63] underline hover:text-[#1E3A34]">
                    Más información
                  </router-link>
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              @click="openSettings"
              class="px-6 py-3 border-2 border-[#1E3A34] text-[#1E3A34] font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              CONFIGURAR
            </button>
            <button
              @click="rejectAll"
              class="px-6 py-3 border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              RECHAZAR
            </button>
            <button
              @click="acceptAll"
              class="px-6 py-3 bg-[#1E3A34] text-white font-bold hover:bg-[#4F7C63] transition-colors whitespace-nowrap"
            >
              ACEPTAR TODO
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Panel de Configuración Detallada -->
  <Transition name="slide-up">
    <div 
      v-if="showSettings"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-[#1E3A34] shadow-2xl max-h-[80vh] overflow-y-auto"
    >
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-2xl font-black text-[#1E3A34] mb-2 tracking-tight">
                PREFERENCIAS DE COOKIES
              </h3>
              <p class="text-gray-600">
                Personaliza qué tipos de cookies deseas permitir
              </p>
            </div>
            <button
              @click="showSettings = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- Cookies Necesarias -->
            <div class="border-l-4 border-[#1E3A34] bg-gray-50 p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-[#1E3A34] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 class="font-black text-[#1E3A34]">COOKIES NECESARIAS</h4>
                    <p class="text-sm text-gray-600">Siempre activas</p>
                  </div>
                </div>
                <div class="w-12 h-6 bg-[#1E3A34] flex items-center justify-end px-1">
                  <div class="w-4 h-4 bg-white"></div>
                </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                Estas cookies son esenciales para el funcionamiento básico del sitio web. 
                Incluyen cookies de sesión, seguridad y accesibilidad.
              </p>
            </div>

            <!-- Cookies de Análisis -->
            <div class="border-l-4 border-[#4F7C63] bg-gray-50 p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-[#4F7C63] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <h4 class="font-black text-[#1E3A34]">COOKIES DE ANÁLISIS</h4>
                    <p class="text-sm text-gray-600">Opcional</p>
                  </div>
                </div>
                <label class="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="cookiePreferences.analytics"
                    class="sr-only peer"
                  >
                  <div class="w-12 h-6 bg-gray-300 peer-checked:bg-[#4F7C63] transition-colors flex items-center peer-checked:justify-end justify-start px-1">
                    <div class="w-4 h-4 bg-white"></div>
                  </div>
                </label>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio 
                recopilando y reportando información de forma anónima (Google Analytics, etc.).
              </p>
            </div>

            <!-- Cookies de Marketing -->
            <div class="border-l-4 border-[#C2B280] bg-gray-50 p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-[#C2B280] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <div>
                    <h4 class="font-black text-[#1E3A34]">COOKIES DE MARKETING</h4>
                    <p class="text-sm text-gray-600">Opcional</p>
                  </div>
                </div>
                <label class="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="cookiePreferences.marketing"
                    class="sr-only peer"
                  >
                  <div class="w-12 h-6 bg-gray-300 peer-checked:bg-[#C2B280] transition-colors flex items-center peer-checked:justify-end justify-start px-1">
                    <div class="w-4 h-4 bg-white"></div>
                  </div>
                </label>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                Estas cookies se utilizan para rastrear visitantes en sitios web y mostrar anuncios 
                relevantes y atractivos para el usuario individual (Facebook Pixel, Google Ads).
              </p>
            </div>

            <!-- Cookies Funcionales -->
            <div class="border-l-4 border-[#E57C23] bg-gray-50 p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <svg class="h-6 w-6 text-[#E57C23] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 class="font-black text-[#1E3A34]">COOKIES FUNCIONALES</h4>
                    <p class="text-sm text-gray-600">Opcional</p>
                  </div>
                </div>
                <label class="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="cookiePreferences.functional"
                    class="sr-only peer"
                  >
                  <div class="w-12 h-6 bg-gray-300 peer-checked:bg-[#E57C23] transition-colors flex items-center peer-checked:justify-end justify-start px-1">
                    <div class="w-4 h-4 bg-white"></div>
                  </div>
                </label>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                Estas cookies permiten funcionalidades mejoradas y personalizadas, como recordar 
                preferencias de idioma, región, carrito de compras y configuraciones personalizadas.
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t-2 border-gray-200">
            <button
              @click="showSettings = false; showBanner = true"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              CANCELAR
            </button>
            <button
              @click="saveCustomPreferences"
              class="flex-1 px-6 py-3 bg-[#1E3A34] text-white font-bold hover:bg-[#4F7C63] transition-colors"
            >
              GUARDAR PREFERENCIAS
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Ocultar checkbox visualmente pero mantener accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>