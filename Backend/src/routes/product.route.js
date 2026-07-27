import { Router } from 'express';
import { CreateProductValidator } from '../validation/product.validator.js';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import { CreateProduct } from '../controllers/product.controller.js';
import ProductModel from '../models/product.model.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 //5mb
    }
});


const router = Router();



router.post('/', authenticateSeller,upload.array('images', 7), CreateProductValidator,  CreateProduct)



export default router;