import { MongoClient, ObjectId } from 'mongodb';
import { getDB } from "../../config/database.js";


export class CategoriaModel {
    constructor(db) {
        this.collection = db.collection("categorias");
    }

    // Crear índices para mejorar el rendimiento
    async createIndexes() {
        try {
            await this.collection.createIndex({ slug: 1 }, { unique: true });
            await this.collection.createIndex({ activo: 1 });
            await this.collection.createIndex({ orden: 1 });
        } catch (error) {
            console.log('Índices ya existen o error al crearlos:', error.message);
        }
    }

    // Crear nueva categoría (solo operación de base de datos)
    async create(data) {
        const result = await this.collection.insertOne(data);
        return await this.findById(result.insertedId);
    }

    // Buscar por ID
    async findById(id) {
        try {
            const objectId = typeof id === 'string' ? new ObjectId(id) : id;
            return await this.collection.findOne({ _id: objectId });
        } catch (error) {
            return null;
        }
    }

    // Buscar por slug
    async findBySlug(slug) {
        return await this.collection.findOne({
            slug: slug.toLowerCase(),
            activo: true
        });
    }

    // Obtener todas las categorías
    async findAll(filters = {}) {
        const query = { ...filters };

        return await this.collection
            .find(query)
            .sort({ orden: 1, nombre: 1 })
            .toArray();
    }

    // Obtener categorías activas
    async findActive() {
        return await this.findAll({ activo: true });
    }

    // Actualizar categoría (solo operación de base de datos)
    async updateById(id, data) {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;

        const result = await this.collection.updateOne(
            { _id: objectId },
            { $set: data }
        );

        if (result.matchedCount === 0) {
            throw new Error('Categoría no encontrada');
        }

        return await this.findById(objectId);
    }

    // Eliminar categoría (soft delete)
    async deleteById(id) {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;

        const result = await this.collection.updateOne(
            { _id: objectId },
            {
                $set: {
                    activo: false,
                    updatedAt: new Date()
                }
            }
        );

        return result.matchedCount > 0;
    }

    // Eliminar permanentemente
    async hardDeleteById(id) {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount > 0;
    }

    // Contar documentos
    async count(filters = {}) {
        return await this.collection.countDocuments(filters);
    }

    // Verificar si existe slug
    async existsSlug(slug, excludeId = null) {
        const query = { slug: slug.toLowerCase() };

        if (excludeId) {
            const objectId = typeof excludeId === 'string' ? new ObjectId(excludeId) : excludeId;
            query._id = { $ne: objectId };
        }

        const doc = await this.collection.findOne(query, { projection: { _id: 1 } });
        return doc !== null;
    }
}

export default CategoriaModel;