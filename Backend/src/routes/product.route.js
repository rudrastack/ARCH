import { Router } from 'express';
import { CreateProductValidator } from '../validation/product.validator.js';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import { CreateProduct, GetProducts } from '../controllers/product.controller.js';
import ProductModel from '../models/product.model.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 //5mb
    }
});


const router = Router();



router.post('/seller/create', authenticateSeller,upload.array('images', 7), CreateProductValidator,  CreateProduct)
router.get('/seller/get', authenticateSeller, GetProducts)



export default router;