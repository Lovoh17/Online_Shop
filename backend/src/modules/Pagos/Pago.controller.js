
import { PagoService } from './PagoService.js';
import { ObjectId } from 'mongodb';

export class PagoController {
    constructor(db) {
        this.pagoService = new PagoService(db);
    }

    async obtenerDatosPago(req, res) {
        try {
            const usuarioId = req.usuario.id;
            console.log('📥 Solicitud de datos de pago para usuario:', usuarioId);

            if (!ObjectId.isValid(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de usuario inválido'
                });
            }

            const datosPago = await this.pagoService.obtenerDatosPago(usuarioId);

            res.status(200).json({
                success: true,
                ...datosPago
            });

        } catch (error) {
            console.error('❌ Error en PagoController.obtenerDatosPago:', error);
            
            if (error.message === 'Carrito vacío') {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Error al obtener datos de pago',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async procesarPago(req, res) {
        try {
            const { carritoId, datosTarjeta, direccionEnvio } = req.body;
            const usuarioId = req.usuario.id;

            console.log('💰 Solicitud de procesamiento de pago:', { 
                carritoId, 
                usuarioId,
                tieneDireccion: !!direccionEnvio 
            });

            // Validaciones básicas
            if (!carritoId || !datosTarjeta || !direccionEnvio) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos incompletos',
                    details: {
                        carritoId: !carritoId ? 'Requerido' : undefined,
                        datosTarjeta: !datosTarjeta ? 'Requerido' : undefined,
                        direccionEnvio: !direccionEnvio ? 'Requerido' : undefined
                    }
                });
            }

            if (!ObjectId.isValid(carritoId)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de carrito inválido'
                });
            }

            // Validar datos de tarjeta
            const erroresTarjeta = this.validarDatosTarjeta(datosTarjeta);
            if (erroresTarjeta.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos de tarjeta inválidos',
                    details: erroresTarjeta
                });
            }

            const pagoData = {
                carritoId,
                datosTarjeta,
                direccionEnvio,
                usuarioId
            };

            const resultado = await this.pagoService.procesarPago(pagoData);

            res.status(200).json({
                success: true,
                ...resultado
            });

        } catch (error) {
            console.error('❌ Error en PagoController.procesarPago:', error);
            
            const statusCode = this.obtenerStatusCodeError(error.message);
            
            res.status(statusCode).json({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    async obtenerHistorial(req, res) {
        try {
            const usuarioId = req.usuario.id;

            if (!ObjectId.isValid(usuarioId)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de usuario inválido'
                });
            }

            const historial = await this.pagoService.obtenerHistorialPagos(usuarioId);

            res.status(200).json({
                success: true,
                pedidos: historial
            });

        } catch (error) {
            console.error('Error en PagoController.obtenerHistorial:', error);
            
            res.status(500).json({
                success: false,
                error: 'Error al obtener historial de pagos'
            });
        }
    }

    validarDatosTarjeta(datosTarjeta) {
        const errores = [];

        const { numero, nombre, expiracion, cvv } = datosTarjeta;

        // Validar número de tarjeta
        if (!numero || !/^\d{13,19}$/.test(numero.replace(/\s/g, ''))) {
            errores.push('Número de tarjeta inválido (13-19 dígitos)');
        }

        // Validar nombre
        if (!nombre || nombre.trim().length < 3) {
            errores.push('Nombre en tarjeta es requerido (mínimo 3 caracteres)');
        }

        // Validar fecha de expiración
        if (!expiracion || !/^\d{2}\/\d{2}$/.test(expiracion)) {
            errores.push('Fecha de expiración inválida (formato MM/AA)');
        } else {
            const [mes, año] = expiracion.split('/');
            const ahora = new Date();
            const añoActual = ahora.getFullYear() % 100;
            const mesActual = ahora.getMonth() + 1;

            if (parseInt(mes) < 1 || parseInt(mes) > 12) {
                errores.push('Mes de expiración inválido');
            }

            if (parseInt(año) < añoActual || 
                (parseInt(año) === añoActual && parseInt(mes) < mesActual)) {
                errores.push('Tarjeta expirada');
            }
        }

        // Validar CVV
        if (!cvv || !/^\d{3,4}$/.test(cvv)) {
            errores.push('CVV inválido (3-4 dígitos)');
        }

        return errores;
    }

    obtenerStatusCodeError(mensajeError) {
        const erroresCliente = [
            'Carrito vacío',
            'Carrito no encontrado',
            'Stock insuficiente',
            'Producto no disponible',
            'Datos de tarjeta inválidos'
        ];

        if (erroresCliente.some(error => mensajeError.includes(error))) {
            return 400;
        }

        if (mensajeError.includes('Pago rechazado')) {
            return 402; // Payment Required
        }

        return 500;
    }
}