import { Fragment, useState, useEffect } from "react";
import classes from "./CategoriesManagement.module.css";
import {useDispatch, useSelector } from "react-redux";
import axios from "axios";
import  CategoriesManagementList  from "./CategoriesManagementList";
import { CategoriesActions } from "../../store/CategoriesSlice";


const CategoriesManagement = () => {
    const dispatch = useDispatch();
    const [categorieName, setCategorieName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [image, setImage] = useState("");
    const editCategories = useSelector(state => state.Categories.editCategories);

    const toggleFormHandler = () => {
        setShowForm(true);
    }

    const imageChangeHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
        setImage(file);
    }

     useEffect(() => {
        if (editCategories) {
            setCategorieName(editCategories.categorieName);
            setSelectedImage(editCategories.image); // For preview
            setImage(null);
            setShowForm(true); // Open the form when editing
        }
    }, [editCategories]);
    

    const cancleCategoriesDataHandler = () => {
            dispatch(CategoriesActions.editCategories(null));
                  setCategorieName("");
                  setImage("");
                  setSelectedImage(null);
                  setShowForm(false);
    }

    



    async function formSubmitHandler  (event) {
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

         const newCetogories = { 
           categorieName,
            image: imageBlob ? await blobToBase64(imageBlob) : selectedImage,
        };

         try {
            if (editCategories) {
                const response =   await axios.put(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Categorieslist/${editCategories.id}.json`,newCetogories);
               
                    dispatch(CategoriesActions.updateCategories({ id: editCategories.id, ...newCetogories }));
                
            } else {
                const response = await axios.post(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Categorieslist.json`, newCetogories);
                console.log(response.data);
                dispatch(CategoriesActions.addCategories({ id: response.data.name, ...newCetogories }));
            }
            setShowForm(false);

        } catch (err) {
            alert(err.message);
        }


        // Clear form fields after submission
        setCategorieName("");
        setImage("");
        setSelectedImage(null);
        setShowForm(false);
        dispatch(CategoriesActions.editCategories(null));

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
                <h2>Categories Management</h2>
                {showForm ? (
                    <form onSubmit={formSubmitHandler}>
                        <div className={classes.formGroup}>
                            <label htmlFor="name">Category Name : </label>
                            <input
                                type="text"
                                placeholder="Enter Category"
                                value={categorieName}
                                onChange={(e) => setCategorieName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="recipe-image">Upload Categories Image:</label>
                            <input
                                type="file"
                                id="recipe-image"
                                accept="image/*"
                                className={classes.fileInput}
                                onChange={imageChangeHandler}
                                required={!editCategories}
                            />
                        </div>

                        {selectedImage && (
                            <div className={classes.imagePreview}>
                                <p>Image Preview:</p>
                                <img src={selectedImage} alt="Categories Preview" />
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
                    <div>
                        <button onClick={toggleFormHandler} className={classes.addButton}>Add</button>
                    </div>
                )
                }
            </div>
            <CategoriesManagementList/>
        </Fragment>
    );
};

export default CategoriesManagement;