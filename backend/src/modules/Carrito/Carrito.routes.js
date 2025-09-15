import express from 'express';
import CarritoController from './Carrito.controller.js';

const withDB = (db, prefix = '/api/carrito') => {
    const router = express.Router();
    const controller = new CarritoController(db);

    router.post(`${prefix}`, controller.agregarAlCarrito.bind(controller));
    router.get(`${prefix}`, controller.obtenerCarrito.bind(controller));
    router.put(`${prefix}/:productoId`, controller.actualizarCarrito.bind(controller));
    router.delete(`${prefix}/:productoId`, controller.eliminarDelCarrito.bind(controller));
    router.delete(`${prefix}`, controller.vaciarCarrito.bind(controller));

    return router;
};

export default withDB;