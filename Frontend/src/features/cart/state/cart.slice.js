import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.items
            state.totalPrice = action.payload.totalPrice
            state.currency = action.payload.currency
        },
        addItems: (state, action) => {
            state.items.push(action.payload)
        },
        removeCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.filter(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return false
                }
                else {
                    return true
                }
            })
        },
        increaseCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                else {
                    return item
                }
            })
        },
        decreaseCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity - 1 }
                }
                else {
                    return item
                }
            }).filter(item => item.quantity > 0)
        }
    }
})

export const { setItems, addItems, removeCartItem, increaseCartItem, decreaseCartItem } = cartSlice.actions
export default cartSlice.reducer