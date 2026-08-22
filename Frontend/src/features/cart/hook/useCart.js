import { addToCart, getCart, removeCartItemAPI, increaseCartItemAPI, decreaseCartItemAPI, cartOrderAPI, verifyOrderAPI } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setError, setItems, addItems, removeCartItem, increaseCartItem, decreaseCartItem } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.cart.error);

    async function handleAddToCart({ productId, variantId, quantity = 1, selectedColor, selectedSize }) {
        try {
            const data = await addToCart({
                productId,
                variantId,
                quantity,
                selectedColor,
                selectedSize
            });

            await handleGetCart();
            return data;
        } catch (err) {
            console.error("ADD TO CART ERROR:", err.response?.data || err);
            throw err;
        }
    }

    async function handleGetCart() {
        try {
            const data = await getCart();
            const cartData = data?.cart || data || {};
            dispatch(setItems(cartData));
            return cartData;
        } catch (err) {
            console.error("GET CART ERROR:", err.response?.data || err);
            return null;
        }
    }

    async function handleRemoveCartItem({ productId, variantId, color, size, itemId }) {
        try {
            dispatch(removeCartItem({ productId, variantId, color, size, itemId }));
            const data = await removeCartItemAPI({ productId, variantId, color, size });
            await handleGetCart();
            return data;
        } catch (err) {
            console.error("REMOVE CART ITEM ERROR:", err.response?.data || err);
            await handleGetCart();
            throw err;
        }
    }

    async function handleIncreaseCartItem({ productId, variantId, color, size, itemId }) {
        try {
            dispatch(increaseCartItem({ productId, variantId, color, size, itemId }));
            const data = await increaseCartItemAPI({ productId, variantId, color, size });
            await handleGetCart();
            return data;
        } catch (err) {
            console.error("INCREASE CART ITEM ERROR:", err.response?.data || err);
            await handleGetCart();
            throw err;
        }
    }

    async function handleDecreaseCartItem({ productId, variantId, color, size, itemId }) {
        try {
            dispatch(decreaseCartItem({ productId, variantId, color, size, itemId }));
            const data = await decreaseCartItemAPI({ productId, variantId, color, size });
            await handleGetCart();
            return data;
        } catch (err) {
            console.error("DECREASE CART ITEM ERROR:", err.response?.data || err);
            await handleGetCart();
            throw err;
        }
    }

    async function handleCartOrder() {
        const data = await cartOrderAPI();
        return data;
    }

    async function handleVerifyOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyOrderAPI({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        return data.success;
    }

    return {
        error,
        handleGetCart,
        handleCartOrder,
        handleAddToCart,
        handleVerifyOrder,
        handleRemoveCartItem,
        handleIncreaseCartItem,
        handleDecreaseCartItem,
    };
};