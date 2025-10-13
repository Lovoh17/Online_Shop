<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-[#1E3A34] mb-6">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-[#1E3A34] mb-6 tracking-tight">
          POLÍTICA DE DEVOLUCIONES
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Tu satisfacción es nuestra prioridad. Conoce nuestro proceso fácil y transparente para devoluciones y cambios.
        </p>
        <div class="mt-8 flex justify-center gap-4 flex-wrap">
          <div class="bg-white border-2 border-[#D8C69E] px-6 py-3">
            <p class="text-sm font-semibold text-[#1E3A34]">
              Período de devolución: <span class="text-[#4F7C63]">30 días</span>
            </p>
          </div>
          <div class="bg-white border-2 border-[#4F7C63] px-6 py-3">
            <p class="text-sm font-semibold text-[#1E3A34]">
              Envío: <span class="text-[#4F7C63]">Gratuito en devoluciones</span>
            </p>
          </div>
          <div class="bg-white border-2 border-[#E57C23] px-6 py-3">
            <p class="text-sm font-semibold text-[#1E3A34]">
              Reembolso: <span class="text-[#E57C23]">5-7 días hábiles</span>
            </p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white border border-[#D8C69E] shadow-sm sticky top-32">
            <div class="p-6">
              <h3 class="font-bold text-[#1E3A34] mb-4 text-lg">Contenido</h3>
              <nav class="space-y-2">
                <a 
                  v-for="section in sections" 
                  :key="section.id"
                  :href="`#${section.id}`"
                  @click.prevent="scrollToSection(section.id)"
                  class="block py-2 px-3 text-sm text-gray-600 hover:text-[#1E3A34] hover:bg-[#F8F6F0] transition-colors cursor-pointer"
                  :class="{ 'text-[#1E3A34] bg-[#F8F6F0] font-semibold': activeSection === section.id }"
                >
                  {{ section.title }}
                </a>
              </nav>
            </div>
          </div>
          <div class="bg-[#1E3A34] p-6 mt-6 text-white">
            <h4 class="font-bold text-lg mb-3">¿Necesitas ayuda?</h4>
            <p class="text-sm text-white/80 mb-4">
              Nuestro equipo de servicio al cliente está aquí para ayudarte.
            </p>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span class="text-sm">+1 (800) DRIP-123</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-white/20 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-sm">returns@dripoutdoor.com</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3">
          <div class="bg-white border border-[#D8C69E] shadow-sm overflow-hidden">
            <div class="p-8 space-y-12">
              <section id="overview" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Resumen de la Política
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    En <strong>DRIP OUTDOOR</strong>, nos esforzamos por garantizar tu completa satisfacción con cada compra. Si no estás completamente satisfecho con tu pedido, aceptamos devoluciones y cambios dentro de los <strong>30 días</strong> posteriores a la recepción de tu pedido.
                  </p>
                  
                  <div class="grid md:grid-cols-3 gap-6 mt-8">
                    <div class="text-center p-6 bg-[#F8F6F0] border-2 border-[#D8C69E]">
                      <div class="w-12 h-12 bg-[#1E3A34] text-white flex items-center justify-center mx-auto mb-3">
                        <span class="text-lg font-bold">30</span>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Días para Devolver</h4>
                      <p class="text-sm text-gray-600">Desde la recepción de tu pedido</p>
                    </div>
                    <div class="text-center p-6 bg-[#F0F7F4] border-2 border-[#4F7C63]">
                      <div class="w-12 h-12 bg-[#4F7C63] text-white flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Fácil Proceso</h4>
                      <p class="text-sm text-gray-600">Solicitud online en minutos</p>
                    </div>
                    <div class="text-center p-6 bg-[#FEF2E8] border-2 border-[#E57C23]">
                      <div class="w-12 h-12 bg-[#E57C23] text-white flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Reembolso Rápido</h4>
                      <p class="text-sm text-gray-600">5-7 días hábiles</p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="eligibility" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Elegibilidad para Devoluciones
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Para que tu devolución sea aceptada, el producto debe cumplir con los siguientes requisitos:
                  </p>

                  <div class="grid gap-4 mt-6">
                    <div class="flex items-start space-x-4 p-4 bg-green-50 border-2 border-green-200">
                      <div class="w-6 h-6 bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-green-800">Producto en estado original</p>
                        <p class="text-sm text-green-700">Sin usar, con etiquetas y en empaque original</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4 p-4 bg-green-50 border-2 border-green-200">
                      <div class="w-6 h-6 bg-green-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-green-800">Dentro del período</p>
                        <p class="text-sm text-green-700">30 días desde la recepción del pedido</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 bg-red-50 border-2 border-red-200">
                      <div class="w-6 h-6 bg-red-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-red-800">Productos no retornables</p>
                        <p class="text-sm text-red-700">Ropa interior, productos personalizados y artículos de venta final</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="process" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Proceso de Devolución Paso a Paso
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <div class="space-y-8">
                    <div class="flex items-start space-x-6">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-[#1E3A34] text-white flex items-center justify-center font-bold text-lg">
                          1
                        </div>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-xl font-bold text-[#1E3A34] mb-2">Inicia tu Solicitud</h4>
                        <p class="text-gray-700 mb-3">
                          Accede a tu cuenta en nuestro sitio web y ve a la sección "Mis Pedidos". Selecciona el producto que deseas devolver y completa el formulario de devolución.
                        </p>
                        <div class="bg-[#F8F6F0] p-4 border-l-4 border-[#C2B280]">
                          <p class="text-sm font-semibold text-[#1E3A34] mb-2">Información requerida:</p>
                          <ul class="text-sm text-gray-600 space-y-1">
                            <li>• Número de orden</li>
                            <li>• Producto(s) a devolver</li>
                            <li>• Razón de la devolución</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-start space-x-6">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-[#4F7C63] text-white flex items-center justify-center font-bold text-lg">
                          2
                        </div>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-xl font-bold text-[#1E3A34] mb-2">Prepara tu Paquete</h4>
                        <p class="text-gray-700 mb-3">
                          Incluye todos los artículos en su empaque original con etiquetas adjuntas. Asegúrate de incluir la factura de compra y el formulario de devolución impreso.
                        </p>
                        <div class="bg-[#F0F7F4] p-4 border-l-4 border-[#4F7C63]">
                          <p class="text-sm font-semibold text-[#1E3A34] mb-2">Empaque adecuado:</p>
                          <ul class="text-sm text-gray-600 space-y-1">
                            <li>• Producto en condición original</li>
                            <li>• Todas las etiquetas adjuntas</li>
                            <li>• Empaque original sin daños</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-start space-x-6">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-[#E57C23] text-white flex items-center justify-center font-bold text-lg">
                          3
                        </div>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-xl font-bold text-[#1E3A34] mb-2">Envía tu Devolución</h4>
                        <p class="text-gray-700 mb-3">
                          Utiliza la etiqueta de envío prepagada que te proporcionaremos. Puedes dejar el paquete en cualquier oficina de correos o punto de recogida autorizado.
                        </p>
                        <div class="bg-[#FEF2E8] p-4 border-l-4 border-[#E57C23]">
                          <p class="text-sm font-semibold text-[#1E3A34] mb-2">Envío gratuito:</p>
                          <ul class="text-sm text-gray-600 space-y-1">
                            <li>• Etiqueta prepagada incluida</li>
                            <li>• Seguimiento en tiempo real</li>
                            <li>• Sin costos adicionales</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section id="refunds" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Reembolsos y Créditos
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <div class="grid md:grid-cols-2 gap-6">
                    <div class="border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-3">Reembolsos</h4>
                      <ul class="text-sm text-gray-600 space-y-2">
                        <li>• Procesados en 5-7 días hábiles</li>
                        <li>• Al método de pago original</li>
                        <li>• Costo de envío no reembolsable</li>
                        <li>• Notificación por email al completar</li>
                      </ul>
                    </div>

                    <div class="border-2 border-[#4F7C63] p-6">
                      <div class="w-12 h-12 bg-[#4F7C63] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-3">Crédito de Tienda</h4>
                      <ul class="text-sm text-gray-600 space-y-2">
                        <li>• Disponible inmediatamente</li>
                        <li>• Válido por 12 meses</li>
                        <li>• Usable en cualquier compra</li>
                        <li>• 10% de bono adicional en primer uso</li>
                      </ul>
                    </div>
                  </div>

                  <div class="bg-[#F8F6F0] border-l-4 border-[#C2B280] p-6 mt-6">
                    <p class="font-semibold text-[#1E3A34] mb-2">Información importante</p>
                    <p class="text-sm">
                      Si eliges crédito de tienda en lugar de reembolso, recibirás un <strong>10% adicional</strong> en tu primer uso. Perfecto para tu próxima aventura outdoor.
                    </p>
                  </div>
                </div>
              </section>
              <section id="exchanges" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Cambios y Intercambios
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Preferimos los cambios antes que las devoluciones. Si necesitas un tamaño o color diferente, nuestro proceso de cambio es rápido y sencillo.
                  </p>

                  <div class="grid gap-4 mt-6">
                    <div class="flex items-center justify-between p-4 bg-white border-2 border-[#D8C69E]">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-[#1E3A34] text-white flex items-center justify-center">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-[#1E3A34]">Cambio por Tamaño/Color</p>
                          <p class="text-sm text-gray-600">Mismo producto, diferente variante</p>
                        </div>
                      </div>
                      <span class="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">Gratis</span>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-white border-2 border-[#D8C69E]">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 bg-[#4F7C63] text-white flex items-center justify-center">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-[#1E3A34]">Cambio por Producto Diferente</p>
                          <p class="text-sm text-gray-600">Selecciona cualquier producto de nuestro catálogo</p>
                        </div>
                      </div>
                      <span class="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold">Diferencia</span>
                    </div>
                  </div>
                </div>
              </section>
              <section id="faq" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Preguntas Frecuentes
                </h2>
                <div class="space-y-4">
                  <div class="border-2 border-[#D8C69E] overflow-hidden">
                    <button 
                      @click="toggleFAQ(1)"
                      class="w-full flex justify-between items-center p-6 text-left hover:bg-[#F8F6F0] transition-colors"
                    >
                      <span class="font-semibold text-[#1E3A34]">¿Cuánto tiempo toma procesar mi reembolso?</span>
                      <svg 
                        class="w-5 h-5 text-[#1E3A34] transition-transform" 
                        :class="{ 'rotate-180': openFAQ === 1 }"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div v-if="openFAQ === 1" class="p-6 bg-[#F8F6F0] border-t-2 border-[#D8C69E]">
                      <p class="text-gray-700">
                        Una vez que recibamos y procesemos tu devolución, los reembolsos se procesan en <strong>5-7 días hábiles</strong>. El tiempo que toma aparecer en tu cuenta depende de tu institución financiera.
                      </p>
                    </div>
                  </div>

                  <div class="border-2 border-[#D8C69E] overflow-hidden">
                    <button 
                      @click="toggleFAQ(2)"
                      class="w-full flex justify-between items-center p-6 text-left hover:bg-[#F8F6F0] transition-colors"
                    >
                      <span class="font-semibold text-[#1E3A34]">¿Qué hago si recibí un producto defectuoso?</span>
                      <svg 
                        class="w-5 h-5 text-[#1E3A34] transition-transform" 
                        :class="{ 'rotate-180': openFAQ === 2 }"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div v-if="openFAQ === 2" class="p-6 bg-[#F8F6F0] border-t-2 border-[#D8C69E]">
                      <p class="text-gray-700 mb-3">
                        Lamentamos escuchar eso. Para productos defectuosos:
                      </p>
                      <ul class="text-gray-700 space-y-2 text-sm">
                        <li>• Contacta a nuestro servicio al cliente dentro de los 14 días</li>
                        <li>• Proporciona fotos del defecto</li>
                        <li>• Te enviaremos un reemplazo inmediato</li>
                        <li>• Cubrimos todos los costos de envío</li>
                      </ul>
                    </div>
                  </div>

                  <div class="border-2 border-[#D8C69E] overflow-hidden">
                    <button 
                      @click="toggleFAQ(3)"
                      class="w-full flex justify-between items-center p-6 text-left hover:bg-[#F8F6F0] transition-colors"
                    >
                      <span class="font-semibold text-[#1E3A34]">¿Puedo devolver productos en oferta?</span>
                      <svg 
                        class="w-5 h-5 text-[#1E3A34] transition-transform" 
                        :class="{ 'rotate-180': openFAQ === 3 }"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div v-if="openFAQ === 3" class="p-6 bg-[#F8F6F0] border-t-2 border-[#D8C69E]">
                      <p class="text-gray-700">
                        Sí, los productos en oferta siguen la misma política de devolución de 30 días. Sin embargo, el reembolso se calculará según el precio de compra pagado.
                      </p>
                    </div>
                  </div>

                  <div class="border-2 border-[#D8C69E] overflow-hidden">
                    <button 
                      @click="toggleFAQ(4)"
                      class="w-full flex justify-between items-center p-6 text-left hover:bg-[#F8F6F0] transition-colors"
                    >
                      <span class="font-semibold text-[#1E3A34]">¿Puedo devolver un producto usado?</span>
                      <svg 
                        class="w-5 h-5 text-[#1E3A34] transition-transform" 
                        :class="{ 'rotate-180': openFAQ === 4 }"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div v-if="openFAQ === 4" class="p-6 bg-[#F8F6F0] border-t-2 border-[#D8C69E]">
                      <p class="text-gray-700">
                        Los productos deben estar en su condición original y sin usar para ser elegibles para devolución. Productos usados o dañados no serán aceptados, excepto en casos de garantía o defectos de fabricación.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="contact" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Contacto y Soporte
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Si tienes alguna pregunta sobre nuestra política de devoluciones o necesitas ayuda con tu devolución, nuestro equipo está disponible para asistirte.
                  </p>

                  <div class="grid md:grid-cols-3 gap-6 mt-6">
                    <div class="border-2 border-[#D8C69E] p-6 text-center">
                      <div class="w-12 h-12 bg-[#1E3A34] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Teléfono</h4>
                      <p class="text-sm text-gray-600">+1 (800) DRIP-123</p>
                      <p class="text-xs text-gray-500 mt-1">Lun - Vie: 9AM - 6PM</p>
                    </div>

                    <div class="border-2 border-[#4F7C63] p-6 text-center">
                      <div class="w-12 h-12 bg-[#4F7C63] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Email</h4>
                      <p class="text-sm text-gray-600">returns@dripoutdoor.com</p>
                      <p class="text-xs text-gray-500 mt-1">Respuesta en 24 horas</p>
                    </div>

                    <div class="border-2 border-[#E57C23] p-6 text-center">
                      <div class="w-12 h-12 bg-[#E57C23] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Chat en Vivo</h4>
                      <p class="text-sm text-gray-600">Asistencia inmediata</p>
                      <p class="text-xs text-gray-500 mt-1">Disponible 24/7</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('overview')
const openFAQ = ref(1)

const sections = [
  { id: 'overview', title: 'Resumen' },
  { id: 'eligibility', title: 'Elegibilidad' },
  { id: 'process', title: 'Proceso Paso a Paso' },
  { id: 'refunds', title: 'Reembolsos' },
  { id: 'exchanges', title: 'Cambios' },
  { id: 'faq', title: 'Preguntas Frecuentes' },
  { id: 'contact', title: 'Contacto' }
]

const toggleFAQ = (id) => {
  openFAQ.value = openFAQ.value === id ? null : id
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 100
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY + 150

  for (const section of sections) {
    const element = document.getElementById(section.id)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetHeight = element.offsetHeight

      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1.25em;
  line-height: 1.75;
}

.prose strong {
  color: #1E3A34;
  font-weight: 600;
}

.scroll-mt-24 {
  scroll-margin-top: 6rem;
}

html {
  scroll-behavior: smooth;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>