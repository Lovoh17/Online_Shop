import cors from 'cors';

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware de CORS configurado
const corsMiddleware = cors(corsOptions);

// También exportamos las opciones por si se necesitan en otro lugar
export { corsOptions };
export default corsMiddleware;