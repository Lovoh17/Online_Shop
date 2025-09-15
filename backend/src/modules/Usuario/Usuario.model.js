
export const usuarioSchema = {
    nombre: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    direccion: {
        type: String,
        required: false,
        maxLength: 200
    },
    telefono: {
        type: String,
        required: false,
        match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    }
};

// Función de validación
export const validarUsuario = (usuario) => {
    const errors = [];
    
    if (!usuario.nombre || usuario.nombre.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!usuario.email || !usuario.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push('El email debe tener un formato válido');
    }
    
    if (!usuario.password || usuario.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    return errors;
};