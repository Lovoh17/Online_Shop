import express from 'express';
import PedidoController from './Pedido.controller.js';
import autenticar from '../../middleware/auth.js';

const withDB = (db, prefix = '/api/pedidos') => {
    const router = express.Router();
    const controller = new PedidoController(db);

    //rutas publicas
    router.get(`${prefix}`, controller.obtenerPedidos.bind(controller));
    router.get(`${prefix}/:id`, controller.obtenerPedidoPorId.bind(controller));

    // Rutas protegidas (requieren autenticación)
    router.post(`${prefix}`, autenticar, controller.crearPedido.bind(controller));

    
    router.put(`${prefix}/:id/estado`, autenticar, controller.actualizarEstado.bind(controller));
    router.get(`${prefix}/usuario/:usuarioId`, autenticar, controller.obtenerPedidosPorUsuario.bind(controller));
    router.get(`${prefix}/estado/:estado`, autenticar, controller.obtenerPedidosPorEstado.bind(controller));

    return router;
};

export default withDB;