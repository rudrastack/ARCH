import { createSlice } from "@reduxjs/toolkit";

const extractId = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    if (val.$oid) return String(val.$oid);
    if (val._id) return extractId(val._id);
    return String(val);
};

const isItemMatch = (item, payload) => {
    if (!payload) return false;
    const { productId, variantId, color, size, itemId } = payload;

    const itItemId = extractId(item._id);
    const targetItemId = extractId(itemId);
    if (itItemId && targetItemId && itItemId === targetItemId) return true;

    const itProdId = extractId(item.product);
    const itVarId = extractId(item.variant);
    const tProdId = extractId(productId);
    const tVarId = extractId(variantId);

    const sameProd = !tProdId || itProdId === tProdId;
    const sameVar = !tVarId || itVarId === tVarId;
    const sameColor = !color || (item.selectedColor || '').toLowerCase() === color.toLowerCase();
    const sameSize = !size || (item.selectedSize || '').toLowerCase() === size.toLowerCase();

    return sameProd && sameVar && sameColor && sameSize;
};

const computeTotalPrice = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, it) => acc + (Number(it.price?.amount || 0) * (it.quantity || 1)), 0);
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: 0,
        currency: "INR",
        items: [],
        error: null,
    },
    reducers: {
        setItems: (state, action) => {
            const payload = action.payload?.cart || action.payload || {};
            const rawItems = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload) ? payload : []);
            state.items = rawItems;
            state.totalPrice = payload.totalPrice ?? computeTotalPrice(rawItems);
            state.currency = payload.currency || rawItems[0]?.price?.currency || "INR";
        },
        addItems: (state, action) => {
            state.items.push(action.payload);
            state.totalPrice = computeTotalPrice(state.items);
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        removeCartItem: (state, action) => {
            state.items = state.items.filter(item => !isItemMatch(item, action.payload));
            state.totalPrice = computeTotalPrice(state.items);
        },
        increaseCartItem: (state, action) => {
            state.items = state.items.map(item => {
                if (isItemMatch(item, action.payload)) {
                    return { ...item, quantity: (item.quantity || 1) + 1 };
                }
                return item;
            });
            state.totalPrice = computeTotalPrice(state.items);
        },
        decreaseCartItem: (state, action) => {
            state.items = state.items
                .map(item => {
                    if (isItemMatch(item, action.payload)) {
                        return { ...item, quantity: (item.quantity || 1) - 1 };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0);
            state.totalPrice = computeTotalPrice(state.items);
        }
    }
});

export const {
    setError,
    setItems,
    addItems,
    removeCartItem,
    increaseCartItem,
    decreaseCartItem
} = cartSlice.actions;

export default cartSlice.reducer;