
import { ObjectId } from "mongodb";

export class PagoService {
    constructor(db) {
        this.db = db;
    }

    async obtenerDatosPago(usuarioId) {
        try {
            console.log('🔍 Obteniendo datos de pago para usuario:', usuarioId);
            
            // 1. Obtener carrito del usuario
            const carrito = await this.db.collection('carritos').findOne({
                usuarioId: new ObjectId(usuarioId)
            });

            console.log('📦 Carrito encontrado:', carrito);

            if (!carrito || !carrito.items || carrito.items.length === 0) {
                throw new Error('Carrito vacío');
            }

            // 2. Obtener información actualizada de productos y verificar stock
            const itemsConProductos = [];
            let total = 0;

            for (const item of carrito.items) {
                const producto = await this.db.collection('productos').findOne({
                    _id: new ObjectId(item.producto._id)
                });

                if (!producto) {
                    throw new Error(`Producto ${item.producto.nombre} no disponible`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
                }

                const subtotal = producto.precio * item.cantidad;
                total += subtotal;

                itemsConProductos.push({
                    producto: {
                        _id: producto._id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        descripcion: producto.descripcion
                    },
                    cantidad: item.cantidad,
                    subtotal: subtotal
                });
            }

            // 3. Obtener información del usuario
            const usuario = await this.db.collection('usuarios').findOne({
                _id: new ObjectId(usuarioId)
            }, {
                projection: {
                    nombre: 1,
                    email: 1,
                    direccion: 1,
                    telefono: 1
                }
            });

            console.log('💰 Total calculado:', total);

            return {
                carritoId: carrito._id.toString(),
                items: itemsConProductos,
                total: total,
                subtotal: total,
                impuestos: total * 0.16, // 16% de IVA
                totalFinal: total * 1.16,
                usuario: usuario || {},
                fechaSolicitud: new Date()
            };

        } catch (error) {
            console.error('❌ Error en PagoService.obtenerDatosPago:', error);
            throw error;
        }
    }

    async procesarPago(pagoData) {
        const session = this.db.client.startSession();
        
        try {
            session.startTransaction();
            console.log('💳 Iniciando procesamiento de pago:', pagoData.carritoId);

            const { carritoId, datosTarjeta, direccionEnvio, usuarioId } = pagoData;

            // 1. Verificar que el carrito aún existe y tiene items
            const carrito = await this.db.collection('carritos').findOne({
                _id: new ObjectId(carritoId),
                usuarioId: new ObjectId(usuarioId)
            }, { session });

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            if (!carrito.items || carrito.items.length === 0) {
                throw new Error('Carrito vacío');
            }

            console.log('📋 Verificando stock de productos...');

            // 2. Verificar stock de productos y calcular total
            let total = 0;
            const itemsParaPedido = [];

            for (const item of carrito.items) {
                const producto = await this.db.collection('productos').findOne({
                    _id: new ObjectId(item.producto._id)
                }, { session });

                if (!producto) {
                    throw new Error(`Producto ${item.producto.nombre} no disponible`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
                }

                const subtotal = producto.precio * item.cantidad;
                total += subtotal;

                itemsParaPedido.push({
                    producto: {
                        _id: producto._id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        imagen: producto.imagen,
                        descripcion: producto.descripcion
                    },
                    cantidad: item.cantidad,
                    subtotal: subtotal
                });

                // 3. Actualizar stock de productos
                await this.db.collection('productos').updateOne(
                    { _id: producto._id },
                    { $inc: { stock: -item.cantidad } },
                    { session }
                );
            }

            // 4. Simular procesamiento con pasarela de pago
            console.log('🔐 Procesando pago con tarjeta...');
            const resultadoPago = await this.simularProcesamientoTarjeta(datosTarjeta, total);

            if (!resultadoPago.exitoso) {
                throw new Error(`Pago rechazado: ${resultadoPago.mensaje}`);
            }

            console.log('✅ Pago aprobado, creando pedido...');

            // 5. Crear pedido
            const pedido = {
                usuarioId: new ObjectId(usuarioId),
                items: itemsParaPedido,
                total: total,
                subtotal: total,
                impuestos: total * 0.16,
                totalFinal: total * 1.16,
                direccionEnvio: direccionEnvio,
                metodoPago: 'tarjeta',
                datosPago: {
                    referencia: resultadoPago.referencia,
                    ultimosDigitos: datosTarjeta.numero.slice(-4),
                    tipo: 'tarjeta_credito'
                },
                estado: 'confirmado',
                numeroPedido: await this.generarNumeroPedido(session),
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                historialEstados: [{
                    estado: 'confirmado',
                    fecha: new Date(),
                    notas: 'Pedido creado y pagado exitosamente'
                }]
            };

            const resultadoPedido = await this.db.collection('pedidos').insertOne(pedido, { session });

            // 6. Vaciar carrito
            await this.db.collection('carritos').deleteOne({
                _id: new ObjectId(carritoId)
            }, { session });

            await session.commitTransaction();
            console.log('🎉 Transacción completada exitosamente');

            return {
                success: true,
                ordenId: resultadoPedido.insertedId.toString(),
                numeroPedido: pedido.numeroPedido,
                referencia: resultadoPago.referencia,
                total: pedido.totalFinal,
                fecha: new Date(),
                mensaje: 'Pago procesado exitosamente'
            };

        } catch (error) {
            await session.abortTransaction();
            console.error('❌ Error en PagoService.procesarPago:', error);
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async simularProcesamientoTarjeta(datosTarjeta, total) {
        // Simular procesamiento con pasarela de pago
        // En producción, aquí integrarías con Stripe, PayPal, etc.
        
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('💳 Simulando procesamiento de tarjeta...');
                
                // Simular validaciones básicas
                const esNumeroValido = /^\d{13,19}$/.test(datosTarjeta.numero);
                const esCVVValido = /^\d{3,4}$/.test(datosTarjeta.cvv);

                if (!esNumeroValido || !esCVVValido) {
                    resolve({
                        exitoso: false,
                        mensaje: 'Datos de tarjeta inválidos',
                        referencia: null
                    });
                    return;
                }

                // Simular rechazo aleatorio (15% de probabilidad para testing)
                const esExitoso = Math.random() > 0.15;

                const referencia = `PAY-${Date.now()}-${datosTarjeta.numero.slice(-4)}`;
                
                resolve({
                    exitoso: esExitoso,
                    mensaje: esExitoso ? 'Pago aprobado' : 'Fondos insuficientes',
                    referencia: referencia
                });
            }, 2000); // Simular delay de procesamiento
        });
    }

    async generarNumeroPedido(session) {
        const año = new Date().getFullYear();
        const ultimoPedido = await this.db.collection('pedidos')
            .find({}, { session })
            .sort({ numeroPedido: -1 })
            .limit(1)
            .toArray();

        let siguienteNumero = 1;
        if (ultimoPedido.length > 0 && ultimoPedido[0].numeroPedido) {
            const ultimoNumero = parseInt(ultimoPedido[0].numeroPedido.split('-')[2]);
            siguienteNumero = ultimoNumero + 1;
        }

        return `PED-${año}-${siguienteNumero.toString().padStart(6, '0')}`;
    }

    async obtenerHistorialPagos(usuarioId) {
        try {
            const pedidos = await this.db.collection('pedidos')
                .find({ 
                    usuarioId: new ObjectId(usuarioId),
                    estado: { $ne: 'cancelado' }
                })
                .sort({ fechaCreacion: -1 })
                .project({
                    numeroPedido: 1,
                    totalFinal: 1,
                    estado: 1,
                    fechaCreacion: 1,
                    metodoPago: 1,
                    'datosPago.referencia': 1
                })
                .toArray();

            return pedidos;
        } catch (error) {
            console.error('Error en PagoService.obtenerHistorialPagos:', error);
            throw error;
        }
    }
}