import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

class UsuarioController {
    constructor(db) {
        this.db = db;
    }


    async registrar(req, res) {
        try {
            const { nombre, email, password } = req.body;
            
            if (!nombre || !email || !password) {
                return res.status(400).json({ 
                    success: false,
                    message: "Todos los campos son requeridos" 
                });
            }

            const existente = await this.db.collection("usuarios").findOne({ email });
            if (existente) {
                return res.status(400).json({ 
                    success: false,
                    message: "El usuario ya existe" 
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await this.db.collection("usuarios").insertOne({ 
                nombre, 
                email, 
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
            
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false,
                    message: "Email y contraseña son requeridos" 
                });
            }

            const usuario = await this.db.collection("usuarios").findOne({ email });
            if (!usuario) {
                return res.status(400).json({ 
                    success: false,
                    message: "Credenciales incorrectas" 
                });
            }

            const passwordMatch = await bcrypt.compare(password, usuario.password);
            if (!passwordMatch) {
                return res.status(400).json({ 
                    success: false,
                    message: "Credenciales incorrectas" 
                });
            }

            const token = jwt.sign(
                { 
                    id: usuario._id.toString(),
                    email: usuario.email,
                    nombre: usuario.nombre
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = usuario;

            res.json({ 
                success: true,
                message: "Login exitoso", 
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ 
                success: false,
                message: "Error interno del servidor" 
            });
        }
    }

    async obtenerTodosUsuarios(req, res) {
        try {
            const { pagina = 1, limite = 10, buscar = '' } = req.query;
            const skip = (pagina - 1) * limite;

            let filtro = {};
            if (buscar) {
                filtro = {
                    $or: [
                        { nombre: { $regex: buscar, $options: 'i' } },
                        { email: { $regex: buscar, $options: 'i' } }
                    ]
                };
            }

            const usuarios = await this.db.collection("usuarios")
                .find(filtro, { projection: { password: 0 } })
                .skip(skip)
                .limit(parseInt(limite))
                .toArray();

            const totalUsuarios = await this.db.collection("usuarios").countDocuments(filtro);
            const totalPaginas = Math.ceil(totalUsuarios / limite);

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

            if (!nombre || nombre.length < 2) {
                return res.status(400).json({ 
                    success: false,
                    message: 'El parámetro de búsqueda debe tener al menos 2 caracteres' 
                });
            }

            const usuarios = await this.db.collection("usuarios")
                .find(
                    { 
                        nombre: { $regex: nombre, $options: 'i' } 
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
            const usuario = await this.db.collection("usuarios").findOne({ 
                _id: new ObjectId(req.usuario.id) 
            });
            
            if (!usuario) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado' 
                });
            }
            const { password, ...userData } = usuario;
            
            res.json({ 
                success: true,
                user: userData 
            });
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al cargar perfil' 
            });
        }
    }

    async actualizarPerfil(req, res) {
        try {
            const { nombre, direccion, telefono } = req.body;
            const usuarioId = req.usuario.id;

            const updateData = {
                updatedAt: new Date()
            };

            if (nombre) updateData.nombre = nombre;
            if (direccion) updateData.direccion = direccion;
            if (telefono) updateData.telefono = telefono;

            const result = await this.db.collection("usuarios").updateOne(
                { _id: new ObjectId(usuarioId) },
                { $set: updateData }
            );

            if (result.modifiedCount === 0) {
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