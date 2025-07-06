import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb" // Añade ObjectId aquí
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

dotenv.config()
const app = express()

// Configuración CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Conexión a MongoDB
let db, cliente
try {
  cliente = new MongoClient(process.env.MONGO_URI)
  await cliente.connect()
  db = cliente.db("Miapp")
  console.log("Conectado a MongoDB")
} catch (error) {
  console.error("Error de conexión a MongoDB:", error)
  process.exit(1)
}



const usuarios = db.collection("usuarios")
app.post("/register", async (req, res) => {
    try {
        const { nombre, email, password } = req.body
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son requeridos" })
        }

        const existente = await usuarios.findOne({ email })
        if(existente) {
            return res.status(400).json({ mensaje: "El usuario ya existe" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await usuarios.insertOne({ 
            nombre, 
            email, 
            password: hashedPassword,
            createdAt: new Date()
        })
        
        res.status(201).json({ 
            mensaje: "Usuario registrado correctamente",
            id: result.insertedId
        })
    } catch (error) {
        console.error("Error en registro:", error)
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        db: db ? 'Connected' : 'Disconnected',
        time: new Date()
    })
})


// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            return res.status(400).json({ mensaje: "Email y contraseña son requeridos" })
        }

        const usuario = await usuarios.findOne({ email })
        if(!usuario) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" })
        }

        const passwordMatch = await bcrypt.compare(password, usuario.password)
        if(!passwordMatch) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" })
        }

        const token = jwt.sign(
            { 
                id: usuario._id.toString(),
                email: usuario.email,
                nombre: usuario.nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({ 
            mensaje: "Bienvenido", 
            nombre: usuario.nombre,
            email: usuario.email,
            token
        })
    } catch (error) {
        console.error("Error en login:", error)
        res.status(500).json({ mensaje: "Error interno del servidor" })
    }
})

// Middleware de autenticación
function autenticar(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token) {
        return res.status(401).json({ mensaje: "Acceso no autorizado" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            console.error("Error verificando token:", err)
            return res.status(401).json({ mensaje: "Token inválido o expirado" })
        }
        
        req.usuario = {
            id: decoded.id,
            email: decoded.email,
            nombre: decoded.nombre
        }
        next()
    })
}

// Ruta de perfil
// En tu ruta /perfil (backend)
app.get('/perfil', autenticar, async (req, res) => {
  try {
    const usuario = await usuarios.findOne({ 
      _id: new ObjectId(req.usuario.id) 
    })
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    
    res.json({ usuario })
  } catch (error) {
    console.error('Error en perfil:', error)
    res.status(500).json({ error: 'Error al cargar perfil' })
  }
})

// Productos
app.get("/productos", async (req, res) => {
    try {
        const productos = await db.collection("productos").find().toArray()
        res.json(productos)
    } catch (error) {
        console.error("Error obteniendo productos:", error)
        res.status(500).json({ mensaje: "Error al obtener productos" })
    }
})

// Modelo de datos para el carrito
app.post('/carrito', autenticar, async (req, res) => {
  try {
    const { productoId, cantidad } = req.body
    
    if (!productoId || !cantidad || cantidad < 1) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos inválidos',
        details: {
          productoId: !productoId ? 'Falta productoId' : undefined,
          cantidad: !cantidad ? 'Falta cantidad' : cantidad < 1 ? 'Cantidad debe ser mayor a 0' : undefined
        }
      })
    }

    if (!ObjectId.isValid(productoId)) {
      return res.status(400).json({ 
        success: false,
        error: 'ID de producto inválido' 
      })
    }

    const producto = await db.collection('productos').findOne({ 
      _id: new ObjectId(productoId) 
    })
    
    if (!producto) {
      return res.status(404).json({ 
        success: false,
        error: 'Producto no encontrado',
        productoId 
      })
    }
    
    let carrito = await db.collection('carritos').findOne({ usuarioId: new ObjectId(req.usuario.id) })
    
    if (!carrito) {
      carrito = {
        usuarioId: new ObjectId(req.usuario.id),
        items: [{
          producto: {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            descripcion: producto.descripcion
          },
          cantidad: cantidad
        }],
        actualizadoEn: new Date()
      }
      
      await db.collection('carritos').insertOne(carrito)
    } else {
      const itemExistente = carrito.items.find(item => item.producto._id.toString() === productoId)
      
      if (itemExistente) {
        itemExistente.cantidad += cantidad
      } else {
        carrito.items.push({
          producto: {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            descripcion: producto.descripcion
          },
          cantidad: cantidad
        })
      }
      
      carrito.actualizadoEn = new Date()
      await db.collection('carritos').updateOne(
        { _id: carrito._id },
        { $set: carrito }
      )
    }
    
    res.status(200).json({ 
      success: true,
      mensaje: 'Producto agregado al carrito',
      carrito
    })
  } catch (error) {
    console.error('Error al agregar al carrito:', error)
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message 
    })
  }
})

app.get('/carrito', autenticar, async (req, res) => {
  try {
    const carrito = await db.collection('carritos').findOne({ 
      usuarioId: new ObjectId(req.usuario.id) 
    }, {
      projection: { _id: 0, usuarioId: 0 } // Exclude these fields
    })
    
    if (!carrito) {
      return res.status(200).json({ 
        success: true,
        items: [],
        message: 'Carrito vacío'
      })
    }
    
    res.status(200).json({
      success: true,
      items: carrito.items,
      lastUpdated: carrito.actualizadoEn
    })
    
  } catch (error) {
    console.error('Error al obtener carrito:', error)
    res.status(500).json({ 
      success: false,
      error: 'Error al cargar el carrito',
      details: error.message 
    })
  }
})

// Actualizar cantidad en carrito
app.put('/carrito/:productoId', autenticar, async (req, res) => {
  try {
    const { cantidad } = req.body
    const productoId = req.params.productoId
    
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' })
    }
    
    const carrito = await db.collection('carritos').findOne({ 
      usuarioId: new ObjectId(req.usuario.id) 
    })
    
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' })
    }
    
    const itemIndex = carrito.items.findIndex(
      item => item.producto._id.toString() === productoId
    )
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' })
    }
    
    carrito.items[itemIndex].cantidad = cantidad
    carrito.actualizadoEn = new Date()
    
    await db.collection('carritos').updateOne(
      { _id: carrito._id },
      { $set: carrito }
    )
    
    res.json({ mensaje: 'Cantidad actualizada' })
  } catch (error) {
    console.error('Error al actualizar carrito:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Eliminar producto del carrito
app.delete('/carrito/:productoId', autenticar, async (req, res) => {
  try {
    const productoId = req.params.productoId
    
    const carrito = await db.collection('carritos').findOne({ 
      usuarioId: new ObjectId(req.usuario.id) 
    })
    
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' })
    }
    
    const itemIndex = carrito.items.findIndex(
      item => item.producto._id.toString() === productoId
    )
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' })
    }
    
    carrito.items.splice(itemIndex, 1)
    carrito.actualizadoEn = new Date()
    
    if (carrito.items.length === 0) {
      await db.collection('carritos').deleteOne({ _id: carrito._id })
    } else {
      await db.collection('carritos').updateOne(
        { _id: carrito._id },
        { $set: carrito }
      )
    }
    
    res.json({ mensaje: 'Producto eliminado del carrito' })
  } catch (error) {
    console.error('Error al eliminar del carrito:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener datos del pago
app.get('/api/pago/datos', autenticar, async (req, res) => {
  try {
    const carrito = await db.collection('carritos').findOne({
      usuarioId: new ObjectId(req.usuario.id)
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Carrito vacío o no encontrado' 
      });
    }

    const usuario = await db.collection('usuarios').findOne({
      _id: new ObjectId(req.usuario.id)
    }, { projection: { direccion: 1, nombre: 1, email: 1 } });

    const total = carrito.items.reduce((sum, item) => 
      sum + (item.producto.precio * item.cantidad), 0
    );

    res.json({
      success: true,
      carritoId: carrito._id.toString(),
      items: carrito.items,
      total: total,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        direccion: usuario.direccion || 'No especificada'
      }
    });
  } catch (error) {
    console.error('Error al obtener datos de pago:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Procesar pago
app.post('/api/pago/procesar', autenticar, async (req, res) => {
  try {
    const { carritoId, datosTarjeta, direccionEnvio } = req.body;

    // Validaciones básicas
    if (!carritoId || !datosTarjeta) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos de pago incompletos' 
      });
    }

    if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.expiracion || !datosTarjeta.cvv) {
      return res.status(400).json({ 
        success: false, 
        error: 'Datos de tarjeta incompletos' 
      });
    }

    // Verificar que el carrito existe y pertenece al usuario
    const carrito = await db.collection('carritos').findOne({
      _id: new ObjectId(carritoId),
      usuarioId: new ObjectId(req.usuario.id)
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Carrito no encontrado o vacío' 
      });
    }

    // Calcular total
    const total = carrito.items.reduce((sum, item) => 
      sum + (item.producto.precio * item.cantidad), 0
    );

    // Procesar pago (simulado)
    const resultadoPago = await procesarPagoTarjeta(datosTarjeta, total);

    if (!resultadoPago.exito) {
      return res.status(400).json({ 
        success: false, 
        error: resultadoPago.mensaje || 'Pago rechazado',
        codigo: resultadoPago.codigo
      });
    }

    // Crear orden exitosa
    const orden = {
      usuarioId: new ObjectId(req.usuario.id),
      items: carrito.items,
      total: total,
      estado: 'pagado',
      metodoPago: 'tarjeta',
      referenciaPago: resultadoPago.referencia,
      direccionEnvio: direccionEnvio || 'Dirección no especificada',
      fechaCreacion: new Date(),
      fechaPago: new Date()
    };

    const resultadoOrden = await db.collection('ordenes').insertOne(orden);

    // Limpiar carrito después del pago exitoso
    await db.collection('carritos').deleteOne({ 
      _id: new ObjectId(carritoId) 
    });

    res.json({ 
      success: true,
      ordenId: resultadoOrden.insertedId.toString(),
      referencia: resultadoPago.referencia,
      total: total,
      mensaje: 'Pago procesado exitosamente'
    });

  } catch (error) {
    console.error('Error al procesar pago:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor al procesar el pago' 
    });
  }
});

// Función mejorada de procesamiento de pago simulado
async function procesarPagoTarjeta(datosTarjeta, monto) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simulación más realista
      const numeroTarjeta = datosTarjeta.numero.replace(/\s/g, '');
      
      // Validaciones básicas de tarjeta
      if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {
        resolve({
          exito: false,
          mensaje: 'Número de tarjeta inválido',
          codigo: 'INVALID_CARD'
        });
        return;
      }

      if (!datosTarjeta.cvv || datosTarjeta.cvv.length < 3) {
        resolve({
          exito: false,
          mensaje: 'CVV inválido',
          codigo: 'INVALID_CVV'
        });
        return;
      }

      // Simular diferentes tipos de respuesta
      const random = Math.random();
      
      if (random > 0.85) { // 15% falla
        const errores = [
          { mensaje: 'Fondos insuficientes', codigo: 'INSUFFICIENT_FUNDS' },
          { mensaje: 'Tarjeta expirada', codigo: 'EXPIRED_CARD' },
          { mensaje: 'Tarjeta cancelada', codigo: 'CANCELLED_CARD' }
        ];
        const error = errores[Math.floor(Math.random() * errores.length)];
        
        resolve({
          exito: false,
          mensaje: error.mensaje,
          codigo: error.codigo
        });
      } else { // 85% éxito
        resolve({
          exito: true,
          monto: monto,
          referencia: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          mensaje: 'Pago aprobado exitosamente'
        });
      }
    }, 2000); // Simular tiempo de procesamiento
  });
}

// Ruta para obtener detalles de una orden
app.get('/api/orden/:ordenId', autenticar, async (req, res) => {
  try {
    const orden = await db.collection('ordenes').findOne({
      _id: new ObjectId(req.params.ordenId),
      usuarioId: new ObjectId(req.usuario.id)
    });

    if (!orden) {
      return res.status(404).json({ 
        success: false, 
        error: 'Orden no encontrada' 
      });
    }

    res.json({ success: true, orden });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener detalles de la orden' 
    });
  }
});

// Manejo de errores
app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" })
})

// Cierre adecuado al terminar
process.on('SIGINT', async () => {
    await cliente.close()
    process.exit()
})

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000")
})