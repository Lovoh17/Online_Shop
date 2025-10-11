import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// Configuración
const MONGO_URI = 'mongodb+srv://ll22017:is0UKTRoiDHsCmqS@clusterlino.1x3evne.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLino';
const DB_NAME = 'tienda_online';

// URLs de imágenes outdoor específicas por categoría y género
const imagenesProductos = {
  hombre: {
    camisas: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598032895397-b9971e9d8b4b?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500&h=600&fit=crop'
    ],
    chaquetas: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608789419673-d3b43d598ed9?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=500&h=600&fit=crop'
    ],
    pantalones: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1624378441864-6eda7eac51cb?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905520-c19b5cca0c15?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop'
    ],
    calzado: [
      'https://images.unsplash.com/photo-1542219550-37153d387c27?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612821982652-c969afb918be?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520256788229-d4640c632e4d?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1627459506043-ff51c49ce679?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=600&fit=crop'
    ],
    accesorios: [
      'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618677831574-34e0b94d2bc0?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591788534043-e81e71cd4499?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?w=500&h=600&fit=crop'
    ]
  },
  mujer: {
    camisas: [
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564257577154-75ddb5842015?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f37f3018?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&h=600&fit=crop'
    ],
    chaquetas: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548731308-68a51a97a12f?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&h=600&fit=crop'
    ],
    pantalones: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552883843-75df14053b4a?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&h=600&fit=crop'
    ],
    calzado: [
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
  }
};

// Función para obtener imágenes específicas por categoría y género
const obtenerImagenesProducto = (genero, categoriaSlug) => {
  const imagenesCategoria = imagenesProductos[genero]?.[categoriaSlug] || imagenesProductos.hombre.camisas;
  const imagenes = [];
  
  // Seleccionar 3 imágenes aleatorias de la categoría
  for (let i = 0; i < 3; i++) {
    const imagenAleatoria = faker.helpers.arrayElement(imagenesCategoria);
    if (!imagenes.includes(imagenAleatoria)) {
      imagenes.push(imagenAleatoria);
    } else {
      const index = imagenesCategoria.indexOf(imagenAleatoria);
      const siguienteIndex = (index + 1) % imagenesCategoria.length;
      imagenes.push(imagenesCategoria[siguienteIndex]);
    }
  }
  
  return imagenes;
};

// Nombres de productos outdoor específicos por categoría y género (AMPLIADOS)
const nombresProductos = {
  hombre: {
    camisas: [
      'Flats V Short Sleeve',
      'Columbia PFG Bahama II',
      'The North Face Hiking Shirt',
      'Patagonia Sun Stretch Shirt',
      'Free Country Fishing Shirt',
      'Bimini Bay Performance Shirt',
      'Outdoor Research Echo Tee',
      'Arc\'teryx Captive Polo',
      'Mountain Hardwear Canyon Pro',
      'Marmot Windridge SS',
      'REI Co-op Sahara Tech',
      'prAna Prana Shirt'
    ],
    chaquetas: [
      'Columbia Watertight II Rain Jacket',
      'The North Face Resolve 2',
      'Patagonia Torrentshell 3L',
      'Marmot PreCip Eco Jacket',
      'Arc\'teryx Beta LT',
      'Mountain Hardwear Stretch Ozonic',
      'REI Co-op Rainier Rain Jacket',
      'Outdoor Research Helium',
      'Patagonia Nano Puff',
      'The North Face Apex Flex',
      'Columbia Bugaboo II',
      'Mountain Hardwear Ghost Whisperer'
    ],
    pantalones: [
      'Columbia Silver Ridge Cargo',
      'Prana Stretch Zion',
      'The North Face Paramount Trail',
      'Patagonia Quandary Pants',
      'Outdoor Research Ferrosi',
      'REI Co-op Sahara Convertible',
      'Fjallraven Vidda Pro',
      'Arc\'teryx Gamma LT',
      'Mountain Hardwear AP Pant',
      'Marmot Arch Rock',
      'KUHL Renegade Pant',
      'prAna Brion Pants'
    ],
    calzado: [
      'Merrell Moab 3 Hiking Boots',
      'Salomon X Ultra 4 GTX',
      'KEEN Targhee III Waterproof',
      'Columbia Newton Ridge Plus',
      'The North Face Vectiv Fastpack',
      'Vasque Breeze LT GTX',
      'La Sportiva Spire GTX',
      'Scarpa Zodiac Plus GTX',
      'Asolo Falcon GV',
      'Danner Trail 2650',
      'Oboz Bridger Mid BDry',
      'Lowa Renegade GTX Mid'
    ],
    accesorios: [
      'Columbia Bora Bora Booney Hat',
      'Buff Original Multifunctional Headwear',
      'Patagonia Performance Better Cap',
      'The North Face Horizon Breeze',
      'Outdoor Research Sun Runner Cap',
      'Columbia PFG Mesh Snap Back',
      'Arc\'teryx Bird Cap',
      'Mountain Hardwear Canyon Sun Hat',
      'REI Co-op Sahara Shade',
      'Sunday Afternoons Ultra Adventure',
      'Tilley Endurables LTM6',
      'Outdoor Research Seattle Sombrero'
    ]
  },
  mujer: {
    camisas: [
      'Columbia Tamiami II Short Sleeve',
      'The North Face Aphrodite Motion',
      'Patagonia Cap Cool Daily Shirt',
      'prAna Islet Tunic',
      'Royal Robbins Expedition',
      'Outdoor Research Echo Tee',
      'Arc\'teryx Captive SS',
      'Mountain Hardwear Crater Lake',
      'Marmot Windridge LS',
      'REI Co-op Active Pursuits',
      'Free Fly Bamboo Motion',
      'Columbia Silver Ridge Lite'
    ],
    chaquetas: [
      'Patagonia Nano Puff Jacket',
      'The North Face Venture 2',
      'Columbia Arcadia II Rain Jacket',
      'Marmot Minimalist GTX',
      'Arc\'teryx Atom LT Hoody',
      'Mountain Hardwear Ghost Whisperer',
      'Outdoor Research Helium Rain',
      'REI Co-op Rainier Rain Jacket',
      'Patagonia Torrentshell 3L',
      'The North Face Resolve Plus',
      'Columbia OutDry Ex Eco',
      'Mountain Hardwear Kor Preshell'
    ],
    pantalones: [
      'prAna Halle Straight Pants',
      'Columbia Saturday Trail Pant',
      'The North Face Aphrodite Capri',
      'Patagonia High Spy Pants',
      'Outdoor Research Ferrosi',
      'Royal Robbins Discovery III',
      'Arc\'teryx Gamma LT',
      'Mountain Hardwear Dynama Ankle',
      'KUHL Freeflex Roll-Up',
      'Fjallraven Abisko Lite Trekking',
      'Marmot Lieback',
      'REI Co-op Sahara Convertible'
    ],
    calzado: [
      'Merrell Moab 3 Waterproof',
      'Salomon X Ultra 4 GTX Women',
      'KEEN Targhee III Low',
      'The North Face Vectiv Exploris',
      'Columbia Newton Ridge Plus',
      'Vasque Breeze LT Mid GTX',
      'La Sportiva Spire GTX Surround',
      'Scarpa Zodiac Plus GTX',
      'Oboz Sawtooth X Mid BDry',
      'Danner Trail 2650 Mid GTX',
      'Lowa Renegade GTX Mid',
      'Asolo Falcon GV ML'
    ],
    accesorios: [
      'Buff UV Insect Shield Multifunctional',
      'Patagonia Quandary Brimmer Hat',
      'Columbia Sun Goddess II Booney',
      'The North Face Horizon Ball Cap',
      'Outdoor Research Oasis Sun Sombrero',
      'Sunday Afternoons Adventure Hat',
      'Arc\'teryx Bird Head Toque',
      'Mountain Hardwear Canyon Wide Brim',
      'REI Co-op Sahara Shade Hat',
      'Tilley Endurables TWC7',
      'Buff Pack Run Cap',
      'Outdoor Research Sombriolet Sun Hat'
    ]
  }
};

// Marcas outdoor reconocidas
const marcasOutdoor = [
  'Columbia',
  'The North Face',
  'Patagonia',
  'Marmot',
  'Arc\'teryx',
  'Mountain Hardwear',
  'prAna',
  'Royal Robbins',
  'Outdoor Research',
  'Free Country',
  'Bimini Bay',
  'Merrell',
  'Salomon',
  'KEEN',
  'Vasque',
  'REI Co-op',
  'Fjallraven',
  'KUHL',
  'La Sportiva',
  'Scarpa',
  'Asolo',
  'Danner',
  'Oboz',
  'Lowa',
  'Sunday Afternoons',
  'Tilley',
  'Free Fly'
];

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

  // 2. Categorías - organizadas por género
  const categories = [
    // Categorías de Hombre
    { nombre: 'Camisas Hombre', slug: 'camisas', genero: 'hombre', icono: '👔' },
    { nombre: 'Chaquetas Hombre', slug: 'chaquetas', genero: 'hombre', icono: '🧥' },
    { nombre: 'Pantalones Hombre', slug: 'pantalones', genero: 'hombre', icono: '👖' },
    { nombre: 'Calzado Hombre', slug: 'calzado', genero: 'hombre', icono: '👞' },
    { nombre: 'Accesorios Hombre', slug: 'accesorios', genero: 'hombre', icono: '🧢' },
    
    // Categorías de Mujer
    { nombre: 'Camisas Mujer', slug: 'camisas', genero: 'mujer', icono: '👚' },
    { nombre: 'Chaquetas Mujer', slug: 'chaquetas', genero: 'mujer', icono: '🧥' },
    { nombre: 'Pantalones Mujer', slug: 'pantalones', genero: 'mujer', icono: '👖' },
    { nombre: 'Calzado Mujer', slug: 'calzado', genero: 'mujer', icono: '👠' },
    { nombre: 'Accesorios Mujer', slug: 'accesorios', genero: 'mujer', icono: '🧣' }
  ];

  // 3. Productos (60 productos - 6 por cada categoría)
  const products = [];
  const tallesHombre = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  const tallesMujer = ['XS', 'S', 'M', 'L', 'XL'];
  const tallesCalzado = ['7', '8', '9', '10', '11', '12'];
  const colores = ['Azul', 'Negro', 'Gris', 'Verde Oliva', 'Khaki', 'Marrón', 'Rojo', 'Blanco'];

  categories.forEach(category => {
    // 6 productos por categoría (duplicamos)
    for (let i = 0; i < 6; i++) {
      const nombresCategoria = nombresProductos[category.genero][category.slug];
      const nombreProducto = nombresCategoria[i] || `${category.nombre} Premium ${i + 1}`;
      
      // Determinar tallas según la categoría
      let tallesProducto;
      if (category.slug === 'calzado') {
        tallesProducto = tallesCalzado;
      } else if (category.slug === 'accesorios') {
        tallesProducto = ['Único'];
      } else {
        tallesProducto = category.genero === 'hombre' ? tallesHombre : tallesMujer;
      }
      
      products.push({
        nombre: nombreProducto,
        descripcion: `${nombreProducto} de alta calidad para actividades outdoor. Diseñado con materiales técnicos resistentes al agua y secado rápido. Ideal para hiking, camping, fishing y aventuras al aire libre.`,
        precio: parseFloat(faker.commerce.price({ min: 29.99, max: 199.99 })),
        precioOriginal: parseFloat(faker.commerce.price({ min: 40, max: 250 })),
        categoria: category.nombre,
        categoriaSlug: category.slug,
        genero: category.genero,
        imagenes: obtenerImagenesProducto(category.genero, category.slug),
        stock: faker.number.int({ min: 5, max: 50 }),
        talles: tallesProducto,
        colores: faker.helpers.arrayElements(colores, { min: 2, max: 4 }),
        etiquetas: [
          category.slug,
          category.genero,
          faker.helpers.arrayElement(['nuevo', 'tendencia', 'popular', 'oferta']),
          faker.helpers.arrayElement(['hiking', 'camping', 'fishing', 'trail', 'outdoor'])
        ],
        fechaCreacion: faker.date.recent(),
        // Campos adicionales outdoor
        marca: faker.helpers.arrayElement(marcasOutdoor),
        material: faker.helpers.arrayElement([
          'Nylon Ripstop',
          'Poliéster Reciclado',
          'Gore-Tex',
          'Supplex Nylon',
          'Quick-Dry Fabric',
          'Stretch Canvas',
          'Merino Wool Blend'
        ]),
        caracteristicas: faker.helpers.arrayElements([
          'Resistente al agua',
          'Protección UV 50+',
          'Secado rápido',
          'Transpirable',
          'Costuras selladas',
          'Bolsillos con cremallera',
          'Ajuste ergonómico',
          'Antibacterial',
          'Elástico en 4 direcciones',
          'Tratamiento DWR'
        ], { min: 4, max: 6 }),
        cuidados: 'Lavar a máquina con agua fría. No usar lejía. Secar al aire libre o secadora a baja temperatura.',
        valoracion: parseFloat(faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })),
        numeroReviews: faker.number.int({ min: 5, max: 250 }),
        peso: faker.number.float({ min: 0.2, max: 2.5, fractionDigits: 2 }), // en kg
        origen: faker.helpers.arrayElement(['USA', 'Vietnam', 'China', 'Bangladesh', 'México']),
        garantia: '1 año',
        descuento: faker.helpers.arrayElement([0, 0, 0, 10, 15, 20, 25]), // 0 = sin descuento
        nuevo: faker.datatype.boolean(0.3) // 30% de probabilidad de ser nuevo
      });
    }
  });

  // 4. Pedidos (10 pedidos)
  const orders = [];
  for (let i = 0; i < 10; i++) {
    const user = faker.helpers.arrayElement(users);
    const numeroProductos = faker.number.int({ min: 1, max: 4 });
    const productosDelPedido = [];
    let totalPedido = 0;

    for (let j = 0; j < numeroProductos; j++) {
      const product = faker.helpers.arrayElement(products);
      const cantidad = faker.number.int({ min: 1, max: 2 });
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
    
    const envio = totalPedido > 50 ? 0 : 7.99; // Envío gratis por compras >$50
    const impuestos = totalPedido * 0.13; // 13% de impuestos
    
    orders.push({
      usuarioId: null, // Se actualizará después
      productos: productosDelPedido,
      subtotal: totalPedido,
      impuestos: impuestos,
      envio: envio,
      total: totalPedido + impuestos + envio,
      direccionEnvio: {
        ...user.direccion,
        nombreCompleto: user.nombre,
        telefono: user.telefono
      },
      estado: faker.helpers.arrayElement(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']),
      fechaPedido: faker.date.recent(),
      fechaEstimadaEntrega: faker.date.future(),
      metodoPago: faker.helpers.arrayElement(['tarjeta', 'paypal', 'transferencia', 'contraentrega']),
      numeroSeguimiento: `DRIP${faker.number.int({ min: 100000, max: 999999 })}`,
      notas: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
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
    console.log(`   📂 Categorías: ${categories.length} (5 hombre, 5 mujer)`);
    console.log(`   🛍️  Productos: ${products.length} (60 productos outdoor - 6 por categoría)`);
    console.log(`   📦 Pedidos: ${orders.length}`);
    console.log('\n🎯 Características de la tienda DRIP OUTDOOR:');
    console.log('   🏔️  60 productos outdoor de marcas reconocidas');
    console.log('   👨 Categorías para hombre: Camisas, Chaquetas, Pantalones, Calzado, Accesorios (6 productos c/u)');
    console.log('   👩 Categorías para mujer: Camisas, Chaquetas, Pantalones, Calzado, Accesorios (6 productos c/u)');
    console.log('   📸 Imágenes específicas por categoría y género desde Unsplash');
    console.log('   🏷️  Información técnica: material, características, peso, garantía');
    console.log('   💰 Sistema de descuentos y productos nuevos');
    console.log('   ⭐ Valoraciones y reseñas de clientes');
    
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
};

runSeed();