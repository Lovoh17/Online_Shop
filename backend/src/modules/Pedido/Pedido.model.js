// Esquema de validación para pedidos
export const pedidoSchema = {
    usuarioId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: 'El pedido debe contener al menos un item'
        }
    },
    direccionEnvio: {
        type: Object,
        required: true,
        properties: {
            calle: { type: String, required: true },
            ciudad: { type: String, required: true },
            estado: { type: String, required: true },
            codigoPostal: { type: String, required: true },
            pais: { type: String, required: true }
        }
    },
    metodoPago: {
        type: String,
        required: true,
        enum: ['tarjeta', 'paypal', 'transferencia', 'efectivo']
    },
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
};

// Estados de pedido permitidos
export const estadosPedido = [
    'pendiente',
    'confirmado',
    'enviado',
    'entregado',
    'cancelado'
];

// Función de validación
export const validarPedido = (pedido) => {
    const errors = [];

    if (!pedido.usuarioId) {
        errors.push('ID de usuario es requerido');
    }

    if (!pedido.items || !Array.isArray(pedido.items) || pedido.items.length === 0) {
        errors.push('El pedido debe contener al menos un item');
    }

    if (!pedido.direccionEnvio) {
        errors.push('La dirección de envío es requerida');
    }

    if (pedido.total && pedido.total < 0) {
        errors.push('El total no puede ser negativo');
    }

    return errors;
};

// Dirección de envío schema
export const direccionEnvioSchema = {
    calle: { type: String, required: true },
    numeroExterior: { type: String, required: true },
    numeroInterior: { type: String, required: false },
    colonia: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true, default: 'México' },
    referencias: { type: String, required: false }
};