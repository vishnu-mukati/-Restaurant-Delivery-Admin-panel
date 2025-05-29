import { useDispatch, useSelector } from "react-redux";
import classes from "./CategoriesManagementList.module.css";
import { useEffect } from "react";
import axios from "axios";
import { CategoriesActions } from "../../store/CategoriesSlice";

const CategoriesManagementList = () =>{
    const dispatch = useDispatch();
    const CategoriesData = useSelector(state=>state.Categories.Categories);
    const dataLoaded = useSelector(state=>state.Categories.dataLoaded);
      useEffect(() => {
        if(!dataLoaded)
            getData();  
        }, [dataLoaded])
    
        async function getData() {
        try {
            const response = await axios.get(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Categorieslist.json`)
            if (response.data) {
                for (const key of Object.keys(response.data)) {
                    const CategoriesData = {
                        id: key,
                        ...response.data[key],
                    }
                    dispatch(CategoriesActions.addCategories(CategoriesData));
                }
            } else {
                dispatch(CategoriesActions.clearCategories());
            }
        } catch (err) {
            alert(err.message);
        }
    }

      async function editDataHandler(item) {
            try {
                dispatch(CategoriesActions.editCategories(item));
                const id = item.id;
                dispatch(CategoriesActions.deleteCategoriesData(id));
    
            } catch (err) {
                console.log(err.message);
            }
        }
    
       async function deleteDataHandler(id) {
        try {
            const response = await axios.delete(`https://restaurant-admin-panel-7f6af-default-rtdb.firebaseio.com/Categorieslist/${id}.json`)
            dispatch(CategoriesActions.deleteCategoriesData({ id }))
        } catch (err) {
            alert(err.message);
        }
    }
    return (
         <div className={classes.listContainer}>
                    <h3>Categories List</h3>
                    {CategoriesData.length === 0 ? (
                        <p>No Recipes available.</p>
                    ) : (
                        CategoriesData.map((item) => (
                            console.log(item),
                            <div key={item.id} className={classes.listItem}>
                                <img src={item.image} alt={item.name} />
                                <div className={classes.itemDetails}>
                                    <p>{item.name}</p>
                                    <p>Category: {item.categorieName}</p>
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
}

export default CategoriesManagementList;