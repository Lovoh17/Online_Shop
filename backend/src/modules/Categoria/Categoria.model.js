import { MongoClient, ObjectId } from 'mongodb';
import { getDB } from "../../config/database.js";


export class CategoriaModel {
    constructor(db) {
        this.collection = db.collection("categorias");
    }

    async createIndexes() {
        try {
            await this.collection.createIndex({ slug: 1 }, { unique: true });
            await this.collection.createIndex({ activo: 1 });
            await this.collection.createIndex({ orden: 1 });
        } catch (error) {
            console.log('Índices ya existen o error al crearlos:', error.message);
        }
    }

    async create(data) {
        const result = await this.collection.insertOne(data);
        return await this.findById(result.insertedId);
    }

    async findById(id) {
        try {
            const objectId = typeof id === 'string' ? new ObjectId(id) : id;
            return await this.collection.findOne({ _id: objectId });
        } catch (error) {
            return null;
        }
    }

    async findBySlug(slug) {
        return await this.collection.findOne({
            slug: slug.toLowerCase(),
            activo: true
        });
    }

    async findAll(filters = {}) {
        const query = { ...filters };

        return await this.collection
            .find(query)
            .sort({ orden: 1, nombre: 1 })
            .toArray();
    }

    async findActive() {
        return await this.findAll({ activo: true });
    }

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

    async hardDeleteById(id) {
        const objectId = typeof id === 'string' ? new ObjectId(id) : id;
        const result = await this.collection.deleteOne({ _id: objectId });
        return result.deletedCount > 0;
    }

    async count(filters = {}) {
        return await this.collection.countDocuments(filters);
    }

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