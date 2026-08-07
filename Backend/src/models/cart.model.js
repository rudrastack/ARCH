import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true
                },
                variant: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product.variants'
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: {
                    type: priceSchema,
                    required: true
                },
            },
        ],
    });

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;