// middleware/errorHandler.js
import { ObjectId } from 'mongodb';

// Clase para errores personalizados
export class AppError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errorCode = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Errores específicos de validación
export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}

// Error de recurso no encontrado
export class NotFoundError extends AppError {
    constructor(resource = 'Recurso') {
        super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    }
}

// Error de conflicto (duplicados, etc.)
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}

// Error de base de datos
export class DatabaseError extends AppError {
    constructor(message, originalError = null) {
        super(message, 500, 'DATABASE_ERROR');
        this.originalError = originalError;
    }
}

// Función para identificar tipos de errores MongoDB
const handleMongoError = (err) => {
    if (err.code === 11000) {
        // Error de clave duplicada
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return new ConflictError(`Ya existe un registro con ${field}: ${value}`);
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return new ValidationError('ID inválido proporcionado');
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return new ValidationError('Datos inválidos', errors);
    }

    return new DatabaseError('Error en la base de datos', err);
};

// Función para enviar errores en desarrollo
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: {
            status: err.status,
            message: err.message,
            code: err.errorCode,
            stack: err.stack,
            ...(err.errors && { errors: err.errors }),
            ...(err.originalError && { originalError: err.originalError.message })
        }
    });
};

// Función para enviar errores en producción
const sendErrorProd = (err, res) => {
    // Errores operacionales: enviar mensaje al cliente
    if (err.isOperational) {
        const response = {
            success: false,
            message: err.message,
            ...(err.errorCode && { code: err.errorCode }),
            ...(err.errors && { errors: err.errors })
        };

        res.status(err.statusCode).json(response);
    } else {
        // Errores de programación: no filtrar detalles al cliente
        console.error('ERROR 💥', err);

        res.status(500).json({
            success: false,
            message: 'Algo salió mal en el servidor',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
};

// Middleware principal de manejo de errores
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log del error
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${err.message}`);

    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    let error = { ...err };
    error.message = err.message;

    // Manejar diferentes tipos de errores
    if (err.name === 'CastError' || err.code === 11000 || err.name === 'ValidationError') {
        error = handleMongoError(err);
    }

    // Manejar errores de ObjectId inválido
    if (err.message?.includes('Invalid ObjectId')) {
        error = new ValidationError('ID de recurso inválido');
    }

    // Manejar errores de conexión a base de datos
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError') {
        error = new DatabaseError('Error de conexión con la base de datos');
    }

    // Enviar respuesta según el entorno
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res, next) => {
    const err = new NotFoundError(`Ruta ${req.originalUrl} no encontrada en este servidor`);
    next(err);
};

// Función helper para async error handling
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Función helper para validar ObjectId
export const validateObjectId = (id, fieldName = 'ID') => {
    if (!ObjectId.isValid(id)) {
        throw new ValidationError(`${fieldName} inválido`);
    }
};

// Función helper para crear errores de validación
export const createValidationError = (message, errors = []) => {
    return new ValidationError(message, errors);
};

// Función helper para crear errores 404
export const createNotFoundError = (resource) => {
    return new NotFoundError(resource);
};

// Función helper para crear errores de conflicto
export const createConflictError = (message) => {
    return new ConflictError(message);
};

export default {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    AppError,
    ValidationError,
    NotFoundError,
    ConflictError,
    DatabaseError,
    validateObjectId,
    createValidationError,
    createNotFoundError,
    createConflictError
};