import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'


export const useCookies = () => {

  const setCookie = (name, value, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };

  return { setCookie, getCookie, deleteCookie };
};

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
            
            console.log('=== 🔐 LOGIN REQUEST ===')
            console.log('URL:', 'http://localhost:4000/api/usuarios/login')
            
            const response = await fetch('http://localhost:4000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            console.log('=== 📥 RESPUESTA DEL SERVIDOR ===')
            console.log('Response OK:', response.ok)
            console.log('Status:', response.status)
            console.log('Data completa:', data)
            console.log('data.success:', data.success)
            console.log('data.user:', data.user)
            console.log('data.token:', data.token ? 'Presente' : 'Ausente')

            if(response.ok && data.success) {
                console.log('=== 💾 GUARDANDO EN STORE ===')
                
                // ✅ CORREGIDO: Acceder a data.user (no directamente a data)
                const userData = data.user || {}
                console.log('userData completo:', userData)
                console.log('userData._id:', userData._id)
                console.log('userData.nombre:', userData.nombre)
                console.log('userData.email:', userData.email)
                
                isAuthenticated.value = true
                user.value = { 
                    id: userData._id?.toString() || userData.id?.toString(),
                    nombre: userData.nombre,
                    email: userData.email
                }
                token.value = data.token
                localStorage.setItem('token', data.token)
                
                console.log('✅ Usuario guardado en store:', user.value)
                console.log('✅ Token guardado en localStorage')
                console.log('✅ isAuthenticated:', isAuthenticated.value)
                
                router.push('/dashboard')
            } else {
                throw new Error(data.message || data.mensaje || 'Error en el login')
            }
        } catch (error) {
            error.value = error.message
            console.error('❌ Error en login:', error)
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

            const response = await fetch('http://localhost:4000/api/usuarios/perfil', {
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
            
            console.log('=== 📦 DATOS DE PERFIL ===')
            console.log('Data:', data)

            if (data.success && data.usuario) {
                user.value = {
                    id: data.usuario.id || data.usuario._id?.toString(),
                    nombre: data.usuario.nombre,
                    email: data.usuario.email,
                    creadoEn: data.usuario.creadoEn ? new Date(data.usuario.creadoEn) : null
                }
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

        console.log('=== 🔐 AUTHENTICATED FETCH ===')
        console.log('URL:', url)
        console.log('Token presente:', !!token.value)
        console.log('Authorization header:', headers.Authorization?.substring(0, 50) + '...')

        try {
            const response = await fetch(url, {
                ...options,
                headers
            })

            console.log('Response status:', response.status)

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
        console.log('🚪 Cerrando sesión...')
        clearAuth()
        router.push('/login')
    }

    const checkAuth = () => {
        const storedToken = localStorage.getItem('token')
        
        if (storedToken) {
            token.value = storedToken
            
            if (!isTokenExpired()) {
                isAuthenticated.value = true
                console.log('✅ Autenticación restaurada desde localStorage')
            } else {
                console.log('⚠️ Token expirado en localStorage, limpiando...')
                clearAuth()
            }
        }
    }

    const register = async (userData) => {
        try {
            isLoading.value = true
            error.value = null
            
            console.log('=== 📝 REGISTRO REQUEST ===')
            
            const response = await fetch('http://localhost:4000/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: userData.name,
                    email: userData.email,
                    password: userData.password
                })
            })

            const data = await response.json()

            console.log('=== 📥 RESPUESTA DE REGISTRO ===')
            console.log('Response OK:', response.ok)
            console.log('Data completa:', data)

            if(response.ok && data.success) {
                // ✅ CORREGIDO: Acceder a data.usuario (respuesta del registro)
                const userData = data.usuario || {}
                
                isAuthenticated.value = true
                user.value = { 
                    id: userData.id || userData._id?.toString(),
                    nombre: userData.nombre,
                    email: userData.email
                }
                token.value = data.token
                localStorage.setItem('token', data.token)
                
                console.log('✅ Registro exitoso!')
                console.log('Usuario guardado:', user.value)
                
                router.push('/dashboard')
            } else {
                throw new Error(data.message || data.mensaje || 'Error en el registro')
            }
        } catch (error) {
            error.value = error.message
            console.error('❌ Error en registro:', error)
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