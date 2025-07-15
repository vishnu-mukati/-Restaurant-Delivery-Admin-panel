import React, { useEffect } from "react";
import classes from "./RecipesManagementList.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RecipesActions } from "../../store/RecipesSlice";

const RecipesManagementList = () => {
    const dispatch = useDispatch();
    const RecipesData = useSelector(state => state.Recipes.Recipes);
    const dataLoaded = useSelector(state=>state.Recipes.dataLoaded);
    useEffect(() => {
    if(!dataLoaded)
        getData();  
    }, [dataLoaded])

    async function getData() {
        try {
            const response = await axios.get(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Recipeslist.json`)
            if (response.data) {
                for (const key of Object.keys(response.data)) {
                    const RecipesData = {
                        id: key,
                        ...response.data[key],
                    }
                    dispatch(RecipesActions.addRecipes(RecipesData));
                }
            } else {
                dispatch(RecipesActions.clearRecipes());
            }
        } catch (err) {
            alert(err.message);
        }
    }

    async function editDataHandler(item) {
        try {
            dispatch(RecipesActions.editRecipes(item));
            const id = item.id;
            dispatch(RecipesActions.deleteRecipesData(id));

        } catch (err) {
            console.log(err.message);
        }
    }




    async function deleteDataHandler(id) {
        try {
             await axios.delete(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Recipeslist/${id}.json`)
            dispatch(RecipesActions.deleteRecipesData({ id }))
        } catch (err) {
            alert(err.message);
        }
    }console.log(RecipesData);
    return (
        <div className={classes.listContainer}>
            <h3>Recipe List</h3>
            {RecipesData.length === 0 ? (
                <p>No Recipes available.</p>
            ) : (
                RecipesData.map((item) => (
                    <div key={item.id} className={classes.listItem}>
                        <img src={item.image} alt={item.name} />
                        <div className={classes.itemDetails}>
                            <p>{item.name}</p>
                            <p>Category: {item.recipeName}</p>
                            <p>Price: {item.price}</p>
                            <p>Ingredients : {item.ingredients}</p>
                        </div>
                        <div className={classes.actionButtons}>
                            <button onClick={() => editDataHandler(item)} className={classes.editButton}>Edit</button>
                            <button onClick={() => deleteDataHandler(item.id)} className={classes.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

};

export default RecipesManagementList;
