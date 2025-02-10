import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import categoriesReducer from "./CategoriesSlice";


const store = configureStore({
    reducer: { auth: authReducer,categories : categoriesReducer}
})

export default store;