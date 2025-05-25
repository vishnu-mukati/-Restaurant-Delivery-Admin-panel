import { createSlice } from "@reduxjs/toolkit";

const initialOrderState = {
    orders: [],
};

const orderSlice = createSlice({
    name: "order",
    initialState: initialOrderState,
    reducers: {
        addOrder(state, action) {
           state.orders = action.payload;   
        },
        clearOrders(state) {
            state.orders = []; 
        },
        updateOrderStatus(state, action) {
            console.log(state);
            const { orderId, status } = action.payload;
            const existingOrder = state.orders.find(order => order.id === orderId);
            if (existingOrder) {
                existingOrder.status = status;
            }
        }
    },
});

export const orderAction = orderSlice.actions;
export default orderSlice.reducer;
