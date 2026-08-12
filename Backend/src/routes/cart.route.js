import express from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validation/cart.validator.js";


const router = express.Router();
/**
 * @route POST /api/cart/:productId/:variantId
 * @description Add an item to the cart
 * @access Private
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);

/**
 * @route GET /api/cart
 * @description Get the cart
 * @access Private
 */
router.get("/", authenticateUser, getCart);

export default router;