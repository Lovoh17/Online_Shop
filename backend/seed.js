import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// Configuración
const MONGO_URI = 'mongodb+srv://ll22017:is0UKTRoiDHsCmqS@clusterlino.1x3evne.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLino';
const DB_NAME = 'tienda_online';

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

  // 3. Productos (15 productos)
  const products = [];
  const talles = ['XS', 'S', 'M', 'L', 'XL'];
  const colores = ['Rojo', 'Negro', 'Blanco', 'Azul', 'Rosa'];

  for (let i = 0; i < 15; i++) {
    const category = faker.helpers.arrayElement(categories);
    
    products.push({
      nombre: `Producto ${faker.commerce.productName()}`,
      descripcion: faker.commerce.productDescription(),
      precio: parseFloat(faker.commerce.price({ min: 9.99, max: 199.99 })),
      precioOriginal: parseFloat(faker.commerce.price({ min: 15, max: 250 })),
      categoria: category.nombre,
      categoriaSlug: category.slug,
      imagenes: Array.from({ length: 3 }, () => faker.image.urlLoremFlickr({ category: 'fashion' })),
      stock: faker.number.int({ min: 0, max: 100 }),
      talles,
      colores,
      etiquetas: [faker.commerce.department(), 'nuevo', 'tendencia'],
      fechaCreacion: faker.date.recent()
    });
  }

  // 4. Pedidos (8 pedidos)
  const orders = [];
  for (let i = 0; i < 8; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const cantidad = faker.number.int({ min: 1, max: 5 });
    
    orders.push({
      usuarioId: null, // Se actualizará después
      productos: [{
        productoId: null, // Se actualizará después
        cantidad,
        precioUnitario: product.precio,
        talle: faker.helpers.arrayElement(talles),
        color: faker.helpers.arrayElement(colores)
      }],
      total: cantidad * product.precio,
      direccionEnvio: user.direccion,
      estado: faker.helpers.arrayElement(['pendiente', 'enviado', 'entregado', 'cancelado']),
      fechaPedido: faker.date.recent(),
      metodoPago: faker.helpers.arrayElement(['tarjeta', 'paypal', 'transferencia'])
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
    
    // Limpiar colecciones existentes
    await db.collection('usuarios').deleteMany({});
    await db.collection('categorias').deleteMany({});
    await db.collection('productos').deleteMany({});
    await db.collection('pedidos').deleteMany({});

    // Generar datos
    const { users, categories, products, orders } = await generateSeedData();

    // Insertar datos y obtener IDs
    const usersResult = await db.collection('usuarios').insertMany(users);
    const categoriesResult = await db.collection('categorias').insertMany(categories);
    const productsResult = await db.collection('productos').insertMany(products);

    // Actualizar pedidos con IDs reales
    const ordersWithIds = orders.map(order => {
      const randomUser = faker.helpers.objectValue(usersResult.insertedIds);
      const randomProduct = faker.helpers.objectValue(productsResult.insertedIds);
      
      return {
        ...order,
        usuarioId: randomUser,
        productos: order.productos.map(p => ({
          ...p,
          productoId: randomProduct
        }))
      };
    });

    await db.collection('pedidos').insertMany(ordersWithIds);

    console.log('✅ Datos de prueba insertados correctamente:');
    console.log(`- Usuarios: ${users.length}`);
    console.log(`- Categorías: ${categories.length}`);
    console.log(`- Productos: ${products.length}`);
    console.log(`- Pedidos: ${orders.length}`);
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await client.close();
  }
};

runSeed();