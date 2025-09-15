import { ObjectId } from "mongodb";
import PedidoService from './Pedido.service.js';

class PedidoController {
    constructor(db) {
        this.service = new PedidoService(db);
    }


    async crearPedido(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { items, direccionEnvio, metodoPago, datosEnvio } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El pedido debe contener al menos un item'
                });
            }

            if (!direccionEnvio) {
                return res.status(400).json({
                    success: false,
                    message: 'La dirección de envío es requerida'
                });
            }

            const pedidoData = {
                usuarioId,
                items,
                direccionEnvio,
                metodoPago: metodoPago || 'tarjeta',
                datosEnvio: datosEnvio || {},
                estado: 'pendiente'
            };

            const pedido = await this.service.crearPedido(pedidoData);

            res.status(201).json({
                success: true,
                message: 'Pedido creado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al crear pedido:', error);
            
            if (error.message.includes('no encontrado') || error.message.includes('insuficiente')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al crear pedido',
                error: error.message
            });
        }
    }

    async obtenerPedidos(req, res) {
        try {
            const { pagina = 1, limite = 10, estado, usuarioId } = req.query;
            const filtros = {};

            if (estado) filtros.estado = estado;
            if (usuarioId) filtros.usuarioId = usuarioId;

            const resultado = await this.service.obtenerPedidos({
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                filtros
            });

            res.json({
                success: true,
                pedidos: resultado.pedidos,
                paginacion: resultado.paginacion
            });
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedidos',
                error: error.message
            });
        }
    }

    async obtenerPedidoPorId(req, res) {
        try {
            const { id } = req.params;
            
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de pedido inválido'
                });
            }

            const pedido = await this.service.obtenerPedidoPorId(id);

            if (!req.usuario.esAdmin && pedido.usuarioId.toString() !== req.usuario.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver este pedido'
                });
            }

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado'
                });
            }

            res.json({
                success: true,
                pedido
            });
        } catch (error) {
            console.error('Error al obtener pedido:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedido',
                error: error.message
            });
        }
    }

    async obtenerPedidosPorUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            const { pagina = 1, limite = 10, estado } = req.query;

            if (!req.usuario.esAdmin && usuarioId !== req.usuario.id) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para ver estos pedidos'
                });
            }

            const filtros = { usuarioId };
            if (estado) filtros.estado = estado;

            const resultado = await this.service.obtenerPedidos({
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                filtros
            });

            res.json({
                success: true,
                pedidos: resultado.pedidos,
                paginacion: resultado.paginacion,
                usuarioId
            });
        } catch (error) {
            console.error('Error al obtener pedidos por usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedidos',
                error: error.message
            });
        }
    }

    async obtenerPedidosPorEstado(req, res) {
        try {
            const { estado } = req.params;
            const { pagina = 1, limite = 10 } = req.query;

            const estadosPermitidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado de pedido inválido'
                });
            }

            const filtros = { estado };

            if (!req.usuario.esAdmin) {
                filtros.usuarioId = req.usuario.id;
            }

            const resultado = await this.service.obtenerPedidos({
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                filtros
            });

            res.json({
                success: true,
                pedidos: resultado.pedidos,
                paginacion: resultado.paginacion,
                estado
            });
        } catch (error) {
            console.error('Error al obtener pedidos por estado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pedidos por estado',
                error: error.message
            });
        }
    }

    async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado, notas } = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de pedido inválido'
                });
            }

            const estadosPermitidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado de pedido inválido'
                });
            }

            if (!req.usuario.esAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los administradores pueden actualizar estados de pedidos'
                });
            }

            const pedido = await this.service.actualizarEstado(id, estado, notas);

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Estado del pedido actualizado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al actualizar estado del pedido:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar estado del pedido',
                error: error.message
            });
        }
    }
}

export default PedidoController;