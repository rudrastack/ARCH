import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";


export const addToCart = async(req, res) => {
    const { productId, variantId, quantity } = req.body;
    const { user } = req;

    const product = await productModel.findOne({ _id: productId, "variants._id": variantId });
    if (!product) {
        return res.status(404).json({ message: "Product or variant not found" });
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart = (await cartModel.findOne({ user: user.req._id })) || (await cartModel.create({ user: user.req._id, items: [] }));

    const isProductInCart = cart.items.some((item) => item.product.toString() === productId && item.variant.toString() === variantId);
    if (isProductInCart) {
        const quantityInCart = cart.items.find((item) => item.product.toString() === productId && item.variant.toString() === variantId).quantity;
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Cannot add ${quantity} items to cart. Only ${stock - quantityInCart} items left in stock.`,
                success: false
            });
        }

        await cartModel.findOneAndUpdate(
            { user: user.req._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        );
    }

    await cart.save();

    res.status(200).json({
        message: "Item added to cart successfully",
        success: true
    });
}

export const getCart = async(req, res) => {
    const  user  = req.user;
    
    let cart = await cartModel.findOne({ user: user.req._id }).populate("items.product");
    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }
    
    res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
}