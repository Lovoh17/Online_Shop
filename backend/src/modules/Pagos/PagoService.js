// services/PagoService.js
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

            console.log('📦 Carrito encontrado:', carrito ? `Con ${carrito.items?.length || 0} items` : 'No encontrado');

            if (!carrito || !carrito.items || carrito.items.length === 0) {
                throw new Error('Carrito vacío');
            }

            // 2. Obtener información actualizada de productos y verificar stock
            const productosParaPedido = [];
            let subtotal = 0;

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

                const itemSubtotal = producto.precio * item.cantidad;
                subtotal += itemSubtotal;

                // Estructura que espera la base de datos
                productosParaPedido.push({
                    productoId: producto._id,
                    nombreProducto: producto.nombre,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio,
                    talle: item.talle || 'Único', // Si no hay talle en el carrito, usar 'Único'
                    color: item.color || 'No especificado', // Si no hay color en el carrito
                    subtotal: itemSubtotal
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

            // Calcular totales según la estructura esperada
            const impuestos = subtotal * 0.16; // 16% de IVA
            const envio = 0; // Envío gratuito
            const total = subtotal + impuestos + envio;

            console.log('💰 Totales calculados:', { subtotal, impuestos, envio, total });

            return {
                carritoId: carrito._id.toString(),
                productos: productosParaPedido, // Cambiado de 'items' a 'productos'
                subtotal: subtotal,
                impuestos: impuestos,
                envio: envio,
                total: total,
                usuario: usuario || {},
                fechaSolicitud: new Date()
            };

        } catch (error) {
            console.error('❌ Error en PagoService.obtenerDatosPago:', error);
            throw error;
        }
    }

    async procesarPago(pagoData) {
        let session;
        try {
            // Verificar que la base de datos está conectada
            if (!this.db.client) {
                throw new Error('Base de datos no conectada');
            }

            session = this.db.client.startSession();
            console.log('💳 Iniciando procesamiento de pago para usuario:', pagoData.usuarioId);

            const { carritoId, datosTarjeta, direccionEnvio, usuarioId } = pagoData;

            await session.startTransaction();
            console.log('🔐 Transacción iniciada');

            // 1. Verificar que el carrito existe y pertenece al usuario
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

            console.log('📋 Verificando stock de', carrito.items.length, 'productos...');

            // 2. Verificar stock y calcular total
            let subtotal = 0;
            const productosParaPedido = [];

            for (const item of carrito.items) {
                const producto = await this.db.collection('productos').findOne({
                    _id: new ObjectId(item.producto._id)
                }, { session });

                if (!producto) {
                    throw new Error(`Producto ${item.producto.nombre} no disponible`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}`);
                }

                const itemSubtotal = producto.precio * item.cantidad;
                subtotal += itemSubtotal;

                // Estructura que espera la base de datos
                productosParaPedido.push({
                    productoId: producto._id,
                    nombreProducto: producto.nombre,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio,
                    talle: item.talle || 'Único', // Si no hay talle en el carrito
                    color: item.color || 'No especificado', // Si no hay color en el carrito
                    subtotal: itemSubtotal
                });

                // Actualizar stock
                await this.db.collection('productos').updateOne(
                    { _id: producto._id },
                    { $inc: { stock: -item.cantidad } },
                    { session }
                );
            }

            console.log('✅ Stock verificado, subtotal:', subtotal);

            // 3. Procesar pago
            console.log('🔐 Procesando pago...');
            const resultadoPago = await this.simularProcesamientoTarjeta(datosTarjeta, subtotal);

            if (!resultadoPago.exitoso) {
                throw new Error(`Pago rechazado: ${resultadoPago.mensaje}`);
            }

            console.log('✅ Pago aprobado, creando pedido...');

            // 4. Crear pedido con la estructura que espera la base de datos
            const impuestos = subtotal * 0.16;
            const envio = 0;
            const total = subtotal + impuestos + envio;

            // Parsear la dirección de envío (asumiendo que viene como string simple)
            const direccionParseada = this.parsearDireccionEnvio(direccionEnvio);

            const pedido = {
                usuarioId: new ObjectId(usuarioId),
                productos: productosParaPedido, // Array de productos con la estructura correcta
                subtotal: subtotal,
                impuestos: impuestos,
                envio: envio,
                total: total,
                direccionEnvio: direccionParseada,
                estado: 'confirmado', // Estado inicial
                fechaPedido: new Date(),
                fechaEstimadaEntrega: this.calcularFechaEstimadaEntrega(),
                metodoPago: 'tarjeta',
                numeroSeguimiento: await this.generarNumeroSeguimiento(),
                notas: 'Pedido creado automáticamente desde el proceso de pago'
            };

            const resultadoPedido = await this.db.collection('pedidos').insertOne(pedido, { session });
            console.log('📦 Pedido creado con ID:', resultadoPedido.insertedId);

            // 5. Vaciar carrito
            const resultadoEliminacion = await this.db.collection('carritos').deleteOne({
                _id: new ObjectId(carritoId)
            }, { session });

            console.log('🗑️ Carrito eliminado:', resultadoEliminacion.deletedCount, 'documentos');

            await session.commitTransaction();
            console.log('🎉 Transacción completada exitosamente');

            return {
                success: true,
                ordenId: resultadoPedido.insertedId.toString(),
                numeroPedido: resultadoPedido.insertedId.toString(), // Usar el ID como número de pedido temporal
                referencia: resultadoPago.referencia,
                total: total,
                fecha: new Date(),
                mensaje: 'Pago procesado exitosamente'
            };

        } catch (error) {
            console.error('❌ Error en PagoService.procesarPago:', error);
            
            if (session) {
                try {
                    await session.abortTransaction();
                    console.log('🔄 Transacción abortada');
                } catch (abortError) {
                    console.error('Error al abortar transacción:', abortError);
                }
            }
            
            throw error;
        } finally {
            if (session) {
                try {
                    await session.endSession();
                    console.log('🔚 Sesión finalizada');
                } catch (endError) {
                    console.error('Error al finalizar sesión:', endError);
                }
            }
        }
    }

    parsearDireccionEnvio(direccionString) {
        // Si la dirección ya es un objeto, devolverlo directamente
        if (typeof direccionString === 'object') {
            return direccionString;
        }

        // Si es un string, intentar parsearlo o crear estructura básica
        try {
            // Intentar parsear como JSON
            return JSON.parse(direccionString);
        } catch (e) {
            // Si no es JSON válido, crear estructura básica
            return {
                calle: direccionString || 'No especificada',
                ciudad: 'No especificada',
                pais: 'No especificado',
                codigoPostal: '00000',
                nombreCompleto: 'No especificado',
                telefono: 'No especificado'
            };
        }
    }

    calcularFechaEstimadaEntrega() {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 7); // 7 días para entrega estimada
        return fecha;
    }

    async generarNumeroSeguimiento() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let resultado = '';
        for (let i = 0; i < 10; i++) {
            resultado += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return resultado;
    }

    async simularProcesamientoTarjeta(datosTarjeta, total) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('💳 Simulando procesamiento de tarjeta para monto:', total);
                
                try {
                    // Validaciones básicas
                    const cleanCardNumber = datosTarjeta.numero.replace(/\s/g, '');
                    const esNumeroValido = /^\d{13,19}$/.test(cleanCardNumber);
                    const esCVVValido = /^\d{3,4}$/.test(datosTarjeta.cvv);

                    console.log('🔍 Validando tarjeta:', {
                        numeroLength: cleanCardNumber.length,
                        cvvLength: datosTarjeta.cvv.length,
                        esNumeroValido,
                        esCVVValido
                    });

                    if (!esNumeroValido || !esCVVValido) {
                        resolve({
                            exitoso: false,
                            mensaje: 'Datos de tarjeta inválidos',
                            referencia: null
                        });
                        return;
                    }

                    // Simular rechazo aleatorio (solo 5% para testing)
                    const esExitoso = Math.random() > 0.05;

                    const referencia = `PAY-${Date.now()}-${cleanCardNumber.slice(-4)}`;
                    
                    console.log('🎲 Resultado simulado:', esExitoso ? 'APROBADO' : 'RECHAZADO');
                    
                    resolve({
                        exitoso: esExitoso,
                        mensaje: esExitoso ? 'Pago aprobado' : 'Fondos insuficientes',
                        referencia: referencia
                    });
                } catch (error) {
                    console.error('❌ Error en simulación de pago:', error);
                    resolve({
                        exitoso: false,
                        mensaje: 'Error en procesamiento de pago',
                        referencia: null
                    });
                }
            }, 1500);
        });
    }

    async obtenerHistorialPagos(usuarioId) {
        try {
            const pedidos = await this.db.collection('pedidos')
                .find({ 
                    usuarioId: new ObjectId(usuarioId)
                })
                .sort({ fechaPedido: -1 })
                .project({
                    _id: 1,
                    productos: 1,
                    total: 1,
                    estado: 1,
                    fechaPedido: 1,
                    metodoPago: 1
                })
                .toArray();

            return pedidos;
        } catch (error) {
            console.error('Error en PagoService.obtenerHistorialPagos:', error);
            throw error;
        }
    }
}