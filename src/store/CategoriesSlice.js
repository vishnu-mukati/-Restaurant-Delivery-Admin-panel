import { createSlice } from "@reduxjs/toolkit";


const initialCategoriesState = {
    Categories: [],
    editCategories: null,
    dataLoaded: false,
}

const Categories = createSlice({
    name: 'categories',
    initialState: initialCategoriesState,
    reducers: {
        addCategories(state, action) {
            const exists = state.Categories.find(item => item.id === action.payload.id);
            if (!exists) {
                state.Categories.push(action.payload);  // Add only if not already present
            }
        },
        deleteCategoriesData(state, action) {
            state.Categories = state.Categories.filter(item => item.id !== action.payload.id);
        },
        updateCategories(state, action) {
            state.Categories = state.Categories.map(item =>
                item.id === action.payload.id ? { ...item, ...action.payload } : item
            );
        },
          editCategories(state, action) {
            state.editCategories = action.payload;
        },
        cleaerCategories(state) {
            state.Recipes = [];
        },
    }
})


export const CategoriesActions = Categories.actions;
export default Categories.reducer;