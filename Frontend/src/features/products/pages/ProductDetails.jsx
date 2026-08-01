import React, { useState, useEffect } from 'react'
import { useProduct } from '../hook/useProduct'
import { useParams } from 'react-router'


const ProductDetails = () => {
    console.log(`/details/${product._id}`);

    const { productId } = useParams()
    console.log(productId)
    const [Product, setProduct] = useState(null);

    const { handleGetProductById } = useProduct()

    async function fetchProductDetails() {
        const data = await handleGetProductById(productId)
        setProduct(data)
    }
    useEffect(() => {
        fetchProductDetails()
    }, [productId])

    console.log(Product

    )

    return (
        <div>ProductDetails</div>
    )
}

export default ProductDetails