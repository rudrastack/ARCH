import { addToCart, getCart } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setItems, addItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.items);
    const cartSubtotal = cartItems.reduce((total, item) => {
        return total + (item.price?.amount || 0) * (item.quantity || 0);
    }, 0);

    async function handleAddToCart({ productId, variantId, quantity = 1 }) {
        const data = await addToCart({ productId, variantId, quantity });
        await handleGetCart();
        return data;
    }

    async function handleGetCart() {
        const data = await getCart();
        dispatch(setItems(data.cart.items));
        return data;
    }

    return {
        cartItems,
        cartSubtotal,
        handleAddToCart,
        handleGetCart
    };
};