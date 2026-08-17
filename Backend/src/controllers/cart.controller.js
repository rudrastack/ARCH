import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { CartOrderDetails } from "../dao/cart.dao.js";
import PaymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

    if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export const getCart = async (req, res) => {
    const user = req.user;
    let cart = await CartOrderDetails(user._id);

    if (!cart) {
        cart = await cartModel.create({ user: user._id, });
    }

    res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
}

export const removeFromCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { product: productId, variant: variantId } } },
        { new: true }
    );
    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }
    res.status(200).json({
        message: "Product removed from cart successfully",
        success: true
    });
}

export const increaseCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": 1 } },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    })
}

export async function decreaseCartItemQuantity(req, res) {
    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart - 1 < 1) {
        return res.status(400).json({
            message: `Quantity cannot be less than 1`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": -1 } },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item quantity decremented successfully",
        success: true
    })
}

export async function createOrderController(req, res) {

    const cart = await CartOrderDetails(req.user._id);

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await PaymentModel.create({
        user: req.user._id,
        
        razorpay: {
            orderId: order.id,
            paymentId: order.payment_id,
            signature: order.signature
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity,
            images: item.product.images || item.product.images,
            description: item.product.description,
            price: {
                amount: item.price.amount * item.quantity || item.product.price.amount,
                currency: item.price.currency || item.product.price.currency
            }
        }))
    })

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    })

}

export async function verifyPaymentController(req, res) {
    
const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

const payment = await PaymentModel.findOne({ "razorpay.orderId": razorpay_order_id, status: "pending" });

if (!payment) {
    return res.status(404).json({
        message: "Payment not found",
        success: false
    });
}

const isPaymentValid = validatePaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id
}, razorpay_signature, config.RAZORPAY_KEY_SECRET);

if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({
        message: "Payment verification failed",
        success: false
    });
}

payment.status = "paid";
await payment.save();

return res.status(200).json({
    message: "Payment verified successfully",
    success: true
});

}

