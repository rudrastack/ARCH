import {Router} from 'express';
import {validateRegisterUser, validateLoginUser} from '../validation/auth.validator.js';
import { registerUser } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import passport from 'passport';
import { googleCallback } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validateRegisterUser, registerUser);
router.post("/login", validateLoginUser, login)

router.get("/google", passport.authenticate("google",{scope:["profile", "email"]}))
router.get("/google/callback", passport.authenticate("google",{session:false}),
googleCallback,
)

 


export default router;