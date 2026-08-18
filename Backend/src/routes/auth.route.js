import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validation/auth.validator.js';
import { registerUser } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { getMe } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { googleCallback } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import passport from 'passport';


const router = Router();

router.post('/register', validateRegisterUser, registerUser);
router.post("/login", validateLoginUser, login)

//@route /api/auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
    googleCallback,
)

/**
 * @route GET /api/auth/get-me
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get('/get-me', authenticateUser, getMe)

router.post('/logout', authenticateUser, logout)



export default router;