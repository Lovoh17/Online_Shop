import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// Configuración
const MONGO_URI = 'mongodb+srv://ll22017:is0UKTRoiDHsCmqS@clusterlino.1x3evne.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLino';
const DB_NAME = 'tienda_online';

// URLs de imágenes específicas por categoría
const imagenesProductos = {
  vestidos: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566479179817-c7bbee4db051?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=600&fit=crop'
  ],
  blusas: [
    'https://images.unsplash.com/photo-1564257577154-75ddb5842015?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f37f3018?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&h=600&fit=crop'
  ],
  pantalones: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552883843-75df14053b4a?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506629905520-c19b5cca0c15?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=600&fit=crop'
  ],
  zapatos: [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1628563694622-5a76957fd09c?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=500&h=600&fit=crop'
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop'
  ]
};

// Función para obtener imágenes específicas por categoría
const obtenerImagenesProducto = (categoriaSlug) => {
  const imagenesCategoria = imagenesProductos[categoriaSlug] || imagenesProductos.vestidos;
  const imagenes = [];
  
  // Seleccionar 3 imágenes aleatorias de la categoría
  for (let i = 0; i < 3; i++) {
    const imagenAleatoria = faker.helpers.arrayElement(imagenesCategoria);
    if (!imagenes.includes(imagenAleatoria)) {
      imagenes.push(imagenAleatoria);
    } else {
      // Si ya existe, tomar la siguiente disponible
      const index = imagenesCategoria.indexOf(imagenAleatoria);
      const siguienteIndex = (index + 1) % imagenesCategoria.length;
      imagenes.push(imagenesCategoria[siguienteIndex]);
    }
  }
  
  return imagenes;
};

// Nombres de productos más específicos por categoría
const nombresProductos = {
  vestidos: [
    'Vestido Elegante de Noche',
    'Vestido Casual de Verano', 
    'Vestido Midi Floral',
    'Vestido Coctel Negro',
    'Vestido Maxi Bohemio',
    'Vestido Camisero Clásico'
  ],
  blusas: [
    'Blusa de Seda Premium',
    'Blusa Casual Algodón',
    'Camisa Ejecutiva',
    'Blusa Estampada Tropical',
    'Top Crop Moderno',
    'Blusa Manga Larga Elegante'
  ],
  pantalones: [
    'Jeans Skinny Clásicos',
    'Pantalón de Vestir Negro',
    'Leggings Deportivos',
    'Pantalón Palazzo Amplio',
    'Jeans Mom Fit Vintage',
    'Pantalón Cargo Moderno'
  ],
  zapatos: [
    'Tacones Altos Elegantes',
    'Sneakers Deportivos Premium',
    'Botas Ankle Modernas',
    'Sandalias de Verano',
    'Zapatos Oxford Clásicos',
    'Bailarinas Cómodas'
  ],
  accesorios: [
    'Bolso de Cuero Genuino',
    'Gafas de Sol Aviador',
    'Reloj Minimalista',
    'Collar Dorado Elegante',
    'Bufanda de Seda',
    'Aretes Perla Natural'
  ]
};

// Datos de prueba generados con Faker.js
const generateSeedData = async () => {
  // 1. Usuarios (5 clientes, 1 admin)
  const users = [];
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  for (let i = 0; i < 6; i++) {
    users.push({
      nombre: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      rol: i === 0 ? 'admin' : 'cliente',
      direccion: {
        calle: faker.location.streetAddress(),
        ciudad: faker.location.city(),
        pais: faker.location.country(),
        codigoPostal: faker.location.zipCode()
      },
      telefono: faker.phone.number(),
      fechaRegistro: faker.date.past()
    });
  }

  // 2. Categorías
  const categories = [
    { nombre: 'Vestidos', slug: 'vestidos', icono: '👗' },
    { nombre: 'Blusas', slug: 'blusas', icono: '👚' },
    { nombre: 'Pantalones', slug: 'pantalones', icono: '👖' },
    { nombre: 'Zapatos', slug: 'zapatos', icono: '👠' },
    { nombre: 'Accesorios', slug: 'accesorios', icono: '🕶️' }
  ];

  // 3. Productos (15 productos - 3 por cada categoría)
  const products = [];
  const talles = ['XS', 'S', 'M', 'L', 'XL'];
  const colores = ['Rojo', 'Negro', 'Blanco', 'Azul', 'Rosa', 'Verde', 'Gris', 'Beige'];

  categories.forEach(category => {
    // 3 productos por categoría
    for (let i = 0; i < 3; i++) {
      const nombresCategoria = nombresProductos[category.slug];
      const nombreProducto = nombresCategoria[i] || `${category.nombre} Premium ${i + 1}`;
      
      products.push({
        nombre: nombreProducto,
        descripcion: `${nombreProducto} de alta calidad. ${faker.commerce.productDescription()}`,
        precio: parseFloat(faker.commerce.price({ min: 19.99, max: 299.99 })),
        precioOriginal: parseFloat(faker.commerce.price({ min: 25, max: 350 })),
        categoria: category.nombre,
        categoriaSlug: category.slug,
        imagenes: obtenerImagenesProducto(category.slug),
        stock: faker.number.int({ min: 5, max: 100 }),
        talles: category.slug === 'accesorios' ? ['Único'] : talles,
        colores: faker.helpers.arrayElements(colores, { min: 2, max: 4 }),
        etiquetas: [
          category.slug,
          faker.helpers.arrayElement(['nuevo', 'tendencia', 'popular', 'oferta']),
          faker.helpers.arrayElement(['verano', 'invierno', 'casual', 'elegante'])
        ],
        fechaCreacion: faker.date.recent(),
        // Campos adicionales útiles
        marca: faker.company.name(),
        material: faker.helpers.arrayElement(['Algodón', 'Poliéster', 'Seda', 'Cuero', 'Denim', 'Lino']),
        cuidados: 'Lavar a máquina con agua fría. No usar lejía. Secar al aire libre.',
        valoracion: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })),
        numeroReviews: faker.number.int({ min: 0, max: 150 })
      });
    }
  });

  // 4. Pedidos (8 pedidos)
  const orders = [];
  for (let i = 0; i < 8; i++) {
    const user = faker.helpers.arrayElement(users);
    const numeroProductos = faker.number.int({ min: 1, max: 3 });
    const productosDelPedido = [];
    let totalPedido = 0;

    for (let j = 0; j < numeroProductos; j++) {
      const product = faker.helpers.arrayElement(products);
      const cantidad = faker.number.int({ min: 1, max: 3 });
      const subtotal = cantidad * product.precio;
      
      productosDelPedido.push({
        productoId: null, // Se actualizará después
        nombreProducto: product.nombre,
        cantidad,
        precioUnitario: product.precio,
        talle: faker.helpers.arrayElement(product.talles),
        color: faker.helpers.arrayElement(product.colores),
        subtotal
      });
      
      totalPedido += subtotal;
    }
    
    orders.push({
      usuarioId: null, // Se actualizará después
      productos: productosDelPedido,
      subtotal: totalPedido,
      impuestos: totalPedido * 0.12, // 12% de impuestos
      envio: totalPedido > 50 ? 0 : 5.99, // Envío gratis por compras >$50
      total: totalPedido + (totalPedido * 0.12) + (totalPedido > 50 ? 0 : 5.99),
      direccionEnvio: {
        ...user.direccion,
        nombreCompleto: user.nombre,
        telefono: user.telefono
      },
      estado: faker.helpers.arrayElement(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']),
      fechaPedido: faker.date.recent(),
      fechaEstimadaEntrega: faker.date.future(),
      metodoPago: faker.helpers.arrayElement(['tarjeta', 'paypal', 'transferencia']),
      numeroSeguimiento: `TRK${faker.number.int({ min: 100000, max: 999999 })}`
    });
  }

  return { users, categories, products, orders };
};

// Ejecutar el seeding
const runSeed = async () => {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('🔄 Conectando a MongoDB...');
    
    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones existentes...');
    await db.collection('usuarios').deleteMany({});
    await db.collection('categorias').deleteMany({});
    await db.collection('productos').deleteMany({});
    await db.collection('pedidos').deleteMany({});

    // Generar datos
    console.log('📊 Generando datos de prueba...');
    const { users, categories, products, orders } = await generateSeedData();

    // Insertar datos y obtener IDs
    console.log('💾 Insertando usuarios...');
    const usersResult = await db.collection('usuarios').insertMany(users);
    
    console.log('💾 Insertando categorías...');
    const categoriesResult = await db.collection('categorias').insertMany(categories);
    
    console.log('💾 Insertando productos...');
    const productsResult = await db.collection('productos').insertMany(products);

    // Actualizar pedidos con IDs reales
    console.log('💾 Insertando pedidos...');
    const ordersWithIds = orders.map(order => {
      const randomUser = faker.helpers.objectValue(usersResult.insertedIds);
      
      return {
        ...order,
        usuarioId: randomUser,
        productos: order.productos.map(p => {
          const randomProduct = faker.helpers.objectValue(productsResult.insertedIds);
          return {
            ...p,
            productoId: randomProduct
          };
        })
      };
    });

    await db.collection('pedidos').insertMany(ordersWithIds);

    console.log('\n✅ ¡Datos de prueba insertados correctamente!');
    console.log('📋 Resumen:');
    console.log(`   👥 Usuarios: ${users.length} (1 admin, ${users.length - 1} clientes)`);
    console.log(`   📂 Categorías: ${categories.length}`);
    console.log(`   🛍️  Productos: ${products.length} (3 por categoría con imágenes específicas)`);
    console.log(`   📦 Pedidos: ${orders.length}`);
    console.log('\n🎯 Características agregadas:');
    console.log('   • Imágenes específicas por categoría desde Unsplash');
    console.log('   • Nombres de productos más descriptivos');
    console.log('   • Información adicional: marca, material, valoraciones');
    console.log('   • Cálculos de impuestos y envío en pedidos');
    console.log('   • Números de seguimiento para pedidos');
    
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
};

runSeed();