import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
});

export async function CreateProduct(formData) {

    const response = await productApiInstance.post("/seller/create",
        formData
    )
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get("/seller/get", {
    })
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("");
    return response.data;
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/details/${productId}`)
    return response.data
}

export async function CreateProductVariants(productId, newProductVariant) {

    const formData = new FormData();

    newProductVariant.images.forEach((image) => {
        formData.append("images", image);
    });

    formData.append("stock", newProductVariant.stock);
    formData.append("attributes", JSON.stringify(newProductVariant.attributes));
    formData.append("priceAmount", newProductVariant.price);

    const response = await productApiInstance.post(`/seller/variants/${productId}`, formData);

    return response.data
}

export async function DeleteProduct(productId) {
    const response = await productApiInstance.delete(`/seller/delete/${productId}`)
    return response.data
}