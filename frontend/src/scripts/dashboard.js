import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const productos = ref([]);
const imageError = ref({});
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const sortOption = ref('Recomendados');
const activeCategory = ref('Todos');
const priceRange = ref([0, 1000]);
const loading = ref(false);
const mobileFiltersOpen = ref(false);

const categories = ref([
  'Todos',
  'Ropa',
  'Accesorios',
  'Hogar',
  'Ofertas',
  'Nuevos'
]);

onMounted(async () => {
  try {
    loading.value = true;
    const res = await fetch("http://localhost:4000/productos");
    const data = await res.json();
    productos.value = data.map(p => ({
      ...p,
      categoria: p.categoria || ['Ropa', 'Accesorios', 'Hogar'][Math.floor(Math.random() * 3)],
      rating: p.rating || Math.floor(Math.random() * 5) + 1
    }));
  } catch (error) {
    console.error("Error al cargar los productos", error);
  } finally {
    loading.value = false;
  }
});

const filteredProducts = computed(() => {
  let result = [...productos.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(producto => 
      producto.nombre.toLowerCase().includes(query) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
    );
  }
  
  if (activeCategory.value !== 'Todos') {
    result = result.filter(producto => {
      if (activeCategory.value === 'Ofertas') {
        return producto.descuento > 0;
      } else if (activeCategory.value === 'Nuevos') {
        return producto.nuevo;
      }
      return producto.categoria === activeCategory.value;
    });
  }
  
  result = result.filter(producto => 
    producto.precio >= priceRange.value[0] && 
    producto.precio <= priceRange.value[1]
  );
  
  switch (sortOption.value) {
    case 'Precio: menor a mayor':
      result.sort((a, b) => a.precio - b.precio);
      break;
    case 'Precio: mayor a menor':
      result.sort((a, b) => b.precio - a.precio);
      break;
    case 'Más nuevos':
      result.sort((a, b) => new Date(b.fechaCreacion || new Date()) - new Date(a.fechaCreacion || new Date()));
      break;
    case 'Mejor valorados':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      break;
  }
  
  return result;
});

const handleImageError = (productoId) => {
  imageError.value[productoId] = true;
};

const addToCart = async (productoId) => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    await cartStore.addToCart(productoId);
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Producto agregado al carrito';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito');
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  activeCategory.value = 'Todos';
  priceRange.value = [0, 1000];
  sortOption.value = 'Recomendados';
};

const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category) => {
  activeCategory.value = category;
};

const toggleMobileFilters = () => {
  mobileFiltersOpen.value = !mobileFiltersOpen.value;
};