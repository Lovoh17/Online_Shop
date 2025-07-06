import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const isAuthenticated = ref(false)
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    const isTokenExpired = () => {
        if (!token.value) return true
        
        try {
            const payload = JSON.parse(atob(token.value.split('.')[1]))
            const currentTime = Date.now() / 1000
            
            return payload.exp < currentTime
        } catch (error) {
            console.error('Error decodificando token:', error)
            return true
        }
    }

    const clearAuth = () => {
        isAuthenticated.value = false
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    if(token.value) {
        if (!isTokenExpired()) {
            isAuthenticated.value = true
        } else {
            console.log('Token expirado al inicializar, limpiando...')
            clearAuth()
        }
    }

    const login = async (email, password) => {
        try {
            isLoading.value = true
            error.value = null
            
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if(response.ok) {
                isAuthenticated.value = true
                user.value = { 
                    nombre: data.nombre,
                    email: data.email,
                    id: data.id
                }
                token.value = data.token
                localStorage.setItem('token', data.token)
                console.log('Login exitoso, token guardado')
                router.push('/dashboard')
            } else {
                throw new Error(data.mensaje || 'Error en el login')
            }
        } catch (error) {
            error.value = error.message
            console.error('Error en login:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const loadUserData = async () => {
        try {
            isLoading.value = true
            error.value = null
            if (!token.value || isTokenExpired()) {
                throw new Error('Token expirado')
            }

            const response = await fetch('http://localhost:3000/perfil', {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Token inválido o expirado')
                }
                throw new Error('Error al cargar datos del usuario')
            }

            const data = await response.json()
            user.value = {
                ...user.value,
                ...data.usuario,
                createdAt: data.usuario.createdAt ? new Date(data.usuario.createdAt) : null
            }
        } catch (err) {
            error.value = err.message
            console.error('Error cargando datos del usuario:', err)
            
            if (err.message.includes('Token') || err.message.includes('401')) {
                console.log('Token inválido, haciendo logout...')
                logout()
            }
            throw err
        } finally {
            isLoading.value = false
        }
    }
    const authenticatedFetch = async (url, options = {}) => {
        if (!token.value || isTokenExpired()) {
            console.log('Token expirado o ausente, haciendo logout...')
            logout()
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`,
            ...options.headers
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            })
            if (response.status === 401) {
                console.log('Respuesta 401, token inválido, haciendo logout...')
                logout()
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
            }

            return response
        } catch (error) {
            console.error('Error en petición autenticada:', error)
            throw error
        }
    }

    const logout = () => {
        console.log('Cerrando sesión...')
        clearAuth()
        router.push('/login')
    }
    const checkAuth = () => {
        const storedToken = localStorage.getItem('token')
        
        if (storedToken) {
            token.value = storedToken
            
            if (!isTokenExpired()) {
                isAuthenticated.value = true
                console.log('Autenticación restaurada desde localStorage')
            } else {
                console.log('Token expirado en localStorage, limpiando...')
                clearAuth()
            }
        }
    }

    // Método de registro
    const register = async (userData) => {
        try {
            isLoading.value = true
            error.value = null
            
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: userData.name,
                    email: userData.email,
                    password: userData.password
                })
            })

            const data = await response.json()

            if(response.ok) {
                isAuthenticated.value = true
                user.value = { 
                    nombre: data.nombre,
                    email: data.email,
                    id: data.id
                }
                token.value = data.token
                localStorage.setItem('token', data.token)
                console.log('Registro exitoso, token guardado')
                router.push('/') // Redirigir a página principal
            } else {
                throw new Error(data.mensaje || 'Error en el registro')
            }
        } catch (error) {
            error.value = error.message
            console.error('Error en registro:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    return { 
        isAuthenticated, 
        user, 
        token,
        isLoading,
        error,
        login, 
        logout,
        loadUserData,
        authenticatedFetch,
        isTokenExpired,
        checkAuth,
        clearAuth,
        register
    }
})