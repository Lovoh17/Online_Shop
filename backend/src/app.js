import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./config/database.js";
import corsMiddleware from "./config/cors.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { CategoriaRoutes, setupHealthChecks } from "./modules/index.js";

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

// Configurar rutas de health check
setupHealthChecks(app);

// Iniciar servidor
async function startServer() {
  try {
    await connectDB();
    const db = getDB();

    // Configurar rutas de la API 
    app.use(CategoriaRoutes(db));

    // Middleware para rutas no encontradas 
    app.use(notFoundHandler);

    // Middleware global de manejo de errores 
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