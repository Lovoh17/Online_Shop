import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/database.js";
import corsMiddleware from "./config/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { CategoriaRoutes } from "./modules/index.js";

dotenv.config();
const app = express();

// Middlewares globales de seguridad y parsing
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' })); 
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use("/uploads", express.static("uploads"));

// Middleware para logging de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Ruta principal con health check mejorado
app.get("/", async (req, res) => {
  try {
    const db = getDB();
    await db.admin().ping();

    res.json({
      success: true,
      message: "API funcionando correctamente",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      status: "healthy",
      database: "connected",
      endpoints: {
        categorias: '/api/categorias',
        // productos: '/api/productos',
        // carrito: '/api/carrito',
        // pedidos: '/api/pedidos',
        // usuarios: '/api/usuarios',
        health: '/api/health'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Servicio no disponible",
      status: "unhealthy",
      database: "disconnected",
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta específica de health check
app.get("/api/health", async (req, res) => {
  try {
    const db = getDB();
    const startTime = Date.now();
    await db.admin().ping();
    const responseTime = Date.now() - startTime;

    // Obtener estadísticas de conexión si está disponible
    let dbStats = null;
    try {
      const stats = await db.admin().serverStatus();
      dbStats = {
        connections: stats.connections,
        uptime: stats.uptime,
        version: stats.version
      };
    } catch (statsError) {
      dbStats = { error: "No se pudieron obtener estadísticas" };
    }

    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: "connected",
        responseTime: `${responseTime}ms`,
        stats: dbStats
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "disconnected",
        error: error.message
      }
    });
  }
});

// Iniciar servidor
async function startServer() {
  try {
    await connectDB();
    const db = getDB();

    // Configurar rutas de la API DESPUÉS de conectar a la base de datos
    app.use('/api/categorias', CategoriaRoutes(db));

    // Middleware para rutas no encontradas (debe ir después de todas las rutas)
    app.use(notFoundHandler);

    // Middleware global de manejo de errores (debe ir al final)
    app.use(errorHandler);

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔌 API disponible en: http://localhost:${PORT}/api`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("💥 Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});

startServer();