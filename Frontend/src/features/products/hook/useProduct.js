import { CreateProduct, getSellerProducts, getAllProducts, getProductById } from "../service/product.api"
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await CreateProduct(formData)
        return data.products
    }

    async function handleGetSellerProducts() {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    async function handleGetAllProducts() {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        return data.products
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetAllProducts,
        handleGetProductById
    }
}