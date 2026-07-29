import { CreateProduct, getSellerProducts } from "../service/product.api"
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
        console.log("Data from API:", data);
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts
    }
}