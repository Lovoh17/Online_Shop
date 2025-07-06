import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Definición de rutas (usando el nombre exacto que se usará después)
const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginForm.vue'),
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterForm.vue'),
        meta: { public: true }
    },
    {
        path: '/pago/tarjeta',
        name: 'pago',
        component: () => import('@/views/CardPayment.vue'),
        meta: { requiresAuth: true }
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
        meta: { requiresAuth: true }
    },
    {
        path: '/pago/tarjeta',
        name: 'pago',
        component: () => import('@/views/CardPayment.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/carrito',
        name: 'Cart',
        component: () => import('@/views/CartView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if(to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login')
    }
    
    if(to.meta.public && authStore.isAuthenticated) {
        return next('/dashboard')
    }
    
    next()
})

export default router