import mongoose from "mongoose";

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
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: "INR"
        }
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
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            price: {
                amount: {
                    type: Number,
                    required: true,
                },
                currency: {
                    type: String,
                    required: true,
                    default: "INR"
                }
            },
            attributes: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    value: {
                        type: String,
                        required: true,
                    }
                }
            ]
        }
    ]
},
{
    timestamps: true
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;

