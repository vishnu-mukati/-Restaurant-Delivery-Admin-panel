import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import categoriesReducer from "./CategoriesSlice";
import orderReducer from "./OrdersSlice";

const store = configureStore({
    reducer: { auth: authReducer,categories : categoriesReducer ,order : orderReducer}
})

export default store;