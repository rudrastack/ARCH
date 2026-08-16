import express from "express";
import { addToCart, getCart, removeFromCart, increaseCartItemQuantity, decreaseCartItemQuantity, createOrderController } from "../controllers/cart.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity } from "../validation/cart.validator.js";


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

/** * @route DELETE /api/cart/:productId/:variantId
 * @description Remove an item from the cart
 * @access Private
 */
router.delete("/remove/:productId/:variantId", authenticateUser, removeFromCart);

/** * @route PATCH /api/cart/increase/:productId/:variantId
 * @description Increase the quantity of an item in the cart
 * @access Private
 */
router.patch("/increase/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, increaseCartItemQuantity);

/** * @route PATCH /api/cart/decrease/:productId/:variantId
 * @description Decrease the quantity of an item in the cart
 * @access Private
 */
router.patch("/decrease/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, decreaseCartItemQuantity);

router.post("/order/checkout", authenticateUser, createOrderController);

export default router;