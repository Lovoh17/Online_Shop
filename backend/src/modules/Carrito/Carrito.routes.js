import express from 'express';
import CarritoController from './Carrito.controller.js';
import autenticar from '../../middleware/auth.js';

const withDB = (db, prefix = '/api/carrito') => {
    const router = express.Router();
    const controller = new CarritoController(db);

    // ⬅️ AGREGAR autenticar A TODAS LAS RUTAS
    router.post(`${prefix}`, autenticar, controller.agregarAlCarrito.bind(controller));
    router.get(`${prefix}`, autenticar, controller.obtenerCarrito.bind(controller));
    router.put(`${prefix}/:productoId`, autenticar, controller.actualizarCarrito.bind(controller));
    router.delete(`${prefix}/:productoId`, autenticar, controller.eliminarDelCarrito.bind(controller));
    router.delete(`${prefix}`, autenticar, controller.vaciarCarrito.bind(controller));

    return router;
};

export default withDB;