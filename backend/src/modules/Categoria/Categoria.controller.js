import { CategoriaService } from './Categoria.service.js';
import CategoriaModel from './Categoria.model.js';
import { 
    asyncHandler, 
    validateObjectId,
    createNotFoundError,
    createValidationError,
    ValidationError 
} from '../../middleware/errorHandler.js';

class CategoriaController {
    constructor(db) {
        const categoriaModel = new CategoriaModel(db);
        this.categoriaService = new CategoriaService(categoriaModel);
        this.categoriaModel = categoriaModel;
    }

    getAll = asyncHandler(async (req, res) => {
        const { activo, page = 1, limit = 10, sort = 'orden' } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (pageNum < 1) {
            throw createValidationError('El número de página debe ser mayor a 0');
        }
        
        if (limitNum < 1 || limitNum > 100) {
            throw createValidationError('El límite debe estar entre 1 y 100');
        }

        const filters = {};
        
        if (activo !== undefined) {
            if (activo !== 'true' && activo !== 'false') {
                throw createValidationError('El parámetro "activo" debe ser true o false');
            }
            filters.activo = activo === 'true';
        }

        const skip = (pageNum - 1) * limitNum;
        const categorias = await this.categoriaModel.findAll(filters, {
            skip,
            limit: limitNum,
            sort: { [sort]: 1 }
        });
        
        const total = await this.categoriaModel.count(filters);
        const categoriasJSON = categorias.map(cat => this.categoriaService.toJSON(cat));

        res.json({
            success: true,
            data: categoriasJSON,
            pagination: {
                current: pageNum,
                total: Math.ceil(total / limitNum),
                count: categoriasJSON.length,
                totalItems: total
            }
        });
    });

    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        // Validar ObjectId
        validateObjectId(id, 'ID de categoría');
        
        const categoria = await this.categoriaModel.findById(id);

        if (!categoria) {
            throw createNotFoundError('Categoría');
        }

        res.json({
            success: true,
            data: this.categoriaService.toJSON(categoria)
        });
    });

    getBySlug = asyncHandler(async (req, res) => {
        const { slug } = req.params;
        
        // Validar formato del slug
        if (!slug || slug.trim().length === 0) {
            throw createValidationError('El slug es requerido');
        }
        
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw createValidationError('Formato de slug inválido');
        }

        const categoria = await this.categoriaModel.findBySlug(slug);

        if (!categoria) {
            throw createNotFoundError('Categoría');
        }

        res.json({
            success: true,
            data: this.categoriaService.toJSON(categoria)
        });
    });

    create = asyncHandler(async (req, res) => {
        // Validar que el body no esté vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            throw createValidationError('Los datos de la categoría son requeridos');
        }

        const categoria = await this.categoriaService.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: this.categoriaService.toJSON(categoria)
        });
    });

    update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        // Validar ObjectId
        validateObjectId(id, 'ID de categoría');
        
        if (!req.body || Object.keys(req.body).length === 0) {
            throw createValidationError('Los datos para actualizar son requeridos');
        }

        const existingCategoria = await this.categoriaModel.findById(id);
        if (!existingCategoria) {
            throw createNotFoundError('Categoría');
        }

        const categoria = await this.categoriaService.updateById(id, req.body);

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: this.categoriaService.toJSON(categoria)
        });
    });

    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        validateObjectId(id, 'ID de categoría');

        const deleted = await this.categoriaModel.deleteById(id);

        if (!deleted) {
            throw createNotFoundError('Categoría');
        }

        res.json({
            success: true,
            message: 'Categoría desactivada exitosamente'
        });
    });

    checkSlugExists = asyncHandler(async (req, res) => {
        const { slug } = req.query;
        const { id } = req.params;

        if (!slug || slug.trim().length === 0) {
            throw createValidationError('El parámetro slug es requerido');
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            throw createValidationError('Formato de slug inválido');
        }

        let excludeId = null;
        if (id && id !== 'undefined' && id !== '') {
            validateObjectId(id, 'ID de categoría a excluir');
            excludeId = id;
        }

        const exists = await this.categoriaService.existsSlug(slug, excludeId);

        res.json({
            success: true,
            exists,
            message: exists ? 'El slug ya existe' : 'El slug está disponible',
            data: {
                slug,
                available: !exists
            }
        });
    });

    getStats = asyncHandler(async (req, res) => {
        const [total, activas, inactivas] = await Promise.all([
            this.categoriaModel.count(),
            this.categoriaModel.count({ activo: true }),
            this.categoriaModel.count({ activo: false })
        ]);

        res.json({
            success: true,
            data: {
                total,
                activas,
                inactivas,
                porcentajeActivas: total > 0 ? Math.round((activas / total) * 100) : 0
            }
        });
    });

    search = asyncHandler(async (req, res) => {
        const { q, limit = 10 } = req.query;
        
        if (!q || q.trim().length < 2) {
            throw createValidationError('La búsqueda debe tener al menos 2 caracteres');
        }

        const limitNum = parseInt(limit);
        if (limitNum < 1 || limitNum > 50) {
            throw createValidationError('El límite de búsqueda debe estar entre 1 y 50');
        }

        const regex = new RegExp(q.trim(), 'i');
        const categorias = await this.categoriaModel.search(regex, limitNum);
        const categoriasJSON = categorias.map(cat => this.categoriaService.toJSON(cat));

        res.json({
            success: true,
            data: categoriasJSON,
            query: q.trim(),
            count: categoriasJSON.length
        });
    });
}

export default CategoriaController;