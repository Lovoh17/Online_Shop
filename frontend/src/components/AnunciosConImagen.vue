<template>
  <!-- Banner Superior Rotatorio -->
  <div v-if="showTopBanner && currentTopAd" class="top-banner" :class="currentTopAd.theme">
    <div class="banner-content">
      <img :src="currentTopAd.image" :alt="currentTopAd.title" class="banner-image">
      <div class="banner-text">
        <h3>{{ currentTopAd.title }}</h3>
        <p>{{ currentTopAd.subtitle }}</p>
        <button class="shop-now-btn" @click="handleAdClick(currentTopAd)">{{ currentTopAd.buttonText }}</button>
      </div>
      <button class="close-banner" @click="closeTopBanner">×</button>
    </div>
  </div>

  <!-- Banner Lateral Derecho Rotatorio -->
  <div v-if="showSideBanner && currentSideAd" class="side-banner right-banner" :class="currentSideAd.theme">
    <button class="close-banner" @click="closeSideBanner">×</button>
    <div class="banner-content">
      <img :src="currentSideAd.image" :alt="currentSideAd.title" class="banner-image">
      <div class="banner-overlay">
        <h4>{{ currentSideAd.title }}</h4>
        <p>{{ currentSideAd.subtitle }}</p>
        <button class="banner-btn" @click="handleAdClick(currentSideAd)">{{ currentSideAd.buttonText }}</button>
      </div>
    </div>
  </div>

  <!-- Popup de Welcome -->
  <div v-if="showWelcomePopup" class="popup-overlay">
    <div class="popup-content welcome-popup">
      <button class="close-popup" @click="closeWelcomePopup">×</button>
      <div class="popup-image">
        <img src="../assets/imagologo.png" alt="Welcome Offer">
      </div>
      <div class="popup-body">
        <h3>FIRST TIMER?</h3>
        <p>SIGN UP AND GET 15% OFF YOUR FIRST ORDER</p>
        <div class="email-input-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Enter your email address"
            class="email-input"
          >
          <button class="go-btn" @click="subscribeNewsletter">GO!</button>
        </div>
        <p class="terms-text">By subscribing you agree to our Terms & Conditions</p>
      </div>
    </div>
  </div>

  <!-- Chat Flotante -->
  <div class="chat-widget" :class="{ 'minimized': isChatMinimized }">
    <div class="chat-header" @click="toggleChat">
      <span>Live chat</span>
      <span class="chat-status"></span>
    </div>
    <div v-if="!isChatMinimized" class="chat-body">
      <div class="chat-messages">
        <div class="message agent-message">
          <p>Hi! How can we help you today?</p>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" placeholder="Type your message..." v-model="chatMessage">
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>

  <!-- Banner Inferior Fijo Rotatorio -->
  <div v-if="showBottomBanner && currentBottomAd" class="bottom-fixed-banner" :class="currentBottomAd.theme">
    <div class="banner-content">
      <img :src="currentBottomAd.image" :alt="currentBottomAd.title" class="banner-image">
      <div class="banner-text">
        <span>{{ currentBottomAd.title }}</span>
        <button class="shop-btn" @click="handleAdClick(currentBottomAd)">{{ currentBottomAd.buttonText }}</button>
      </div>
      <button class="close-banner" @click="closeBottomBanner">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estados de visibilidad
const showTopBanner = ref(true)
const showSideBanner = ref(true)
const showWelcomePopup = ref(false)
const showBottomBanner = ref(true)
const isChatMinimized = ref(true)
const email = ref('')
const chatMessage = ref('')

// Anuncios actuales
const currentTopAd = ref(null)
const currentSideAd = ref(null)
const currentBottomAd = ref(null)

// Temporizadores
let topAdTimer
let sideAdTimer
let bottomAdTimer
let welcomeTimer

// Catálogo de anuncios rotatorios (más opciones)
const topAds = [
  {
    image: '../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.png',
    title: 'SUMMER SALE',
    subtitle: 'UP TO 50% OFF - LIMITED TIME',
    buttonText: 'SHOP NOW',
    theme: 'summer-theme',
    action: () => router.push('/sale')
  },
  {
    image: '../assets/new2.png',
    title: 'NEW COLLECTION',
    subtitle: 'FRESH STYLES JUST DROPPED',
    buttonText: 'EXPLORE',
    theme: 'new-theme',
    action: () => router.push('/new-arrivals')
  },
  {
    image: '../assets/AccesoriosBanner.png',
    title: 'ACCESSORIES',
    subtitle: 'COMPLETE YOUR LOOK',
    buttonText: 'DISCOVER',
    theme: 'accessory-theme',
    action: () => router.push('/accessories')
  },
  {
    image: '../assets/imagologo.png',
    title: 'FLASH SALE',
    subtitle: '24 HOURS ONLY - 60% OFF',
    buttonText: 'GRAB DEALS',
    theme: 'flash-theme',
    action: () => router.push('/flash-sale')
  },
  {
    image: '../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.png',
    title: 'WEEKEND SPECIAL',
    subtitle: 'EXTRA 25% OFF EVERYTHING',
    buttonText: 'SHOP WEEKEND',
    theme: 'weekend-theme',
    action: () => router.push('/weekend-sale')
  }
]

const sideAds = [
  {
    image: '../assets/AccesoriosBanner.png',
    title: 'TRENDING NOW',
    subtitle: 'Shop the viral styles',
    buttonText: 'SEE TRENDS',
    theme: 'trending-theme',
    action: () => router.push('/trending')
  },
  {
    image: '../assets/imagologo.png',
    title: 'EXCLUSIVE DEAL',
    subtitle: 'Members get extra 10% off',
    buttonText: 'JOIN NOW',
    theme: 'exclusive-theme',
    action: () => router.push('/membership')
  },
  {
    image: '../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.png',
    title: 'CLEARANCE',
    subtitle: 'Last chance up to 70% off',
    buttonText: 'SHOP DEALS',
    theme: 'clearance-theme',
    action: () => router.push('/clearance')
  },
  {
    image: '../assets/new2.png',
    title: 'BACK IN STOCK',
    subtitle: 'Popular items restocked',
    buttonText: 'SHOP NOW',
    theme: 'restock-theme',
    action: () => router.push('/back-in-stock')
  },
  {
    image: '../assets/AccesoriosBanner.png',
    title: 'GIFT GUIDE',
    subtitle: 'Perfect presents for everyone',
    buttonText: 'FIND GIFTS',
    theme: 'gift-guide-theme',
    action: () => router.push('/gift-guide')
  }
]

const bottomAds = [
  {
    image: '../assets/new2.png',
    title: '🚚 FREE SHIPPING ON ORDERS OVER $50',
    buttonText: 'SHOP NOW',
    theme: 'shipping-theme',
    action: () => router.push('/products')
  },
  {
    image: '../assets/imagologo.png',
    title: '💳 PAY IN 4 INTEREST-FREE INSTALLMENTS',
    buttonText: 'LEARN MORE',
    theme: 'payment-theme',
    action: () => router.push('/payment-options')
  },
  {
    image: '../assets/DRIP_Shop_-_2025-10-10_21.11.19-removebg-preview.png',
    title: '🎁 GIFT CARDS AVAILABLE',
    buttonText: 'BUY GIFT CARD',
    theme: 'gift-theme',
    action: () => router.push('/gift-cards')
  },
  {
    image: '../assets/AccesoriosBanner.png',
    title: '📦 EASY RETURNS - 30 DAYS MONEY BACK',
    buttonText: 'SHOP CONFIDENTLY',
    theme: 'returns-theme',
    action: () => router.push('/returns-policy')
  },
  {
    image: '../assets/new2.png',
    title: '⭐ JOIN OUR REWARDS PROGRAM',
    buttonText: 'SIGN UP FREE',
    theme: 'rewards-theme',
    action: () => router.push('/rewards')
  }
]

// Función para obtener anuncio aleatorio
const getRandomAd = (adArray, currentAd = null) => {
  if (adArray.length === 0) return null
  
  // Si solo hay un anuncio, devolverlo
  if (adArray.length === 1) return adArray[0]
  
  // Filtrar anuncios para evitar repetir el mismo
  const availableAds = adArray.filter(ad => ad !== currentAd)
  
  // Si no hay anuncios disponibles (todos son el mismo), devolver uno aleatorio de todos
  const sourceArray = availableAds.length > 0 ? availableAds : adArray
  
  const randomIndex = Math.floor(Math.random() * sourceArray.length)
  return sourceArray[randomIndex]
}

onMounted(() => {
  // Inicializar con anuncios aleatorios
  currentTopAd.value = getRandomAd(topAds)
  currentSideAd.value = getRandomAd(sideAds)
  currentBottomAd.value = getRandomAd(bottomAds)
  
  // Iniciar rotación de anuncios (cada 5 minutos = 300,000 ms)
  startAdRotation()
  
  // Mostrar popup de welcome después de 3 segundos
  welcomeTimer = setTimeout(() => {
    const hasSeenWelcome = localStorage.getItem('welcome_popup_seen')
    if (!hasSeenWelcome) {
      showWelcomePopup.value = true
    }
  }, 3000)

  // Ocultar banner lateral al hacer scroll
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // Limpiar todos los temporizadores
  clearTimeout(topAdTimer)
  clearTimeout(sideAdTimer)
  clearTimeout(bottomAdTimer)
  clearTimeout(welcomeTimer)
  window.removeEventListener('scroll', handleScroll)
})

const startAdRotation = () => {
  // Rotar anuncio superior cada 5 minutos de forma aleatoria
  topAdTimer = setInterval(() => {
    currentTopAd.value = getRandomAd(topAds, currentTopAd.value)
    console.log('🔄 Rotando anuncio superior:', currentTopAd.value?.title)
  }, 300000) // 5 minutos

  // Rotar anuncio lateral cada 5 minutos de forma aleatoria
  sideAdTimer = setInterval(() => {
    currentSideAd.value = getRandomAd(sideAds, currentSideAd.value)
    console.log('🔄 Rotando anuncio lateral:', currentSideAd.value?.title)
  }, 300000)

  // Rotar anuncio inferior cada 5 minutos de forma aleatoria
  bottomAdTimer = setInterval(() => {
    currentBottomAd.value = getRandomAd(bottomAds, currentBottomAd.value)
    console.log('🔄 Rotando anuncio inferior:', currentBottomAd.value?.title)
  }, 300000)
}

const handleScroll = () => {
  if (window.scrollY > 200) {
    showSideBanner.value = false
  }
}

const handleAdClick = (ad) => {
  ad.action()
}

const closeTopBanner = () => {
  showTopBanner.value = false
  clearInterval(topAdTimer)
}

const closeSideBanner = () => {
  showSideBanner.value = false
  clearInterval(sideAdTimer)
}

const closeWelcomePopup = () => {
  showWelcomePopup.value = false
  localStorage.setItem('welcome_popup_seen', 'true')
}

const closeBottomBanner = () => {
  showBottomBanner.value = false
  clearInterval(bottomAdTimer)
}

const toggleChat = () => {
  isChatMinimized.value = !isChatMinimized.value
}

const subscribeNewsletter = () => {
  if (email.value && isValidEmail(email.value)) {
    // Aquí integrar con tu API de newsletter
    console.log('Email suscrito:', email.value)
    alert('¡Gracias! Revisa tu email para confirmar y obtener tu 15% de descuento.')
    closeWelcomePopup()
  } else {
    alert('Please enter a valid email address')
  }
}

const sendMessage = () => {
  if (chatMessage.value.trim()) {
    console.log('Mensaje enviado:', chatMessage.value)
    chatMessage.value = ''
    // Aquí integrar con tu servicio de chat
  }
}

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
</script>

<style scoped>
/* Variables de temas */
:root {
  --summer-gradient: linear-gradient(135deg, #ff6b6b, #ffa726);
  --new-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --accessory-gradient: linear-gradient(135deg, #f093fb, #f5576c);
  --trending-gradient: linear-gradient(135deg, #4facfe, #00f2fe);
  --exclusive-gradient: linear-gradient(135deg, #43e97b, #38f9d7);
  --clearance-gradient: linear-gradient(135deg, #ff5858, #f09819);
  --shipping-gradient: linear-gradient(135deg, #a8edea, #fed6e3);
  --payment-gradient: linear-gradient(135deg, #d4fc79, #96e6a1);
  --gift-gradient: linear-gradient(135deg, #fdcbf1, #e6dee9);
}

/* Banner Superior */
.top-banner {
  position: relative;
  color: white;
  overflow: hidden;
  transition: all 0.5s ease;
}

.top-banner.summer-theme {
  background: var(--summer-gradient);
}

.top-banner.new-theme {
  background: var(--new-gradient);
}

.top-banner.accessory-theme {
  background: var(--accessory-gradient);
}

.banner-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.banner-text {
  position: absolute;
  text-align: center;
  color: white;
  z-index: 2;
}

.banner-text h3 {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
  letter-spacing: 2px;
}

.banner-text p {
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 600;
}

.shop-now-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.shop-now-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.close-banner {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0,0,0,0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-banner:hover {
  background: rgba(0,0,0,0.6);
  transform: scale(1.1);
}

/* Banner Lateral */
.side-banner {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 320px;
  z-index: 1000;
  transition: all 0.5s ease;
  border-radius: 20px;
  overflow: hidden;
}

.side-banner.trending-theme {
  background: var(--trending-gradient);
}

.side-banner.exclusive-theme {
  background: var(--exclusive-gradient);
}

.side-banner.clearance-theme {
  background: var(--clearance-gradient);
}

.right-banner {
  right: 25px;
  animation: slideInRight 0.8s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.side-banner .banner-content {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
}

.side-banner .banner-content:hover {
  transform: scale(1.02);
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  color: white;
  padding: 2rem;
  text-align: center;
}

.banner-overlay h4 {
  margin: 0 0 0.8rem 0;
  font-size: 1.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.banner-overlay p {
  margin: 0 0 1.5rem 0;
  opacity: 0.95;
  font-size: 1.1rem;
  font-weight: 500;
}

.banner-btn {
  background: white;
  color: #000;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

/* Popup de Welcome */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.welcome-popup {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  max-width: 450px;
  width: 90%;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.7) rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateX(0);
  }
}

.popup-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.popup-body {
  padding: 2.5rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.popup-body h3 {
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.popup-body p {
  color: #4a5568;
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-weight: 500;
}

.email-input-group {
  display: flex;
  margin: 2rem 0;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.email-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: white;
}

.email-input:focus {
  background: #f8f9fa;
}

.go-btn {
  background: #2d3748;
  color: white;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.go-btn:hover {
  background: #1a202c;
}

.terms-text {
  font-size: 0.75rem;
  color: #718096;
  margin: 1.5rem 0 0 0;
}

.close-popup {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0,0,0,0.1);
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #4a5568;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-popup:hover {
  background: rgba(0,0,0,0.2);
  transform: rotate(90deg);
}

/* Chat Widget */
.chat-widget {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 350px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.chat-widget.minimized {
  width: auto;
  border-radius: 25px;
}

.chat-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
}

.chat-status {
  width: 10px;
  height: 10px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 10px #4CAF50;
}

.chat-body {
  padding: 1.5rem;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.message {
  margin-bottom: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 20px;
  max-width: 85%;
  animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.agent-message {
  background: white;
  align-self: flex-start;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.chat-input {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 1rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  outline: none;
  transition: border-color 0.3s ease;
  font-size: 1rem;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 80px;
}

.chat-input button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* Banner Inferior Fijo */
.bottom-fixed-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  z-index: 999;
  transition: all 0.5s ease;
}

.bottom-fixed-banner.shipping-theme {
  background: var(--shipping-gradient);
}

.bottom-fixed-banner.payment-theme {
  background: var(--payment-gradient);
}

.bottom-fixed-banner.gift-theme {
  background: var(--gift-theme);
}

.bottom-fixed-banner .banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  position: relative;
  min-height: 70px;
}

.bottom-fixed-banner .banner-text {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.shop-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.shop-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .side-banner {
    display: none;
  }
  
  .chat-widget {
    width: 300px;
    right: 20px;
    bottom: 20px;
  }
  
  .welcome-popup {
    margin: 1rem;
    max-width: 95%;
  }
  
  .banner-text h3 {
    font-size: 1.8rem;
  }
  
  .banner-text p {
    font-size: 1rem;
  }
  
  .bottom-fixed-banner .banner-text {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .top-banner .banner-content {
    min-height: 100px;
  }
  
  .banner-text h3 {
    font-size: 1.5rem;
  }
  
  .shop-now-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>