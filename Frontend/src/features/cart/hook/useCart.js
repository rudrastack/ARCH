import { addToCart, getCart, removeCartItemAPI, increaseCartItemAPI, decreaseCartItemAPI, cartOrderAPI, verifyOrderAPI } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setItems, addItems, removeCartItem, increaseCartItem, decreaseCartItem } from "../state/cart.slice";

export const useCart = () => {

    const dispatch = useDispatch();;

    async function handleAddToCart({ productId, variantId, quantity = 1 }) {
        const data = await addToCart({ productId, variantId, quantity });
        await handleGetCart();
        return data;
    }

    async function handleGetCart() {
        const data = await getCart();
        dispatch(setItems(data.cart));
        return data.cart;

    }

    async function handleRemoveCartItem({ productId, variantId }) {
        const data = await removeCartItemAPI({ productId, variantId })
        dispatch(removeCartItem({ productId, variantId }))
        await handleGetCart();

        return data
    }

    async function handleIncreaseCartItem({ productId, variantId }) {
        const data = await increaseCartItemAPI({ productId, variantId })
        dispatch(increaseCartItem({ productId, variantId }))
        await handleGetCart();

        return data
    }

    async function handleDecreaseCartItem({ productId, variantId }) {
        const data = await decreaseCartItemAPI({ productId, variantId })
        dispatch(decreaseCartItem({ productId, variantId }))
        await handleGetCart();

        return data
    }

    async function handleCartOrder() {
        const data = await cartOrderAPI();
        console.log(data);
        return data;
    }
    async function handleVerifyOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyOrderAPI({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        console.log("VERIFY API DATA:", data);
        return data.success;
    }

    return {
        handleGetCart,
        handleCartOrder,
        handleAddToCart,
        handleVerifyOrder,
        handleRemoveCartItem,
        handleIncreaseCartItem,
        handleDecreaseCartItem,
    };
};