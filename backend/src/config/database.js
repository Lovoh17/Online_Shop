import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;
let client;
let isConnecting = false;

export async function connectDB() {
    try {
        // Evitar múltiples conexiones simultáneas
        if (isConnecting) {
            console.log("🟡 Conexión ya en progreso...");
            return;
        }

        if (db) {
            console.log("🟢 Ya conectado a MongoDB");
            return db;
        }

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI no está definido en .env");
        }

        isConnecting = true;

        // Configuración del pool de conexiones y timeouts
        client = new MongoClient(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Forzar IPv4
        });

        await client.connect();
        db = client.db("tienda_online");

        console.log("🟢 Conectado a MongoDB");
        console.log(`📊 Pool de conexiones: máximo ${client.options.maxPoolSize}`);

        // Configurar eventos de reconexión
        setupConnectionEvents();

        isConnecting = false;
        return db;

    } catch (error) {
        isConnecting = false;
        console.error("🔴 Error de conexión a MongoDB:", error.message);

        // En desarrollo, intentar reconectar
        if (process.env.NODE_ENV === 'development') {
            console.log("🟡 Reintentando conexión en 5 segundos...");
            setTimeout(() => {
                connectDB().catch(console.error);
            }, 5000);
        } else {
            process.exit(1);
        }
    }
}

// Configurar eventos de conexión
function setupConnectionEvents() {
    if (!client) return;

    client.on('close', () => {
        console.log('🟡 Conexión MongoDB cerrada inesperadamente');
        db = null;

        // Reconectar automáticamente
        if (process.env.NODE_ENV !== 'test') {
            console.log('🔄 Reintentando conexión en 5 segundos...');
            setTimeout(() => {
                connectDB().catch(console.error);
            }, 5000);
        }
    });

    client.on('error', (error) => {
        console.error('🔴 Error en cliente MongoDB:', error.message);
    });

    client.on('serverHeartbeatFailed', (event) => {
        console.warn('🟡 Heartbeat fallido:', event.failure?.message);
    });

    client.on('serverHeartbeatSucceeded', () => {
        if (!db) {
            console.log('💚 Heartbeat exitoso - reconectando DB...');
            db = client.db("tienda_online");
        }
    });
}

export function getDB() {
    if (!db) {
        throw new Error("Base de datos no conectada. Llama a connectDB() primero.");
    }
    return db;
}

// Middleware mejorado para verificar conexión a DB
export const checkDB = (req, res, next) => {
    if (!db) {
        return res.status(500).json({
            success: false,
            mensaje: "Base de datos no conectada",
            error: "DATABASE_NOT_CONNECTED"
        });
    }

    // Agregar instancia de DB al request para fácil acceso
    req.db = db;
    next();
};

// Middleware para verificar salud de la conexión
export const healthCheck = async (req, res, next) => {
    try {
        if (!db) {
            throw new Error("DB no disponible");
        }

        // Ping rápido para verificar conexión
        await db.admin().ping();
        next();
    } catch (error) {
        console.error('🔴 Health check falló:', error.message);
        return res.status(503).json({
            success: false,
            mensaje: "Base de datos no disponible",
            error: "DATABASE_UNAVAILABLE"
        });
    }
};

// Cerrar conexión con cleanup
export async function closeDB() {
    try {
        if (client) {
            await client.close();
            db = null;
            client = null;
            console.log("🔴 Conexión a MongoDB cerrada limpiamente");
        }
    } catch (error) {
        console.error("🔴 Error cerrando conexión:", error.message);
    }
}

// Verificar estado de conexión
export function isConnected() {
    return !!db && !!client && client.topology?.isConnected();
}

// Obtener estadísticas de conexión
export async function getConnectionStats() {
    if (!db) {
        return { connected: false };
    }

    try {
        const admin = db.admin();
        const stats = await admin.serverStatus();

        return {
            connected: true,
            connections: stats.connections,
            uptime: stats.uptime,
            version: stats.version
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error.message);
        return { connected: false, error: error.message };
    }
}

// Manejo de errores de conexión no manejados
process.on("unhandledRejection", (err) => {
    console.error("🔴 Error no manejado:", err);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('🔴 Excepción no capturada:', err);
    closeDB().finally(() => {
        process.exit(1);
    });
});

// Cierre adecuado al terminar (Ctrl+C)
process.on('SIGINT', async () => {
    console.log('\n🟡 Cerrando aplicación...');
    await closeDB();
    process.exit(0);
});

// Cierre adecuado en producción (PM2, Docker, etc.)
process.on('SIGTERM', async () => {
    console.log('🟡 SIGTERM recibido, cerrando aplicación...');
    await closeDB();
    process.exit(0);
});

// Auto-reconectar cada cierto tiempo si no está conectado
setInterval(async () => {
    if (!isConnected() && process.env.NODE_ENV !== 'test') {
        console.log('🔄 Verificando conexión...');
        try {
            await connectDB();
        } catch (error) {
            console.error('🔴 Error en auto-reconexión:', error.message);
        }
    }
}, 30000); // Verificar cada 30 segundos