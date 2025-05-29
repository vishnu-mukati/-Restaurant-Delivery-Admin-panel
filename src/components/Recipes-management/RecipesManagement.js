import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import classes from './RecipesManagement.module.css';
import RecipesManagemenetList from "./RecipesManagementList";
import { RecipesActions } from "../../store/RecipesSlice";

const RecipesManagemenet = () => {
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [RecipesSelection, setRecipesSelection] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const editRecipes = useSelector(state => state.Recipes.editRecipes);


    const imageChangeHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
        setImage(file);
    };

    const toggleFormHandler = () => {
        setShowForm(true);
    };

    useEffect(() => {
        if (editRecipes) {
            setRecipeName(editRecipes.recipeName);
            setRecipesSelection(editRecipes.RecipesSelection);
            setIngredients(editRecipes.ingredients);
            setPrice(editRecipes.price);
            setSelectedImage(editRecipes.image); // For preview
            setImage(null);
            setShowForm(true); // Open the form when editing
        }
    }, [editRecipes]);
    

    const cancleRecipesDataHandler = () => {
        dispatch(RecipesActions.editRecipes(null));
        setRecipeName("");
        setRecipesSelection("");
        setIngredients("");
        setPrice("");
        setImage("");
        setSelectedImage(null);
        setShowForm(false);
    }


    async function formSubmitHandler(event) {
        event.preventDefault();
        let imageBlob = null;

        if (image) {
            // Convert the image file to a Blob
            imageBlob = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const arrayBuffer = reader.result;
                    resolve(new Blob([arrayBuffer], { type: image.type }));
                };
                reader.readAsArrayBuffer(image);
            });
        }

        const newRecipe = { 
            recipeName,
            RecipesSelection,
            ingredients,
            price,
            image: imageBlob ? await blobToBase64(imageBlob) : selectedImage,
        };
        try {
            if (editRecipes) {
                const response =   await axios.put(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Recipeslist/${editRecipes.id}.json`,newRecipe);
               
                    dispatch(RecipesActions.updateRecipes({ id: editRecipes.id, ...newRecipe }));
                
            } else {
                const response = await axios.post(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Recipeslist.json`, newRecipe);
                console.log(response.data);
                dispatch(RecipesActions.addRecipes({ id: response.data.name, ...newRecipe }));
            }
            setShowForm(false);

        } catch (err) {
            alert(err.message);
        }


        // Clear form fields after submission
        setRecipeName("");
        setRecipesSelection("");
        setIngredients("");
        setPrice("");
        setImage("");
        setSelectedImage(null);
        setShowForm(false);
        dispatch(RecipesActions.editRecipes(null));
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <Fragment>
            <div className={classes.formContainer}>
                <h2>Recipe Management</h2>
                {showForm ? (
                    <form onSubmit={formSubmitHandler}>
                        <div className={classes.formGroup}>
                            <label htmlFor="recipe-name">Recipe Name:</label>
                            <input
                                type="text"
                                id="recipe-name"
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="recipeselection">recipe Selection:</label>
                            <select
                                id="recipeselection"
                                value={RecipesSelection}
                                onChange={(e) => setRecipesSelection(e.target.value)}
                                required
                            >
                                <option value="Appetizers">Appetizers</option>
                                <option value="Main Courses">Main Courses</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Drinks">Drinks</option>
                            </select>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="ingredients">Ingredients:</label>
                            <input
                                type="text"
                                id="ingredients"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="price">Price:</label>
                            <input
                                type="text"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="recipe-image">Upload Recipe Image:</label>
                            <input
                                type="file"
                                id="recipe-image"
                                accept="image/*"
                                // value={image}
                                className={classes.fileInput}
                                onChange={imageChangeHandler}
                                required={!editRecipes}
                            />
                        </div>
                        {selectedImage && (
                            <div className={classes.imagePreview}>
                                <p>Image Preview:</p>
                                <img src={selectedImage} alt="Recipe Preview" />
                            </div>
                        )}

                        <div>
                            {editRecipes ? <button type="submit" className={classes.addButton} >Edit</button> : <button type="submit" className={classes.addButton}>Add</button>}
                            {editRecipes ? <button onClick={cancleRecipesDataHandler} className={classes.addButton}>Cancle</button> : <button type="button" onClick={cancleRecipesDataHandler} className={classes.addButton}>
                                Close
                            </button>}
                        </div>
                    </form>
                ) : (
                    <button onClick={toggleFormHandler} className={classes.addButton}>Add</button>
                )}
            </div>
            <RecipesManagemenetList />
        </Fragment>
    );
};

export default RecipesManagemenet;
