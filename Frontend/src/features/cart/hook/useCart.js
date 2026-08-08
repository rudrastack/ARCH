import { addToCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems, addItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddToCart({ productId, variantId }) {
        const data = await addToCart({ productId, variantId })
        console.log(data)
        dispatch(addItems(data))
        return data
    }
    return { handleAddToCart }
}