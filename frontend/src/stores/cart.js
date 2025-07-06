import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCart = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching cart...') // Debug
      
      const response = await authStore.authenticatedFetch('http://localhost:3000/carrito', {
        method: 'GET'
      })
      
      console.log('Response status:', response.status) // Debug
      
      const data = await response.json()
      console.log('Response data:', data) // Debug
      
      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`)
      }
      
      // Asegurar que siempre tengamos un array
      items.value = Array.isArray(data.items) ? data.items : []
      console.log('Items loaded:', items.value) // Debug
      
    } catch (err) {
      error.value = {
        message: err.message,
        details: err.details || null
      }
      console.error('Cart fetch error:', err)
      items.value = [] // Reset en caso de error
      
      // Si es error de autenticación, no necesitamos hacer nada más
      // porque authenticatedFetch ya manejó el logout
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Adding to cart:', { productId, quantity }) // Debug
      
      const response = await authStore.authenticatedFetch('http://localhost:3000/carrito', {
        method: 'POST',
        body: JSON.stringify({ 
          productoId: productId, 
          cantidad: quantity 
        })
      })
      
      const data = await response.json()
      console.log('Add to cart response:', data) // Debug
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al agregar al carrito')
      }
      
      // Actualizar el carrito después de agregar
      await fetchCart()
      return { success: true, data }
      
    } catch (err) {
      error.value = {
        message: err.message,
        details: err.response?.data?.details || null
      }
      console.error('Error adding to cart:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (productId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authStore.authenticatedFetch(`http://localhost:3000/carrito/${productId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar del carrito')
      }
      
      await fetchCart() // Actualizar después de eliminar
      return { success: true }
      
    } catch (err) {
      error.value = {
        message: err.message,
        details: null
      }
      console.error('Error removing from cart:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    loading.value = true
    error.value = null
    
    try {
      if (newQuantity < 1) {
        throw new Error('La cantidad debe ser mayor a 0')
      }

      const response = await authStore.authenticatedFetch(`http://localhost:3000/carrito/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ cantidad: newQuantity })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar cantidad')
      }
      
      await fetchCart() // Actualizar después de modificar
      return { success: true }
      
    } catch (err) {
      error.value = {
        message: err.message,
        details: null
      }
      console.error('Error updating quantity:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    try {
      // Eliminar todos los productos uno por uno
      const promises = items.value.map(item => 
        removeFromCart(item.producto._id.toString())
      )
      await Promise.all(promises)
      items.value = []
    } catch (err) {
      console.error('Error clearing cart:', err)
      throw err
    }
  }

  const totalItems = () => {
    if (!Array.isArray(items.value)) return 0
    return items.value.reduce((total, item) => total + (item.cantidad || 0), 0)
  }

  const totalPrice = () => {
    if (!Array.isArray(items.value)) return 0
    return items.value.reduce((total, item) => {
      const precio = item.producto?.precio || 0
      const cantidad = item.cantidad || 0
      return total + (precio * cantidad)
    }, 0)
  }

  // Función para verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return items.value.some(item => 
      item.producto._id.toString() === productId.toString()
    )
  }

  // Obtener la cantidad de un producto específico en el carrito
  const getProductQuantity = (productId) => {
    const item = items.value.find(item => 
      item.producto._id.toString() === productId.toString()
    )
    return item ? item.cantidad : 0
  }

  return {
    items,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isInCart,
    getProductQuantity
  }
})