import { addToCart, getCart, removeCartItemAPI, increaseCartItemAPI, decreaseCartItemAPI } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setItems, addItems, removeCartItem, increaseCartItem, decreaseCartItem } from "../state/cart.slice";

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

    async function handleRemoveCartItem({ productId, variantId }) {
        const data = await removeCartItemAPI({ productId, variantId })
        dispatch(removeCartItem({ productId, variantId }))
        return data
    }

    async function handleIncreaseCartItem({ productId, variantId }) {
        const data = await increaseCartItemAPI({ productId, variantId })
        dispatch(increaseCartItem({ productId, variantId }))
        return data
    }

    async function handleDecreaseCartItem({ productId, variantId }) {
        const data = await decreaseCartItemAPI({ productId, variantId })
        dispatch(decreaseCartItem({ productId, variantId }))
        return data
    }

    return {
        cartItems,
        cartSubtotal,
        handleGetCart,
        handleAddToCart,
        handleRemoveCartItem,
        handleIncreaseCartItem,
        handleDecreaseCartItem,
    };
};