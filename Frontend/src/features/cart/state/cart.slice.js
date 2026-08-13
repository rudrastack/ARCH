import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
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