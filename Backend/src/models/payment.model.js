import mongoose from "mongoose";
import priceschema from "./price.schema.js";
import Razorpay from "razorpay";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        type: priceschema,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    orderItems: [{
        title: String,
        productId: mongoose.Schema.Types.ObjectId,
        variantId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        images: [{url: String}],    
        price: priceschema
    }]
});

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
  