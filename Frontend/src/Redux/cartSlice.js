import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        grandTotal: 0,
        totalQuantity: 0,
    },
    reducers: {
        setCart: (state, action) => {
            const { items, grandTotal, totalQuantity } = action.payload;
            state.items = items;
            state.grandTotal = grandTotal;
            state.totalQuantity = totalQuantity;
        },
    },
});

export const {setCart } = cartSlice.actions;

export default cartSlice.reducer;
