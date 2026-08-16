import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
})

export async function addToCart({ productId, variantId }) {

    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
        quantity: 1
    })
    return response.data
}

export async function getCart() {
    const response = await cartApiInstance.get("/")
    return response.data
}

export async function removeCartItemAPI({ productId, variantId }) {
    const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export async function increaseCartItemAPI({ productId, variantId }) {
    const response = await cartApiInstance.patch(`/increase/${productId}/${variantId}`)
    return response.data
}

export async function decreaseCartItemAPI({ productId, variantId }) {
    const response = await cartApiInstance.patch(`/decrease/${productId}/${variantId}`)
    return response.data
}

export async function cartOrderAPI() {
    const response = await cartApiInstance.post("/order/checkout")
    return response.data
}


