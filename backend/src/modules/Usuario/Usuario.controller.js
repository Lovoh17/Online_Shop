import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { generarToken } from "../../middleware/auth.js"

class UsuarioController {
    constructor(db) {
        this.db = db;
    }

    async registrar(req, res) {
        try {
            const { nombre, email, password } = req.body;
            
            // Validaciones más robustas
            if (!nombre?.trim() || !email?.trim() || !password?.trim()) {
                return res.status(400).json({ 
                    success: false,
                    message: "Todos los campos son requeridos" 
                });
            }

            // Validación básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    success: false,
                    message: "Formato de email inválido" 
                });
            }

            // Validación de contraseña
            if (password.length < 6) {
                return res.status(400).json({ 
                    success: false,
                    message: "La contraseña debe tener al menos 6 caracteres" 
                });
            }

            const existente = await this.db.collection("usuarios").findOne({ 
                email: email.toLowerCase() 
            });
            
            if (existente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El usuario ya existe" 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12); // Aumentar salt rounds

            const result = await this.db.collection("usuarios").insertOne({ 
                nombre: nombre.trim(), 
                email: email.toLowerCase().trim(), 
                password: hashedPassword,
                direccion: null,
                telefono: null,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            res.status(201).json({ 
                success: true,
                message: "Usuario registrado correctamente",
                userId: result.insertedId
            });
        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).json({ 
                success: false,
                message: "Error interno del servidor" 
            });
        }
    }

    async login(req, res) {
    try {
        const { email, password } = req.body;
        
        console.log('=== LOGIN DEBUG DETALLADO ===');
        console.log('1. Datos recibidos:');
        console.log('   - Email:', email);
        console.log('   - Password presente:', !!password);
        
        if (!email?.trim() || !password?.trim()) {
            console.log('2. ERROR: Validación fallida - campos faltantes');
            return res.status(400).json({ 
                success: false,
                message: "Email y contraseña son requeridos" 
            });
        }

        // NO convertir a minúsculas, mantener el email original
        const emailToSearch = email.trim();
        console.log('2. Email a buscar en BD (case-insensitive):', emailToSearch);
        
        // DEBUG: Mostrar TODOS los usuarios para debugging
        console.log('=== DEBUG: TODOS LOS USUARIOS EN BD ===');
        const todosUsuarios = await this.db.collection("usuarios")
            .find({}, { email: 1, nombre: 1 })
            .toArray();
        
        console.log('Total usuarios:', todosUsuarios.length);
        todosUsuarios.forEach((u, index) => {
            console.log(`${index + 1}. ${u.email} (${u.nombre})`);
        });
        console.log('=== FIN DEBUG USUARIOS ===');
        
        // BÚSQUEDA CASE-INSENSITIVE usando regex con flag 'i'
        const usuario = await this.db.collection("usuarios").findOne({ 
            email: { $regex: new RegExp(`^${emailToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });
        
        console.log('3. Búsqueda específica:');
        console.log('   - Usuario encontrado:', !!usuario);
        
        if (usuario) {
            console.log('   - Email en BD:', usuario.email);
            console.log('   - Email buscado:', emailToSearch);
            console.log('   - Match case-insensitive: SÍ');
        }
        
        if (!usuario) {
            console.log('4. RESULTADO: Usuario no encontrado - 401');
            console.log('   - Email buscado:', emailToSearch);
            console.log('   - Emails disponibles:', todosUsuarios.map(u => u.email));
            
            return res.status(401).json({ 
                success: false,
                message: "Credenciales incorrectas",
                // Solo para debugging, REMOVER en producción
                debug: {
                    emailBuscado: emailToSearch,
                    emailsDisponibles: todosUsuarios.map(u => u.email)
                }
            });
        }

        console.log('4. Comparando passwords...');
        const passwordMatch = await bcrypt.compare(password, usuario.password);
        
        if (!passwordMatch) {
            console.log('5. RESULTADO: Password no coincide - 401');
            return res.status(401).json({ 
                success: false,
                message: "Credenciales incorrectas" 
            });
        }

        // Generar token
        const token = generarToken({
            id: usuario._id.toString(),
            email: usuario.email,
            nombre: usuario.nombre
        });

        console.log('5. RESULTADO: Login exitoso');
        const { password: _, ...userWithoutPassword } = usuario;

        res.json({ 
            success: true,
            message: "Login exitoso", 
            user: userWithoutPassword,
            token
        });
        
    } catch (error) {
        console.error("=== ERROR EN LOGIN ===");
        console.error('Error completo:', error);
        res.status(500).json({ 
            success: false,
            message: "Error interno del servidor" 
        });
    }
}

    async obtenerTodosUsuarios(req, res) {
        try {
            const { pagina = 1, limite = 10, buscar = '' } = req.query;
            const skip = (parseInt(pagina) - 1) * parseInt(limite);

            let filtro = {};
            if (buscar?.trim()) {
                filtro = {
                    $or: [
                        { nombre: { $regex: buscar.trim(), $options: 'i' } },
                        { email: { $regex: buscar.trim(), $options: 'i' } }
                    ]
                };
            }

            const usuarios = await this.db.collection("usuarios")
                .find(filtro, { projection: { password: 0 } })
                .skip(skip)
                .limit(parseInt(limite))
                .toArray();

            const totalUsuarios = await this.db.collection("usuarios").countDocuments(filtro);
            const totalPaginas = Math.ceil(totalUsuarios / parseInt(limite));

            res.json({ 
                success: true,
                usuarios,
                paginacion: {
                    pagina: parseInt(pagina),
                    limite: parseInt(limite),
                    total: totalUsuarios,
                    totalPaginas
                }
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener usuarios' 
            });
        }
    }

    async buscarUsuariosPorNombre(req, res) {
        try {
            const { nombre } = req.params;
            const { limite = 10 } = req.query;

            if (!nombre?.trim() || nombre.trim().length < 2) {
                return res.status(400).json({ 
                    success: false,
                    message: 'El parámetro de búsqueda debe tener al menos 2 caracteres' 
                });
            }

            const usuarios = await this.db.collection("usuarios")
                .find(
                    { 
                        nombre: { $regex: nombre.trim(), $options: 'i' } 
                    },
                    { 
                        projection: { password: 0 } 
                    }
                )
                .limit(parseInt(limite))
                .toArray();

            res.json({ 
                success: true,
                usuarios,
                total: usuarios.length
            });
        } catch (error) {
            console.error('Error al buscar usuarios por nombre:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al buscar usuarios' 
            });
        }
    }

    async obtenerPerfil(req, res) {
        try {
            // Solo logs en desarrollo
            const isDevelopment = process.env.NODE_ENV === 'development';
            if (isDevelopment) {
                console.log('=== PERFIL DEBUG ===');
                console.log('req.usuario completo:', req.usuario);
                console.log('req.usuario.id:', req.usuario.id);
                console.log('Tipo de req.usuario.id:', typeof req.usuario.id);
                console.log('ObjectId.isValid(req.usuario.id):', ObjectId.isValid(req.usuario.id));
            }
            
            if (!req.usuario?.id) {
                return res.status(400).json({ 
                    success: false,
                    message: 'ID no encontrado en token',
                    code: 'MISSING_USER_ID'
                });
            }

            if (!ObjectId.isValid(req.usuario.id)) {
                if (isDevelopment) {
                    console.log('ID INVÁLIDO DETECTADO:', req.usuario.id);
                }
                return res.status(400).json({ 
                    success: false,
                    message: 'ID de usuario inválido',
                    code: 'INVALID_USER_ID'
                });
            }
            
            const usuario = await this.db.collection("usuarios").findOne({ 
                _id: new ObjectId(req.usuario.id)
            });
            
            if (!usuario) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado',
                    code: 'USER_NOT_FOUND'
                });
            }
            
            const { password, ...userData } = usuario;
            
            res.json({ 
                success: true,
                user: userData 
            });
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            
            // Manejar error específico de ObjectId
            if (error.message.includes('ObjectId')) {
                return res.status(400).json({ 
                    success: false,
                    message: 'ID de usuario con formato inválido',
                    code: 'INVALID_OBJECTID_FORMAT'
                });
            }
            
            res.status(500).json({ 
                success: false,
                message: 'Error al cargar perfil',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    async actualizarPerfil(req, res) {
        try {
            const { nombre, direccion, telefono } = req.body;
            const usuarioId = req.usuario.id;

            if (!ObjectId.isValid(usuarioId)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'ID de usuario inválido' 
                });
            }

            const updateData = {
                updatedAt: new Date()
            };

            if (nombre?.trim()) updateData.nombre = nombre.trim();
            if (direccion?.trim()) updateData.direccion = direccion.trim();
            if (telefono?.trim()) updateData.telefono = telefono.trim();

            // Si no hay datos para actualizar
            if (Object.keys(updateData).length === 1) { // Solo updatedAt
                return res.status(400).json({ 
                    success: false,
                    message: 'No hay datos para actualizar' 
                });
            }

            const result = await this.db.collection("usuarios").updateOne(
                { _id: new ObjectId(usuarioId) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado' 
                });
            }

            res.json({ 
                success: true,
                message: 'Perfil actualizado correctamente' 
            });
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al actualizar perfil' 
            });
        }
    }

    async obtenerUsuarioPorId(req, res) {
        try {
            const usuarioId = req.params.id;
            
            if (!ObjectId.isValid(usuarioId)) {
                return res.status(400).json({ 
                    success: false,
                    message: 'ID de usuario inválido' 
                });
            }
            
            const usuario = await this.db.collection("usuarios").findOne({ 
                _id: new ObjectId(usuarioId) 
            }, {
                projection: { password: 0 } 
            });
            
            if (!usuario) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado' 
                });
            }
            
            res.json({ 
                success: true,
                user: usuario 
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener usuario' 
            });
        }
    }
}

export default UsuarioController;