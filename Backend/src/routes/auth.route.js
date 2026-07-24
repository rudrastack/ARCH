import {Router} from 'express';
import {validateRegisterUser, validateLoginUser} from '../validation/auth.validator.js';
import { registerUser } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validateRegisterUser, registerUser);
router.post("/login", validateLoginUser, login)

 


export default router;