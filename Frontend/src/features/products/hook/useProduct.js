import { CreateProduct, getSellerProducts, getAllProducts, getProductById, CreateProductVariants, DeleteProduct } from "../service/product.api"
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    const handleCreateProduct = useCallback(async (formData) => {
        const data = await CreateProduct(formData)
        return data.products
    }, [])

    const handleGetSellerProducts = useCallback(async () => {
        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }, [dispatch])

    const handleGetAllProducts = useCallback(async () => {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        return data.products
    }, [dispatch])

    const handleGetProductById = useCallback(async (productId) => {
        const data = await getProductById(productId)
        return data.product
    }, [])

    const handleCreateProductVariants = useCallback(async (productId, newProductVariant) => {
        const data = await CreateProductVariants(productId, newProductVariant)
        return data.product
    }, [])

    const handleDeleteProduct = useCallback(async (productId) => {
        const data = await DeleteProduct(productId)
        return data.product
    }, [])

    return {
        handleCreateProduct,
        handleDeleteProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleGetSellerProducts,
        handleCreateProductVariants
    }
}