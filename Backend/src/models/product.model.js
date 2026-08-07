import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: priceSchema,
        required: true

    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,   
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: [String]
            },
            price:{
                type: priceSchema
            }
        },

    ]
},
    {
        timestamps: true
    });

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;

