import { ObjectId } from "mongodb";

class CarritoService {
    constructor(db) {
        this.db = db;
    }

    async agregarProducto(usuarioId, productoId, cantidad) {
        const producto = await this.db.collection('productos').findOne({ 
            _id: new ObjectId(productoId) 
        });
        
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        let carrito = await this.db.collection('carritos').findOne({ 
            usuarioId: new ObjectId(usuarioId) 
        });
        
        if (!carrito) {
            carrito = {
                usuarioId: new ObjectId(usuarioId),
                items: [{
                    producto: {
                        _id: producto._id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        descripcion: producto.descripcion
                    },
                    cantidad: cantidad
                }],
                actualizadoEn: new Date()
            };
            
            await this.db.collection('carritos').insertOne(carrito);
        } else {
            const itemExistente = carrito.items.find(item => 
                item.producto._id.toString() === productoId
            );
            
            if (itemExistente) {
                itemExistente.cantidad += cantidad;
            } else {
                carrito.items.push({
                    producto: {
                        _id: producto._id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        descripcion: producto.descripcion
                    },
                    cantidad: cantidad
                });
            }
            
            carrito.actualizadoEn = new Date();
            await this.db.collection('carritos').updateOne(
                { _id: carrito._id },
                { $set: carrito }
            );
        }
        
        return carrito;
    }

    async obtenerCarrito(usuarioId) {
        const carrito = await this.db.collection('carritos').findOne({ 
            usuarioId: new ObjectId(usuarioId) 
        }, {
            projection: { _id: 0, usuarioId: 0 }
        });
        
        return carrito;
    }

    async actualizarCantidad(usuarioId, productoId, cantidad) {
        const carrito = await this.db.collection('carritos').findOne({ 
            usuarioId: new ObjectId(usuarioId) 
        });
        
        if (!carrito) {
            throw new Error('Carrito no encontrado');
        }
        
        const itemIndex = carrito.items.findIndex(
            item => item.producto._id.toString() === productoId
        );
        
        if (itemIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
        
        carrito.items[itemIndex].cantidad = cantidad;
        carrito.actualizadoEn = new Date();
        
        await this.db.collection('carritos').updateOne(
            { _id: carrito._id },
            { $set: carrito }
        );
    }

    async eliminarProducto(usuarioId, productoId) {
        const carrito = await this.db.collection('carritos').findOne({ 
            usuarioId: new ObjectId(usuarioId) 
        });
        
        if (!carrito) {
            throw new Error('Carrito no encontrado');
        }
        
        const itemIndex = carrito.items.findIndex(
            item => item.producto._id.toString() === productoId
        );
        
        if (itemIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
        
        carrito.items.splice(itemIndex, 1);
        carrito.actualizadoEn = new Date();
        
        if (carrito.items.length === 0) {
            await this.db.collection('carritos').deleteOne({ _id: carrito._id });
        } else {
            await this.db.collection('carritos').updateOne(
                { _id: carrito._id },
                { $set: carrito }
            );
        }
    }

    async vaciarCarrito(usuarioId) {
        await this.db.collection('carritos').deleteOne({ 
            usuarioId: new ObjectId(usuarioId) 
        });
    }
}

export default CarritoService;