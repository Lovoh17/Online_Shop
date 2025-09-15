import { ObjectId } from "mongodb";
import ProductoService from './Producto.service.js';

class ProductoController {
    constructor(db) {
        this.service = new ProductoService(db);
    }

    // Obtener todos los productos
    async obtenerProductos(req, res) {
        try {
            const { pagina = 1, limite = 12, categoria, ordenar = 'nombre', orden = 'asc' } = req.query;
            
            const resultado = await this.service.obtenerProductos({
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                categoria,
                ordenar,
                orden: orden.toLowerCase()
            });

            res.json({
                success: true,
                productos: resultado.productos,
                paginacion: resultado.paginacion
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    }

    // Obtener producto por ID
    async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            const producto = await this.service.obtenerProductoPorId(id);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                producto
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto',
                error: error.message
            });
        }
    }

    // Obtener productos por categoría
    async obtenerProductosPorCategoria(req, res) {
        try {
            const { categoria } = req.params;
            const { pagina = 1, limite = 12 } = req.query;

            const resultado = await this.service.obtenerProductosPorCategoria(
                categoria,
                parseInt(pagina),
                parseInt(limite)
            );

            res.json({
                success: true,
                productos: resultado.productos,
                paginacion: resultado.paginacion,
                categoria
            });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos por categoría',
                error: error.message
            });
        }
    }

    // Buscar productos
    async buscarProductos(req, res) {
        try {
            const { nombre } = req.params;
            const { pagina = 1, limite = 12 } = req.query;

            if (!nombre || nombre.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'El término de búsqueda debe tener al menos 2 caracteres'
                });
            }

            const resultado = await this.service.buscarProductos(
                nombre,
                parseInt(pagina),
                parseInt(limite)
            );

            res.json({
                success: true,
                productos: resultado.productos,
                paginacion: resultado.paginacion,
                termino: nombre
            });
        } catch (error) {
            console.error('Error al buscar productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar productos',
                error: error.message
            });
        }
    }

    // Crear producto (solo administradores)
    async crearProducto(req, res) {
        try {
            const productoData = req.body;
            
            // Validaciones básicas
            if (!productoData.nombre || !productoData.precio || !productoData.categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, precio y categoría son requeridos'
                });
            }

            if (productoData.precio <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El precio debe ser mayor a 0'
                });
            }

            const producto = await this.service.crearProducto(productoData);
            
            res.status(201).json({
                success: true,
                message: 'Producto creado correctamente',
                producto
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear producto',
                error: error.message
            });
        }
    }

    // Actualizar producto (solo administradores)
    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            if (updateData.precio && updateData.precio <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El precio debe ser mayor a 0'
                });
            }

            const producto = await this.service.actualizarProducto(id, updateData);
            
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Producto actualizado correctamente',
                producto
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar producto',
                error: error.message
            });
        }
    }

    // Eliminar producto (solo administradores)
    async eliminarProducto(req, res) {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de producto inválido'
                });
            }

            const resultado = await this.service.eliminarProducto(id);
            
            if (!resultado) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Producto eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar producto',
                error: error.message
            });
        }
    }
}

export default ProductoController;