import { createSlice } from "@reduxjs/toolkit"


const initialRecipesState = {
    Recipes: [],
    editRecipes: null,
    dataLoaded : false,
}


const Recipes = createSlice({
    name: 'recipes',
    initialState: initialRecipesState,
    reducers: {
        addRecipes(state, action) {
            const exists = state.Recipes.find(item => item.id === action.payload.id);
            if (!exists) {
              state.Recipes.push(action.payload);  // Add only if not already present
            }
        },
        deleteRecipesData(state, action) {
            state.Recipes = state.Recipes.filter(item => item.id !== action.payload.id);
        },
        editRecipes(state, action) {
            state.editRecipes = action.payload;
        },
        updateRecipes(state, action) { 
            state.Recipes = state.Recipes.map(item =>
                item.id === action.payload.id ? { ...item, ...action.payload } : item
            );
        },
        clearRecipes(state) {
            state.Recipes = [];  // This clears the entire list
        },
    }
})


export const RecipesActions = Recipes.actions;
export default Recipes.reducer;