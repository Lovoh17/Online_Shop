export class CategoriaService {
    constructor(categoriaModel) {
        this.categoriaModel = categoriaModel;
    }

    validateData(data) {
        const errors = [];

        if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
            errors.push('El nombre es obligatorio');
        }

        if (data.nombre && data.nombre.length > 100) {
            errors.push('El nombre no puede exceder 100 caracteres');
        }

        if (!data.icono || typeof data.icono !== 'string' || data.icono.trim().length === 0) {
            errors.push('El icono es obligatorio');
        }

        if (data.descripcion && data.descripcion.length > 500) {
            errors.push('La descripción no puede exceder 500 caracteres');
        }

        if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
            errors.push('El slug debe tener formato válido (solo letras minúsculas, números y guiones)');
        }

        return errors;
    }

    generateSlug(nombre) {
        return nombre
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }

    prepareData(data) {
        const now = new Date();

        const preparedData = {
            nombre: data.nombre?.trim(),
            slug: data.slug || this.generateSlug(data.nombre),
            icono: data.icono?.trim(),
            activo: data.activo !== undefined ? Boolean(data.activo) : true,
            descripcion: data.descripcion?.trim() || '',
            orden: parseInt(data.orden) || 0,
            updatedAt: now
        };

        if (!data._id) {
            preparedData.createdAt = now;
        }

        return preparedData;
    }

    async create(data) {
        const errors = this.validateData(data);
        if (errors.length > 0) {
            throw new Error(`Errores de validación: ${errors.join(', ')}`);
        }

        const preparedData = this.prepareData(data);

        try {
            return await this.categoriaModel.create(preparedData);
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Ya existe una categoría con ese slug');
            }
            throw error;
        }
    }
    async updateById(id, data) {
        const errors = this.validateData(data);
        if (errors.length > 0) {
            throw new Error(`Errores de validación: ${errors.join(', ')}`);
        }

        const preparedData = this.prepareData(data);
        delete preparedData.createdAt;

        try {
            return await this.categoriaModel.updateById(id, preparedData);
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('Ya existe una categoría con ese slug');
            }
            throw error;
        }
    }

    getUrl(categoria) {
        return `/categorias/${categoria.slug}`;
    }

    toJSON(categoria) {
        if (!categoria) return null;

        return {
            id: categoria._id.toString(),
            nombre: categoria.nombre,
            slug: categoria.slug,
            icono: categoria.icono,
            activo: categoria.activo,
            descripcion: categoria.descripcion,
            orden: categoria.orden,
            url: this.getUrl(categoria),
            createdAt: categoria.createdAt,
            updatedAt: categoria.updatedAt
        };
    }

    async existsSlug(slug, excludeId = null) {
        return await this.categoriaModel.existsSlug(slug, excludeId);
    }
}