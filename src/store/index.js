import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import RecipesReducer from "./RecipesSlice";
import CategoriesReducer from "./CategoriesSlice";
import orderReducer from "./OrdersSlice";

const store = configureStore({
    reducer: { auth: authReducer,Recipes : RecipesReducer,Categories : CategoriesReducer ,order : orderReducer}
})

export default store;