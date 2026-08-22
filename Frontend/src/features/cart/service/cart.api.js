import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
})

export async function addToCart({ productId, variantId, selectedColor, selectedSize }) {

    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1,
        selectedColor: selectedColor,
        selectedSize: selectedSize
    })
    return response.data
}

export async function getCart() {
    const response = await cartApiInstance.get("/")
    return response.data
}

// export async function removeCartItemAPI({ productId, variantId }) {
//     const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
//     return response.data
// }

// export async function increaseCartItemAPI({ productId, variantId }) {
//     const response = await cartApiInstance.patch(`/increase/${productId}/${variantId}`)
//     return response.data
// }

// export async function decreaseCartItemAPI({ productId, variantId }) {
//     const response = await cartApiInstance.patch(`/decrease/${productId}/${variantId}`)
//     return response.data
// }

export async function removeCartItemAPI({
    productId,
    variantId,
    color,
    size
}) {
    const response = await cartApiInstance.delete(
        `/remove/${productId}/${variantId}?color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`
    );

    return response.data;
}

export async function increaseCartItemAPI({
    productId,
    variantId,
    color,
    size
}) {
    const response = await cartApiInstance.patch(
        `/increase/${productId}/${variantId}?color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`
    );

    return response.data;
}

export async function decreaseCartItemAPI({
    productId,
    variantId,
    color,
    size
}) {
    const response = await cartApiInstance.patch(
        `/decrease/${productId}/${variantId}?color=${encodeURIComponent(color)}&size=${encodeURIComponent(size)}`
    );

    return response.data;
}

export async function cartOrderAPI() {
    const response = await cartApiInstance.post("/order/checkout")
    return response.data
}

export async function verifyOrderAPI({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const response = await cartApiInstance.post("/order/verify", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}



