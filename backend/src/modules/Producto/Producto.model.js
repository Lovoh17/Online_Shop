export const productoSchema = {
    nombre: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100,
        trim: true
    },
    descripcion: {
        type: String,
        required: false,
        maxLength: 1000,
        default: ''
    },
    precio: {
        type: Number,
        required: true,
        min: 0.01,
        max: 1000000
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        required: false,
        default: ''
    },
    stock: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    caracteristicas: {
        type: [String],
        default: []
    }
};

export const validarProducto = (producto) => {
    const errors = [];

    if (!producto.nombre || producto.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!producto.precio || producto.precio <= 0) {
        errors.push('El precio debe ser mayor a 0');
    }

    if (!producto.categoria || producto.categoria.trim().length === 0) {
        errors.push('La categoría es requerida');
    }

    if (producto.stock && producto.stock < 0) {
        errors.push('El stock no puede ser negativo');
    }

    return errors;
};

export const categoriasPermitidas = [
    'electronica',
    'ropa',
    'hogar',
    'deportes',
    'libros',
    'juguetes',
    'alimentos',
    'belleza',
    'salud',
    'automotriz'
];