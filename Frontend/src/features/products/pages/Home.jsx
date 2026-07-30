import React from 'react'
import { useProduct } from "../hook/useProduct";
import { useState, useEffect } from 'react';


export default function Home() {
    const { handleGetAllProducts } = useProduct();

    // Data States
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const products = await handleGetAllProducts();
            setProducts(products);

        };

        loadProducts();
    }, []);
    console.log(products)



    return (
        <div style={{ color: 'white' }}>Home</div>

    )

}

