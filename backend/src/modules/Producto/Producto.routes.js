import express from 'express';
import ProductoController from './Producto.controller.js';
import autenticar from '../../middleware/auth.js';

const withDB = (db, prefix = '/api/productos') => {
    const router = express.Router();
    const controller = new ProductoController(db);

    // Rutas públicas
    router.get(`${prefix}`, controller.obtenerProductos.bind(controller));
    router.get(`${prefix}/:id`, controller.obtenerProductoPorId.bind(controller));
    router.get(`${prefix}/categoria/:categoria`, controller.obtenerProductosPorCategoria.bind(controller));
    router.get(`${prefix}/buscar/:nombre`, controller.buscarProductos.bind(controller));

    // Rutas protegidas (solo administradores)
    router.post(`${prefix}`, autenticar, controller.crearProducto.bind(controller));
    router.put(`${prefix}/:id`, autenticar, controller.actualizarProducto.bind(controller));
    router.delete(`${prefix}/:id`, autenticar, controller.eliminarProducto.bind(controller));

    return router;
};

export default withDB;