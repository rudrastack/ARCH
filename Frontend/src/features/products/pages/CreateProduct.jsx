import { useProduct } from "../hook/useProduct";
import { useState } from "react";

export default function CreateProduct() {

    const { handleCreateProduct } = useProduct()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleCreateProduct(formData)
    }

    return (
        <div>
            <h1>Create Product</h1>
        </div>
    )
}