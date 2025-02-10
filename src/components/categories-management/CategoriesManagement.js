import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import classes from './CategoriesManagement.module.css';
import CategoriesManagemenetList from "./CategoriesManagementList";
import { categoriesActions } from "../../store/CategoriesSlice";

const CategoriesManagemenet = () => {
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [categoriesSelection, setcategoriesSelection] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const editCategories = useSelector(state => state.categories.editCategories);


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

    // useEffect(()=>{
    //      if(editCategories){
    //         editCategoriesHandler();
    //      }
    // },[editCategories])

    // async function editCategoriesHandler() {
    //     const categoriesToEdit = editCategories;  // No need to access `.item` since it's stored directly
    //     if (categoriesToEdit) {
    //         setRecipeName(categoriesToEdit.recipeName);
    //         setcategoriesSelection(categoriesToEdit.categoriesSelection);
    //         setIngredients(categoriesToEdit.ingredients);
    //         setPrice(categoriesToEdit.price);
    //         setSelectedImage(categoriesToEdit.image); // For preview
    //         setImage(null);
    //     }
    //     setShowForm(true); 
    // };

    useEffect(() => {
        if (editCategories) {
            setRecipeName(editCategories.recipeName);
            setcategoriesSelection(editCategories.categoriesSelection);
            setIngredients(editCategories.ingredients);
            setPrice(editCategories.price);
            setSelectedImage(editCategories.image); // For preview
            setImage(null);
            setShowForm(true); // Open the form when editing
        }
    }, [editCategories]);
    

    const cancleCategoriesDataHandler = () => {
        dispatch(categoriesActions.editCategories(null));
        setRecipeName("");
        setcategoriesSelection("");
        setIngredients("");
        setPrice("");
        setImage("");
        setSelectedImage(null);
        setShowForm(false);
    }


    async function formSubmitHandler(event) {
        event.preventDefault();
        const imagePreview = image ? URL.createObjectURL(image) : selectedImage;

        const newRecipe = {
            recipeName,
            categoriesSelection,
            ingredients,
            price,
            image: imagePreview,
        };
        try {
            if (editCategories) {
                const response =   await axios.put(`https://restaurant-admin-panel-f2680-default-rtdb.firebaseio.com/categoriesdata/${editCategories.id}.json`,newRecipe);
               
                    dispatch(categoriesActions.updateCategories({ id: editCategories.id, ...newRecipe }));
                
            } else {
                const response = await axios.post(`https://restaurant-admin-panel-f2680-default-rtdb.firebaseio.com/categoriesdata.json`, newRecipe);
                console.log(response.data);
                dispatch(categoriesActions.addcategories({ id: response.data.name, ...newRecipe }));
            }
            setShowForm(false);

        } catch (err) {
            alert(err.message);
        }


        // Clear form fields after submission
        setRecipeName("");
        setcategoriesSelection("");
        setIngredients("");
        setPrice("");
        setImage("");
        setSelectedImage(null);
        setShowForm(false);
        dispatch(categoriesActions.editCategories(null));
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
                            <label htmlFor="categoryselection">Category Selection:</label>
                            <select
                                id="categoryselection"
                                value={categoriesSelection}
                                onChange={(e) => setcategoriesSelection(e.target.value)}
                                required
                            >
                                <option value="Appetizers">Appetizers</option>
                                <option value="Main Courses">Main Courses</option>
                                <option value="Desserts">Desserts</option>
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
                                required={!editCategories}
                            />
                        </div>
                        {selectedImage && (
                            <div className={classes.imagePreview}>
                                <p>Image Preview:</p>
                                <img src={selectedImage} alt="Recipe Preview" />
                            </div>
                        )}

                        <div>
                            {editCategories ? <button type="submit" className={classes.addButton} >Edit</button> : <button type="submit" className={classes.addButton}>Add</button>}
                            {editCategories ? <button onClick={cancleCategoriesDataHandler} className={classes.addButton}>Cancle</button> : <button type="button" onClick={cancleCategoriesDataHandler} className={classes.addButton}>
                                Close
                            </button>}
                        </div>
                    </form>
                ) : (
                    <button onClick={toggleFormHandler} className={classes.addButton}>Add</button>
                )}
            </div>
            <CategoriesManagemenetList />
        </Fragment>
    );
};

export default CategoriesManagemenet;
