import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useLocation } from "react-router-dom";

export default function ProductDetails() {
    const location = useLocation();
    const { productId } = useParams();

    console.log("URL:", location.pathname);
    console.log("productId:", productId);
    const [product, setProduct] = useState(null);

    const { handleGetProductById } = useProduct();

    useEffect(() => {
        async function fetchProduct() {
            const data = await handleGetProductById(productId);
            setProduct(data);
        }

        fetchProduct();
    }, [productId]);

    console.log(product);

    if (!product) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>{product.title}</h1>

            <img
                src={product.images[0].url}
                alt={product.title}
                width={300}
            />

            <p>{product.description}</p>

            <h3>
                {product.price.priceCurrency} {product.price.priceAmount}
            </h3>
        </div>
    );
}