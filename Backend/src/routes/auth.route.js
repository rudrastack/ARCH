import {Router} from 'express';
import {validateRegisterUser} from '../validation/auth.validator.js';
import { registerUser } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validateRegisterUser, registerUser, (req, res) => {
  // Handle user registration logic here
  res.json({ message: 'User registered successfully' });
});


export default router;