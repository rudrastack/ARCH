import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export async function CreateProduct({ title, description, priceAmount, priceCurrency }) {

    const response = await productApiInstance.post("/seller/create", {
        title,
        description,
        priceAmount,
        priceCurrency,
    })
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/seller/get", {
    })

    return response.data
}