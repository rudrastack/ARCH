import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export async function CreateProduct(formData) {

    const response = await productApiInstance.post("/seller/create",
        formData
    )
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/seller/get", {
    })
    console.log("Axios response:", response);
    console.log("Response data:", response.data);
    return response.data
}