import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

export async function CartOrderDetails(userId) {
      let cart =( await cartModel.aggregate([
                {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
            },
            { $unwind: { path: '$items' } },
            {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
            },
            { $unwind: { path: '$items.product' } },
            {
            $unwind: { path: '$items.product.variants' }
            },
            {
            $match: {
                $expr: {
                $eq: [
                    '$items.variant',
                    '$items.product.variants._id'
                ]
                }
            }
            },
            {
            $addFields: {
                itemPrice: {
                $multiply: [
                    '$items.quantity',
                    '$items.product.variants.price.amount'
                ]
                }
            }
            },
            {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice' },
                currency: {
                $first: '$items.price.currency'
                },
                items: { $push: '$items' }
            }
            }
            ]))[ 0 ] 

            return cart
}
