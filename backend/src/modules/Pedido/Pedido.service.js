import { ObjectId } from "mongodb";

class PedidoService {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection("pedidos");
        this.productosCollection = this.db.collection("productos");
        this.carritosCollection = this.db.collection("carritos");
    }

    async crearPedido(pedidoData) {
        const session = this.db.client.startSession();
        
        try {
            session.startTransaction();

            // Verificar y procesar cada item del pedido
            let total = 0;
            const itemsProcesados = [];

            for (const item of pedidoData.items) {
                const producto = await this.productosCollection.findOne(
                    { _id: new ObjectId(item.productoId) },
                    { session }
                );

                if (!producto) {
                    throw new Error(`Producto ${item.productoId} no encontrado`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}`);
                }

                // Calcular subtotal
                const subtotal = producto.precio * item.cantidad;
                total += subtotal;

                itemsProcesados.push({
                    producto: {
                        _id: producto._id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen
                    },
                    cantidad: item.cantidad,
                    subtotal
                });

                // Actualizar stock
                await this.productosCollection.updateOne(
                    { _id: producto._id },
                    { $inc: { stock: -item.cantidad } },
                    { session }
                );
            }

            // Crear el pedido
            const pedido = {
                usuarioId: new ObjectId(pedidoData.usuarioId),
                items: itemsProcesados,
                total,
                subtotal: total,
                impuestos: total * 0.16, // 16% de impuestos
                totalFinal: total * 1.16,
                direccionEnvio: pedidoData.direccionEnvio,
                metodoPago: pedidoData.metodoPago,
                datosEnvio: pedidoData.datosEnvio,
                estado: pedidoData.estado,
                numeroPedido: await this.generarNumeroPedido(),
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                historialEstados: [{
                    estado: pedidoData.estado,
                    fecha: new Date(),
                    notas: 'Pedido creado'
                }]
            };

            const result = await this.collection.insertOne(pedido, { session });

            // Limpiar carrito del usuario
            await this.carritosCollection.deleteOne(
                { usuarioId: new ObjectId(pedidoData.usuarioId) },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return { ...pedido, _id: result.insertedId };

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async obtenerPedidos({ pagina = 1, limite = 10, filtros = {} }) {
        const skip = (pagina - 1) * limite;

        // Convertir usuarioId a ObjectId si existe
        if (filtros.usuarioId) {
            filtros.usuarioId = new ObjectId(filtros.usuarioId);
        }

        const pedidos = await this.collection
            .find(filtros)
            .sort({ fechaCreacion: -1 })
            .skip(skip)
            .limit(parseInt(limite))
            .toArray();

        const total = await this.collection.countDocuments(filtros);
        const totalPaginas = Math.ceil(total / limite);

        return {
            pedidos,
            paginacion: {
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                total,
                totalPaginas
            }
        };
    }

    async obtenerPedidoPorId(id) {
        return await this.collection.findOne({ 
            _id: new ObjectId(id) 
        });
    }

    async actualizarEstado(id, estado, notas = '') {
        const pedido = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    estado,
                    fechaActualizacion: new Date()
                },
                $push: {
                    historialEstados: {
                        estado,
                        fecha: new Date(),
                        notas: notas || `Estado cambiado a ${estado}`
                    }
                }
            },
            { returnDocument: 'after' }
        );

        return pedido.value;
    }

    async generarNumeroPedido() {
        const año = new Date().getFullYear();
        const ultimoPedido = await this.collection
            .find({})
            .sort({ numeroPedido: -1 })
            .limit(1)
            .toArray();

        let siguienteNumero = 1;
        if (ultimoPedido.length > 0 && ultimoPedido[0].numeroPedido) {
            const ultimoNumero = parseInt(ultimoPedido[0].numeroPedido.split('-')[1]);
            siguienteNumero = ultimoNumero + 1;
        }

        return `PED-${año}-${siguienteNumero.toString().padStart(6, '0')}`;
    }

    // Métodos adicionales
    async obtenerEstadisticas(usuarioId = null) {
        const filtros = usuarioId ? { usuarioId: new ObjectId(usuarioId) } : {};

        const totalPedidos = await this.collection.countDocuments(filtros);
        const pedidosPorEstado = await this.collection.aggregate([
            { $match: filtros },
            { $group: { _id: "$estado", count: { $sum: 1 } } }
        ]).toArray();

        const ventasTotales = await this.collection.aggregate([
            { $match: { ...filtros, estado: { $ne: 'cancelado' } } },
            { $group: { _id: null, total: { $sum: "$totalFinal" } } }
        ]).toArray();

        return {
            totalPedidos,
            pedidosPorEstado: pedidosPorEstado.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            ventasTotales: ventasTotales[0]?.total || 0
        };
    }

    async cancelarPedido(id, motivo = '') {
        const pedido = await this.obtenerPedidoPorId(id);

        if (!pedido) {
            throw new Error('Pedido no encontrado');
        }

        if (pedido.estado === 'entregado') {
            throw new Error('No se puede cancelar un pedido ya entregado');
        }

        // Devolver stock si el pedido estaba confirmado
        if (pedido.estado === 'confirmado') {
            for (const item of pedido.items) {
                await this.productosCollection.updateOne(
                    { _id: item.producto._id },
                    { $inc: { stock: item.cantidad } }
                );
            }
        }

        return await this.actualizarEstado(id, 'cancelado', motivo);
    }
}

export default PedidoService;