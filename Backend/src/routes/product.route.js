import { Router } from 'express';
import { CreateProductValidator } from '../validation/product.validator.js';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import { CreateProduct, GetProducts, GetAllProducts, GetProductDetails } from '../controllers/product.controller.js';
import ProductModel from '../models/product.model.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 //5mb
    }
});

const router = Router();

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post('/seller/create', authenticateSeller,upload.array('images', 7), CreateProductValidator,  CreateProduct)

/**
 * @route POST /api/products
 * @description Get all products by seller
 * @access Private (Seller only)
 */
router.get('/seller/get', authenticateSeller, GetProducts)

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get('/', GetAllProducts)

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get('/details/:id', GetProductDetails)

export default router;