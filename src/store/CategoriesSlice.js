import { createSlice } from "@reduxjs/toolkit"


const initialCategoriesState = {
    Categories: [],
    editCategories: null,
    dataLoaded : false,
}


const Categories = createSlice({
    name: 'categories',
    initialState: initialCategoriesState,
    reducers: {
        addcategories(state, action) {
            const exists = state.Categories.find(item => item.id === action.payload.id);
            if (!exists) {
              state.Categories.push(action.payload);  // Add only if not already present
            }
        },
        deleteCategoriesData(state, action) {
            state.Categories = state.Categories.filter(item => item.id !== action.payload.id);
        },
        editCategories(state, action) {
            state.editCategories = action.payload;
        },
        updateCategories(state, action) { 
            state.Categories = state.Categories.map(item =>
                item.id === action.payload.id ? { ...item, ...action.payload } : item
            );
        },
        clearCategories(state) {
            state.Categories = [];  // This clears the entire list
        },
    }
})


export const categoriesActions = Categories.actions;
export default Categories.reducer;