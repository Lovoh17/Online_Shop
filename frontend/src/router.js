import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Definición de rutas
const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginForm.vue'),
        meta: { public: true, title: 'Iniciar Sesión - DRIP Outdoor' }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterForm.vue'),
        meta: { public: true, title: 'Registrarse - DRIP Outdoor' }
    },
    {
        path: '/pago/tarjeta',
        name: 'pago',
        component: () => import('@/views/CardPayment.vue'),
        meta: { requiresAuth: true, title: 'Pago - DRIP Outdoor' }
    },
    {
        path: '/products',
        name: 'productos',
        component: () => import('@/views/Productos.vue'),
        meta: { public: true, title: 'Productos - DRIP Outdoor' }
    },
    {
        path: '/products-Mens',
        name: 'productos Hombres',
        component: () => import('@/views/MensProducts.vue'),
        meta: { public: true, title: 'Productos de Hombres - DRIP Outdoor' }
    },
    {
        path: '/products-Womans',
        name: 'productos Mujeres',
        component: () => import('@/views/WomensProducts.vue'),
        meta: { public: true, title: 'Productos de Mujeres - DRIP Outdoor' }
    },
    {
        path: '/New-products',
        name: 'productos Nuevos',
        component: () => import('@/views/NewProducts.vue'),
        meta: { public: true, title: 'Productos Nuevos - DRIP Outdoor' }
    },
    {
        path: '/privacity',
        name: 'Privacidad',
        component: () => import('@/views/PrivacyPolicy.vue'),
        meta: { public: true, title: 'Politicas de Privacidad - DRIP Outdoor' }
    },
    {
        path: '/devoluciones',
        name: 'Devoluciones',
        component: () => import('@/views/Devoluciones.vue'),
        meta: { public: true, title: 'Politicas de Devolucion - DRIP Outdoor' }
    },
    {
        path: '/Kids-products',
        name: 'productos de Niños',
        component: () => import('@/views/KidsProducts.vue'),
        meta: { public: true, title: 'Productos de Niños - DRIP Outdoor' }
    },
    {
        path: '/Accesories-products',
        name: 'Accesorios',
        component: () => import('@/views/AccessoriesView.vue'),
        meta: { public: true, title: 'Accesorios - DRIP Outdoor' }
    },
    {
        path: '/productos/categoria/:categoria',
        name: 'productosCategoria',
        component: () => import('@/views/Productos.vue'),
        meta: { public: true, title: 'Categoría - DRIP Outdoor' }
    },
    {
        path: '/producto/:id',
        name: 'ProductDetails',
        component: () => import('@/components/detailProductsModals.vue'),
        meta: { public: true, title: 'Detalle del Producto - DRIP Outdoor' }
    },
    {
        path: '/logout',
        name: 'logout',
        beforeEnter: async (to, from, next) => {
            const authStore = useAuthStore()
            await authStore.logout()
            next('/login')
        }
    },
    {
        path: '/perfil',
        name: 'perfil',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true, title: 'Mi Perfil - DRIP Outdoor' }
    },
    {
        path: '/pedidos',
        name: 'pedidos',
        component: () => import('@/views/MisPedidos.vue'),
        meta: { requiresAuth: true, title: 'Mis Pedidos - DRIP Outdoor' }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { public: true, title: 'DRIP Outdoor - Inicio' }
    },
    {
        path: '/carrito',
        name: 'Cart',
        component: () => import('@/views/CartView.vue'),
        meta: { public: true, title: 'Carrito - DRIP Outdoor' }
    },
    {
        path: '/auth-required',
        name: 'authRequired',
        component: () => import('@/views/Advertencia.vue'),
        meta: { public: true, title: 'Autenticación Requerida - DRIP Outdoor' }
    },
    
    /*{
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { public: true, title: 'Página no encontrada - DRIP Outdoor' }
    }*/
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Si hay una posición guardada (navegación hacia atrás), usarla
        if (savedPosition) {
            return savedPosition
        }
        // Si hay un hash (ancla), ir a ese elemento
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }
        // Por defecto, scroll al inicio
        return { top: 0, behavior: 'smooth' }
    }
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // Actualizar el título de la página
    document.title = to.meta.title || 'DRIP Outdoor'
    
    // Verificar autenticación
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Guardar la ruta a la que intentaba acceder
        next({
            path: '/auth-required',
            query: { redirect: to.fullPath }
        })
    } else {
        next()
    }
})

// Guardia después de cada navegación
router.afterEach((to, from) => {
    // Scroll al inicio si es una nueva página (no navegación hacia atrás)
    if (to.path !== from.path) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
})

export default router