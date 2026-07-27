import { Router } from 'express';
import { CreateProductValidator, validateRequest } from '../validation/product.validator.js';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import { CreateProduct } from '../controllers/product.controller.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 //5mb
    }
});


const router = Router();



post('/create', CreateProductValidator, authenticateSeller, upload.array('images', 7), CreateProduct)



export default router;