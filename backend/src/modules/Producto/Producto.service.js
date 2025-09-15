import { ObjectId } from "mongodb";

class ProductoService {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection("productos");
    }

    async obtenerProductos({ pagina = 1, limite = 12, categoria, ordenar = 'nombre', orden = 'asc' }) {
        const skip = (pagina - 1) * limite;
        
        // Construir filtro
        let filtro = {};
        if (categoria) {
            filtro.categoria = categoria;
        }

        // Construir ordenamiento
        const sortOptions = {};
        sortOptions[ordenar] = orden === 'desc' ? -1 : 1;

        const productos = await this.collection
            .find(filtro)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limite))
            .toArray();

        const total = await this.collection.countDocuments(filtro);
        const totalPaginas = Math.ceil(total / limite);

        return {
            productos,
            paginacion: {
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                total,
                totalPaginas
            }
        };
    }

    async obtenerProductoPorId(id) {
        return await this.collection.findOne({ 
            _id: new ObjectId(id) 
        });
    }

    async obtenerProductosPorCategoria(categoria, pagina = 1, limite = 12) {
        const skip = (pagina - 1) * limite;
        
        const productos = await this.collection
            .find({ categoria: { $regex: new RegExp(categoria, 'i') } })
            .skip(skip)
            .limit(parseInt(limite))
            .toArray();

        const total = await this.collection.countDocuments({ 
            categoria: { $regex: new RegExp(categoria, 'i') } 
        });
        const totalPaginas = Math.ceil(total / limite);

        return {
            productos,
            paginacion: {
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                total,
                totalPaginas
            }
        };
    }

    async buscarProductos(termino, pagina = 1, limite = 12) {
        const skip = (pagina - 1) * limite;
        
        const productos = await this.collection
            .find({
                $or: [
                    { nombre: { $regex: new RegExp(termino, 'i') } },
                    { descripcion: { $regex: new RegExp(termino, 'i') } },
                    { categoria: { $regex: new RegExp(termino, 'i') } }
                ]
            })
            .skip(skip)
            .limit(parseInt(limite))
            .toArray();

        const total = await this.collection.countDocuments({
            $or: [
                { nombre: { $regex: new RegExp(termino, 'i') } },
                { descripcion: { $regex: new RegExp(termino, 'i') } },
                { categoria: { $regex: new RegExp(termino, 'i') } }
            ]
        });
        const totalPaginas = Math.ceil(total / limite);

        return {
            productos,
            paginacion: {
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                total,
                totalPaginas
            }
        };
    }

    async crearProducto(productoData) {
        const producto = {
            ...productoData,
            precio: parseFloat(productoData.precio),
            stock: productoData.stock ? parseInt(productoData.stock) : 0,
            activo: productoData.activo !== undefined ? productoData.activo : true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await this.collection.insertOne(producto);
        return { ...producto, _id: result.insertedId };
    }

    async actualizarProducto(id, updateData) {
        const updateObj = {
            ...updateData,
            updatedAt: new Date()
        };

        // Convertir tipos si es necesario
        if (updateData.precio) updateObj.precio = parseFloat(updateData.precio);
        if (updateData.stock) updateObj.stock = parseInt(updateData.stock);

        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateObj },
            { returnDocument: 'after' }
        );

        return result.value;
    }

    async eliminarProducto(id) {
        const result = await this.collection.deleteOne({ 
            _id: new ObjectId(id) 
        });
        return result.deletedCount > 0;
    }

    // Métodos adicionales útiles
    async obtenerCategorias() {
        return await this.collection.distinct('categoria');
    }

    async actualizarStock(id, cantidad) {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { 
                $inc: { stock: cantidad },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        );
        return result.value;
    }
}

export default ProductoService;