import express from "express";
import dotenv from "dotenv";

// Importar configuración de base de datos
import { connectDB } from "./config/database.js";

// Importar configuración CORS
import corsMiddleware from "./config/cors.js";

// Importar middlewares 
import {
  requestLogger,
  notFound,
  errorHandler
} from "./middleware/index.js";

// Importar rutas desde la estructura modular
import {
  ProductoRoutes,
  CarritoRoutes,
  CategoriaRoutes,
  PedidoRoutes,
  UsuarioRoutes
} from "./modules/index.js";

dotenv.config();
const app = express();

// Middlewares globales
app.use(requestLogger);
app.use(corsMiddleware); // ← Usamos el middleware de CORS importado
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));

// Configurar rutas de la API con estructura modular
app.use('/api/productos', ProductoRoutes);
app.use('/api/carrito', CarritoRoutes);
app.use('/api/categorias', CategoriaRoutes);
app.use('/api/pedidos', PedidoRoutes);
app.use('/api/usuarios', UsuarioRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      productos: '/api/productos',
      carrito: '/api/carrito',
      categorias: '/api/categorias',
      pedidos: '/api/pedidos',
      usuarios: '/api/usuarios',
      health: '/api/health'
    }
  });
});

// Middleware de rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    await connectDB();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📁 Modo: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

startServer();