import React, { useEffect } from "react";
import classes from "./CategoriesManagementList.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { categoriesActions } from "../../store/CategoriesSlice";

const CategoriesManagementList = () => {
    const dispatch = useDispatch();
    const categoriesData = useSelector(state => state.categories.Categories);
    const dataLoaded = useSelector(state=>state.categories.dataLoaded);
    useEffect(() => {
    if(!dataLoaded)
        getData();
    }, [dataLoaded])

    async function getData() {
        try {
            const response = await axios.get(`https://restaurant-admin-panel-f2680-default-rtdb.firebaseio.com/categoriesdata.json`)
            if (response.data) {
                for (const key of Object.keys(response.data)) {
                    const categoriesData = {
                        id: key,
                        ...response.data[key],
                    }
                    dispatch(categoriesActions.addcategories(categoriesData));
                }
            } else {
                dispatch(categoriesActions.clearCategories());
            }
        } catch (err) {
            alert(err.message);
        }
    }

    async function editDataHandler(item) {
        try {
            dispatch(categoriesActions.editCategories(item));
            const id = item.id;
            dispatch(categoriesActions.deleteCategoriesData(id));

        } catch (err) {
            console.log(err.message);
        }
    }




    async function deleteDataHandler(id) {
        try {
            const response = await axios.delete(`https://restaurant-admin-panel-f2680-default-rtdb.firebaseio.com/categoriesdata/${id}.json`)
            dispatch(categoriesActions.deleteCategoriesData({ id }))
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className={classes.listContainer}>
            <h3>Recipe List</h3>
            {categoriesData.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                categoriesData.map((item) => (
                    <div key={item.id} className={classes.listItem}>
                        <img src={item.image} alt={item.name} />
                        <div className={classes.itemDetails}>
                            <p>{item.name}</p>
                            <p>Category: {item.category}</p>
                            <p>Price: {item.price}</p>
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

export default CategoriesManagementList;
