import { ObjectId } from "mongodb";

class CarritoController {
    constructor(db) {
        this.db = db;
    }

    async agregarAlCarrito(req, res) {
        try {
            const { productoId, cantidad } = req.body;
            const usuarioId = req.usuario.id;

            if (!productoId || !cantidad || cantidad < 1) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Datos inválidos',
                    details: {
                        productoId: !productoId ? 'Falta productoId' : undefined,
                        cantidad: !cantidad ? 'Falta cantidad' : cantidad < 1 ? 'Cantidad debe ser mayor a 0' : undefined
                    }
                });
            }

            if (!ObjectId.isValid(productoId)) {
                return res.status(400).json({ 
                    success: false,
                    error: 'ID de producto inválido' 
                });
            }

            const producto = await this.db.collection('productos').findOne({ 
                _id: new ObjectId(productoId) 
            });
            
            if (!producto) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Producto no encontrado',
                    productoId 
                });
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
                            imagen: producto.imagenes,
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
            
            res.status(200).json({ 
                success: true,
                mensaje: 'Producto agregado al carrito',
                carrito
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).json({ 
                success: false,
                error: 'Error interno del servidor',
                details: error.message 
            });
        }
    }

    async obtenerCarrito(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const carrito = await this.db.collection('carritos').findOne({ 
                usuarioId: new ObjectId(usuarioId) 
            }, {
                projection: { _id: 0, usuarioId: 0 }
            });
            
            if (!carrito) {
                return res.status(200).json({ 
                    success: true,
                    items: [],
                    message: 'Carrito vacío'
                });
            }
            
            res.status(200).json({
                success: true,
                items: carrito.items,
                lastUpdated: carrito.actualizadoEn
            });
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            res.status(500).json({ 
                success: false,
                error: 'Error al cargar el carrito',
                details: error.message 
            });
        }
    }

    async actualizarCarrito(req, res) {
        try {
            const { cantidad } = req.body;
            const productoId = req.params.productoId;
            const usuarioId = req.usuario.id;

            if (!cantidad || cantidad < 1) {
                return res.status(400).json({ error: 'Cantidad inválida' });
            }
            
            const carrito = await this.db.collection('carritos').findOne({ 
                usuarioId: new ObjectId(usuarioId) 
            });
            
            if (!carrito) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            
            const itemIndex = carrito.items.findIndex(
                item => item.producto._id.toString() === productoId
            );
            
            if (itemIndex === -1) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
            }
            
            carrito.items[itemIndex].cantidad = cantidad;
            carrito.actualizadoEn = new Date();
            
            await this.db.collection('carritos').updateOne(
                { _id: carrito._id },
                { $set: carrito }
            );
            
            res.json({ mensaje: 'Cantidad actualizada' });
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async eliminarDelCarrito(req, res) {
        try {
            const productoId = req.params.productoId;
            const usuarioId = req.usuario.id;
            
            const carrito = await this.db.collection('carritos').findOne({ 
                usuarioId: new ObjectId(usuarioId) 
            });
            
            if (!carrito) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            
            const itemIndex = carrito.items.findIndex(
                item => item.producto._id.toString() === productoId
            );
            
            if (itemIndex === -1) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
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
            
            res.json({ mensaje: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async vaciarCarrito(req, res) {
        try {
            const usuarioId = req.usuario.id;
            await this.db.collection('carritos').deleteOne({ 
                usuarioId: new ObjectId(usuarioId) 
            });
            
            res.json({ mensaje: 'Carrito vaciado correctamente' });
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export default CarritoController;