import express from 'express';
import UsuarioController from './Usuario.controller.js';
import autenticar from '../../middleware/auth.js';

const withDB = (db, prefix = '/api/usuarios') => {
    const router = express.Router();
    const controller = new UsuarioController(db);

    router.post(`${prefix}/register`, controller.registrar.bind(controller));
    router.post(`${prefix}/login`, controller.login.bind(controller));


    router.get(`${prefix}/perfil`, autenticar, controller.obtenerPerfil.bind(controller));
    router.put(`${prefix}/perfil`, autenticar, controller.actualizarPerfil.bind(controller));


    router.get(`${prefix}/buscar/:nombre`, controller.buscarUsuariosPorNombre.bind(controller));


    router.get(`${prefix}`, controller.obtenerTodosUsuarios.bind(controller));
    
    router.get(`${prefix}/:id`, controller.obtenerUsuarioPorId.bind(controller)); 

    return router;
};

export default withDB;