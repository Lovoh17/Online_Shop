import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

function autenticar(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
      console.log('❌ No se proporcionó token de autenticación');
      return res.status(401).json({ 
        success: false,
        message: "Acceso no autorizado. Token requerido.",
        code: "TOKEN_REQUIRED"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ Error verificando token:', err.message);
        
        let errorMessage = "Token inválido";
        let statusCode = 401;
        
        if (err.name === 'TokenExpiredError') {
          errorMessage = "Token expirado";
          statusCode = 401;
        } else if (err.name === 'JsonWebTokenError') {
          errorMessage = "Token malformado";
          statusCode = 400;
        }
        
        return res.status(statusCode).json({ 
          success: false,
          message: errorMessage,
          code: "INVALID_TOKEN"
        });
      }
      if (!decoded.id || !decoded.email) {
        console.error('❌ Token con estructura inválida:', decoded);
        return res.status(401).json({ 
          success: false,
          message: "Token inválido - estructura incorrecta",
          code: "MALFORMED_TOKEN"
        });
      }
      

      if (!ObjectId.isValid(decoded.id)) {
        console.error('❌ ID de usuario inválido en token:', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: "Token inválido - ID de usuario incorrecto",
          code: "INVALID_USER_ID"
        });
      }
      
      req.usuario = {
        id: decoded.id,
        email: decoded.email,
        nombre: decoded.nombre || 'Usuario'
      };
      
      console.log(`✅ Usuario autenticado: ${req.usuario.email} (ID: ${req.usuario.id})`);
      next();
    });
    
  } catch (error) {
    console.error('🔥 Error inesperado en middleware de autenticación:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error interno del servidor en autenticación",
      code: "AUTH_ERROR"
    });
  }
}

function requerirRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false,
        message: "Autenticación requerida",
        code: "AUTH_REQUIRED"
      });
    }
    //implemear la logica de roles
    next();
  };
}

function generarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
}

function verificarToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export default autenticar;
export { 
  autenticar, 
  requerirRol, 
  generarToken, 
  verificarToken 
};