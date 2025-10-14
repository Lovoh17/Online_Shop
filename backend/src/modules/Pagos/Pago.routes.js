
import express from 'express';
import { PagoController } from './Pago.controller.js';
import autenticar from '../../middleware/auth.js';

const withDB = (db, prefix = '/api/pago') => {
    const router = express.Router();
    const controller = new PagoController(db);

    router.get(`${prefix}/datos`, autenticar, controller.obtenerDatosPago.bind(controller));
    router.post(`${prefix}/procesar`, autenticar, controller.procesarPago.bind(controller));
    router.get(`${prefix}/historial`, autenticar, controller.obtenerHistorial.bind(controller));

    return router;
};

export default withDB;