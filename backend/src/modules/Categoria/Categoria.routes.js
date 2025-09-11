import express from 'express';
import CategoriaController from './Categoria.controller.js';

const withDB = (db) => {
    const router = express.Router();
    const controller = new CategoriaController(db);

    router.get('/', controller.getAll.bind(controller));
    router.get('/:id', controller.getById.bind(controller));
    router.get('/slug/:slug', controller.getBySlug.bind(controller));
    router.get('/:id/exists', controller.checkSlugExists.bind(controller));
    router.post('/', controller.create.bind(controller));
    router.put('/:id', controller.update.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));

    return router;
};

export default withDB;