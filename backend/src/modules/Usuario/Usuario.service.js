import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

class UsuarioService {
    constructor(db) {
        this.db = db;
    }

    async crearUsuario(nombre, email, password) {
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
        
        return result.insertedId;
    }

    async autenticarUsuario(email, password) {
        const usuario = await this.db.collection("usuarios").findOne({ email });
        
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            throw new Error('Contraseña incorrecta');
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

        return {
            user: userWithoutPassword,
            token
        };
    }

    async obtenerUsuarioPorId(id) {
        return await this.db.collection("usuarios").findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );
    }

    async actualizarUsuario(id, updateData) {
        updateData.updatedAt = new Date();
        
        const result = await this.db.collection("usuarios").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        return result.modifiedCount;
    }
}

export default UsuarioService;