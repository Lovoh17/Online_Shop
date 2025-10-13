<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white border-b border-[#D8C69E] sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-16 h-16 flex items-center justify-center" style="margin-left: -10px; margin-right: 10px;">
                <img 
                  src="../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.svg" 
                  alt="DRIP OUTDOOR"
                  class="w-full h-full object-contain"
                >
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-black text-[#1E3A34] tracking-tight">DRIP</span>
                <span class="text-sm font-medium text-[#4F7C63] -mt-1 tracking-wider">OUTDOOR</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-12">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-[#1E3A34] mb-6">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-[#1E3A34] mb-6 tracking-tight">
          POLÍTICA DE PRIVACIDAD
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Comprometidos con la protección y transparencia en el manejo de tu información personal
        </p>
        <div class="mt-8 flex justify-center">
          <div class="bg-white border-2 border-[#D8C69E] px-6 py-3">
            <p class="text-sm font-semibold text-[#1E3A34]">
              Última actualización: <span class="text-[#E57C23]">17 de Septiembre, 2025</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
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

          <!-- Quick Info -->
          <div class="bg-[#1E3A34] p-6 mt-6 text-white">
            <h4 class="font-bold text-lg mb-3">Información Clave</h4>
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Protección de datos personal</span>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Transparencia total</span>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Control de tus datos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <div class="bg-white border border-[#D8C69E] shadow-sm overflow-hidden">
            <!-- Content Sections -->
            <div class="p-8 space-y-12">
              <!-- Introduction -->
              <section id="introduction" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Introducción
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Esta Política de Privacidad describe cómo <strong>DRIP OUTDOOR</strong> (el "Sitio", "nosotros", "nos" o "nuestro") recopila, utiliza y divulga tu información personal cuando visitas, utilizas nuestros servicios o realizas una compra en <strong>dripoutdoor.com</strong> (el "Sitio") o te comunicas con nosotros de otra manera relacionada con el Sitio (colectivamente, los "Servicios"). Para los propósitos de esta Política de Privacidad, "tú" y "tu" significa tú como usuario de los Servicios, ya seas un cliente, visitante del sitio web u otro individuo cuya información hayamos recopilado conforme a esta Política de Privacidad.
                  </p>
                  <div class="bg-[#F8F6F0] border-l-4 border-[#C2B280] p-6 my-6">
                    <p class="font-semibold text-[#1E3A34] mb-2">Aviso Importante</p>
                    <p class="text-sm">
                      Al usar y acceder a cualquiera de los Servicios, aceptas la recopilación, uso y divulgación de tu información según se describe en esta Política de Privacidad. Si no estás de acuerdo con esta Política de Privacidad, por favor no uses ni accedas a ninguno de los Servicios.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Changes -->
              <section id="changes" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Cambios a Esta Política de Privacidad
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Podemos actualizar esta Política de Privacidad periódicamente, incluso para reflejar cambios en nuestras prácticas o por otras razones operativas, legales o regulatorias. Publicaremos la Política de Privacidad revisada en el Sitio, actualizaremos la fecha de "Última actualización" y tomaremos cualquier otro paso requerido por la ley aplicable.
                  </p>
                  
                  <div class="bg-white border-2 border-[#4F7C63] p-6 mt-6">
                    <h4 class="font-bold text-[#1E3A34] mb-3">Notificación de Cambios</h4>
                    <p class="text-sm text-gray-600">
                      Te notificaremos sobre cambios significativos a través de:
                    </p>
                    <ul class="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Notificación por correo electrónico</li>
                      <li>• Aviso destacado en nuestro sitio web</li>
                      <li>• Actualización de la fecha de modificación</li>
                    </ul>
                  </div>
                </div>
              </section>

              <!-- Information Collection -->
              <section id="collection" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Cómo Recopilamos y Usamos Tu Información Personal
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Para proporcionar los Servicios, recopilamos y hemos recopilado durante los últimos 12 meses información personal sobre ti de una variedad de fuentes, como se establece a continuación. La información que recopilamos y usamos varía dependiendo de cómo interactúas con nosotros.
                  </p>
                  
                  <h3 class="text-xl font-bold text-[#1E3A34] mt-8 mb-4">Información que Recopilamos Directamente de Ti</h3>
                  <div class="grid gap-4 mb-6">
                    <div class="flex items-start space-x-3 p-4 bg-[#F8F6F0] border-l-4 border-[#1E3A34]">
                      <div class="w-6 h-6 bg-[#1E3A34] text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <span class="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Detalles de contacto</p>
                        <p class="text-sm text-gray-600">Incluyendo tu nombre, dirección, número de teléfono y correo electrónico.</p>
                      </div>
                    </div>
                    <div class="flex items-start space-x-3 p-4 bg-[#F8F6F0] border-l-4 border-[#1E3A34]">
                      <div class="w-6 h-6 bg-[#1E3A34] text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <span class="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Información de pedidos</p>
                        <p class="text-sm text-gray-600">Incluyendo nombre, dirección de facturación, dirección de envío, confirmación de pago, email y teléfono.</p>
                      </div>
                    </div>
                    <div class="flex items-start space-x-3 p-4 bg-[#F8F6F0] border-l-4 border-[#1E3A34]">
                      <div class="w-6 h-6 bg-[#1E3A34] text-white flex items-center justify-center flex-shrink-0 mt-1">
                        <span class="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Información de cuenta</p>
                        <p class="text-sm text-gray-600">Nombre de usuario, contraseña, preguntas de seguridad y otra información para seguridad de la cuenta.</p>
                      </div>
                    </div>
                  </div>

                  <h3 class="text-xl font-bold text-[#1E3A34] mt-8 mb-4">Cómo Usamos Tu Información Personal</h3>
                  <div class="space-y-4">
                    <div class="border-2 border-[#D8C69E] p-6">
                      <h4 class="font-bold text-[#1E3A34] mb-2">Proporcionar Productos y Servicios</h4>
                      <p class="text-sm text-gray-600">Procesamos pagos, cumplimos pedidos, enviamos notificaciones y gestionamos tu cuenta.</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-6">
                      <h4 class="font-bold text-[#1E3A34] mb-2">Marketing y Publicidad</h4>
                      <p class="text-sm text-gray-600">Enviamos comunicaciones de marketing y mostramos anuncios relevantes para ti.</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-6">
                      <h4 class="font-bold text-[#1E3A34] mb-2">Seguridad y Prevención de Fraude</h4>
                      <p class="text-sm text-gray-600">Detectamos y prevenimos actividades fraudulentas o maliciosas.</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-6">
                      <h4 class="font-bold text-[#1E3A34] mb-2">Cumplimiento Legal</h4>
                      <p class="text-sm text-gray-600">Cumplimos con nuestras obligaciones legales y resolvemos disputas.</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Cookies -->
              <section id="cookies" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Cookies y Tecnologías de Seguimiento
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Como muchos sitios web, utilizamos Cookies en nuestro Sitio. Usamos Cookies para potenciar y mejorar nuestro Sitio y nuestros Servicios (incluyendo recordar tus acciones y preferencias), ejecutar análisis y comprender mejor la interacción del usuario con los Servicios.
                  </p>
                  
                  <h3 class="text-xl font-bold text-[#1E3A34] mt-8 mb-4">Tipos de Cookies que Utilizamos</h3>
                  <div class="grid md:grid-cols-2 gap-4 mb-6">
                    <div class="border-2 border-[#D8C69E] p-4">
                      <h4 class="font-semibold text-[#1E3A34] mb-2">Cookies Esenciales</h4>
                      <p class="text-sm text-gray-600">Necesarias para el funcionamiento del sitio</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-4">
                      <h4 class="font-semibold text-[#1E3A34] mb-2">Cookies de Rendimiento</h4>
                      <p class="text-sm text-gray-600">Analizan cómo usas nuestro sitio</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-4">
                      <h4 class="font-semibold text-[#1E3A34] mb-2">Cookies Funcionales</h4>
                      <p class="text-sm text-gray-600">Recuerdan tus preferencias</p>
                    </div>
                    <div class="border-2 border-[#D8C69E] p-4">
                      <h4 class="font-semibold text-[#1E3A34] mb-2">Cookies de Marketing</h4>
                      <p class="text-sm text-gray-600">Muestran anuncios relevantes</p>
                    </div>
                  </div>

                  <div class="bg-[#F0F7F4] border-2 border-[#4F7C63] p-6 mt-6">
                    <h4 class="font-bold text-[#1E3A34] mb-2">Control de Cookies</h4>
                    <p class="text-sm mb-3">
                      La mayoría de los navegadores aceptan Cookies por defecto, pero puedes configurar tu navegador para eliminar o rechazar Cookies a través de los controles de tu navegador.
                    </p>
                    <p class="text-xs text-gray-600">
                      Ten en cuenta que eliminar o bloquear Cookies puede afectar negativamente tu experiencia de usuario y puede hacer que algunos de los Servicios funcionen incorrectamente o ya no estén disponibles.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Data Sharing -->
              <section id="sharing" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Divulgación de Información Personal
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    En ciertas circunstancias, podemos divulgar tu información personal a terceros para propósitos legítimos sujetos a esta Política de Privacidad.
                  </p>

                  <div class="space-y-4 mt-6">
                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="w-10 h-10 bg-[#1E3A34] text-white flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Proveedores de Servicios</p>
                        <p class="text-sm text-gray-600">Compartimos información con proveedores que nos ayudan a operar nuestro negocio.</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="w-10 h-10 bg-[#4F7C63] text-white flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Cumplimiento Legal</p>
                        <p class="text-sm text-gray-600">Cuando sea requerido por ley o para proteger nuestros derechos legales.</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="w-10 h-10 bg-[#E57C23] text-white flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Transferencias Empresariales</p>
                        <p class="text-sm text-gray-600">En caso de fusión, adquisición o venta de activos.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Your Rights -->
              <section id="rights" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Tus Derechos de Privacidad
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Dependiendo de dónde vivas, puedes tener algunos o todos los derechos enumerados a continuación en relación con tu información personal. Sin embargo, estos derechos no son absolutos, pueden aplicarse solo en ciertas circunstancias y, en ciertos casos, podemos declinar tu solicitud según lo permitido por la ley.
                  </p>
                  
                  <div class="grid md:grid-cols-2 gap-6 mt-8">
                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Derecho de Acceso</h4>
                      <p class="text-sm text-gray-600">Solicitar acceso a la información personal que tenemos sobre ti.</p>
                    </div>
                    
                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Derecho de Eliminación</h4>
                      <p class="text-sm text-gray-600">Solicitar que eliminemos tu información personal.</p>
                    </div>
                    
                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Derecho de Corrección</h4>
                      <p class="text-sm text-gray-600">Solicitar que corrijamos información inexacta.</p>
                    </div>
                    
                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Derecho de Portabilidad</h4>
                      <p class="text-sm text-gray-600">Recibir una copia de tus datos en formato portable.</p>
                    </div>

                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Derecho de Oposición</h4>
                      <p class="text-sm text-gray-600">Oponerte al procesamiento de tus datos personales.</p>
                    </div>
                    
                    <div class="bg-white border-2 border-[#D8C69E] p-6">
                      <div class="w-12 h-12 bg-[#1E3A34] flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Gestión de Comunicaciones</h4>
                      <p class="text-sm text-gray-600">Optar por no recibir correos promocionales.</p>
                    </div>
                  </div>

                  <div class="bg-[#F8F6F0] border-l-4 border-[#C2B280] p-6 mt-8">
                    <h4 class="font-semibold text-[#1E3A34] mb-2">Cómo Ejercer Tus Derechos</h4>
                    <p class="text-sm text-gray-600">
                      Para ejercer cualquiera de estos derechos, contáctanos a través de privacy@dripoutdoor.com. Responderemos a tu solicitud dentro de los plazos establecidos por la ley aplicable.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Data Security -->
              <section id="security" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Seguridad de los Datos
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Implementamos medidas técnicas, administrativas y físicas apropiadas diseñadas para proteger tu información personal contra acceso no autorizado, divulgación, alteración y destrucción.
                  </p>

                  <div class="grid md:grid-cols-3 gap-6 mt-6">
                    <div class="text-center p-6 bg-[#F8F6F0] border-2 border-[#D8C69E]">
                      <div class="w-12 h-12 bg-[#1E3A34] text-white flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Encriptación SSL</h4>
                      <p class="text-sm text-gray-600">Todas las transmisiones están encriptadas</p>
                    </div>

                    <div class="text-center p-6 bg-[#F0F7F4] border-2 border-[#4F7C63]">
                      <div class="w-12 h-12 bg-[#4F7C63] text-white flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Servidores Seguros</h4>
                      <p class="text-sm text-gray-600">Infraestructura protegida 24/7</p>
                    </div>

                    <div class="text-center p-6 bg-[#FEF2E8] border-2 border-[#E57C23]">
                      <div class="w-12 h-12 bg-[#E57C23] text-white flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Acceso Controlado</h4>
                      <p class="text-sm text-gray-600">Solo personal autorizado</p>
                    </div>
                  </div>

                  <div class="bg-red-50 border-l-4 border-red-500 p-6 mt-6">
                    <h4 class="font-semibold text-red-800 mb-2">Importante</h4>
                    <p class="text-sm text-red-700">
                      Ningún sistema de seguridad es impenetrable. Aunque implementamos medidas de seguridad robustas, no podemos garantizar la seguridad absoluta de tu información.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Data Retention -->
              <section id="retention" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Retención de Datos
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Retenemos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta Política de Privacidad, a menos que la ley requiera o permita un período de retención más largo.
                  </p>

                  <div class="space-y-4 mt-6">
                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="flex-shrink-0 w-10 h-10 bg-[#1E3A34] text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Datos de Cuenta</p>
                        <p class="text-sm text-gray-600">Retenidos mientras tu cuenta esté activa más 3 años después de la cancelación</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="flex-shrink-0 w-10 h-10 bg-[#4F7C63] text-white flex items-center justify-center font-bold">
                        7
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Datos de Transacciones</p>
                        <p class="text-sm text-gray-600">Retenidos durante 7 años para cumplimiento fiscal y legal</p>
                      </div>
                    </div>

                    <div class="flex items-start space-x-4 p-4 border-2 border-[#D8C69E]">
                      <div class="flex-shrink-0 w-10 h-10 bg-[#E57C23] text-white flex items-center justify-center font-bold">
                        90
                      </div>
                      <div>
                        <p class="font-semibold text-[#1E3A34]">Datos de Marketing</p>
                        <p class="text-sm text-gray-600">Retenidos 90 días después de que canceles tu suscripción de marketing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Contact -->
              <section id="contact" class="scroll-mt-24">
                <h2 class="text-2xl font-black text-[#1E3A34] mb-6 flex items-center">
                  <div class="w-1 h-8 bg-[#C2B280] mr-4"></div>
                  Contacto
                </h2>
                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>
                    Si tienes alguna pregunta sobre nuestras prácticas de privacidad o esta Política de Privacidad, o si deseas ejercer cualquiera de los derechos disponibles para ti, por favor contáctanos:
                  </p>
                  
                  <div class="grid md:grid-cols-3 gap-6 mt-6">
                    <div class="border-2 border-[#D8C69E] p-6 text-center">
                      <div class="w-12 h-12 bg-[#1E3A34] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Email</h4>
                      <p class="text-sm text-gray-600">privacy@dripoutdoor.com</p>
                      <p class="text-xs text-gray-500 mt-1">Respuesta en 30 días</p>
                    </div>

                    <div class="border-2 border-[#4F7C63] p-6 text-center">
                      <div class="w-12 h-12 bg-[#4F7C63] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Teléfono</h4>
                      <p class="text-sm text-gray-600">+1 (800) DRIP-123</p>
                      <p class="text-xs text-gray-500 mt-1">Lun - Vie: 9AM - 6PM</p>
                    </div>

                    <div class="border-2 border-[#E57C23] p-6 text-center">
                      <div class="w-12 h-12 bg-[#E57C23] text-white flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 class="font-bold text-[#1E3A34] mb-2">Dirección Postal</h4>
                      <p class="text-sm text-gray-600">DRIP OUTDOOR<br>123 Adventure Lane<br>Mountain View, CA 94043</p>
                    </div>
                  </div>

                  <div class="bg-[#1E3A34] p-8 mt-6 text-white">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-white/20 flex items-center justify-center mr-4">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-semibold">Oficial de Protección de Datos</p>
                        <p class="text-sm text-white/80">dpo@dripoutdoor.com</p>
                      </div>
                    </div>
                    <p class="text-sm opacity-90">
                      Nuestro Oficial de Protección de Datos supervisa el cumplimiento de las leyes de privacidad y está disponible para responder cualquier pregunta sobre el manejo de tus datos personales.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1E3A34] text-white mt-20">
      <div class="container mx-auto px-4 py-12">
        <div class="text-center">
          <p class="text-[#C2B280] font-semibold mb-4">DRIP OUTDOOR</p>
          <p class="text-white/70 text-sm">
            Comprometidos con tu privacidad y la protección de tus datos personales
          </p>
          <div class="mt-6 pt-6 border-t border-white/20">
            <p class="text-xs text-white/50">
              &copy; 2025 DRIP OUTDOOR. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('introduction')

const sections = [
  { id: 'introduction', title: 'Introducción' },
  { id: 'changes', title: 'Cambios a la Política' },
  { id: 'collection', title: 'Recopilación de Información' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'sharing', title: 'Divulgación de Información' },
  { id: 'rights', title: 'Tus Derechos' },
  { id: 'security', title: 'Seguridad de Datos' },
  { id: 'retention', title: 'Retención de Datos' },
  { id: 'contact', title: 'Contacto' }
]

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
</style>