import {Router} from 'express';
import {validateRegisterUser} from '../validation/auth.validator.js';

const router = Router();

router.post('/register', validateRegisterUser, (req, res) => {
  // Handle user registration logic here
  res.json({ message: 'User registered successfully' });
});


export default router;