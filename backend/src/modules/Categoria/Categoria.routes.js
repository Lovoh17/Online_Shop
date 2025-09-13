import express from 'express';
import CategoriaController from './Categoria.controller.js';

const withDB = (db, prefix = '/api/categorias') => {
    const router = express.Router();
    const controller = new CategoriaController(db);

    router.get(`${prefix}`, controller.getAll.bind(controller));
    router.get(`${prefix}/:id`, controller.getById.bind(controller));
    router.get(`${prefix}/slug/:slug`, controller.getBySlug.bind(controller));
    router.get(`${prefix}/:id/exists`, controller.checkSlugExists.bind(controller));
    router.post(`${prefix}`, controller.create.bind(controller));
    router.put(`${prefix}/:id`, controller.update.bind(controller));
    router.delete(`${prefix}/:id`, controller.delete.bind(controller));

    return router;
};

export default withDB;