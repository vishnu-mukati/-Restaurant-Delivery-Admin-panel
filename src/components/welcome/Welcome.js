import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthSlice";
import CategoriesManagement from "../Categories-management/CategoriesManagement";
import RecipesManagement from "../Recipes-management/RecipeManagement";
import classes from './Welcome.module.css';
import Orders from "../page/Orders";

const CreateRecipes = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState('recipes');

    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    const toggleCategoriesHandler = (page) =>{
         setCurrentPage((prevPage) => (prevPage === page ? false : page));
    }

    const toggleRecipesHandler = (page) => {
        setCurrentPage((prevPage) => (prevPage === page ? false : page));
    };

    return (
        <Fragment>
            <div className={classes.adminPanelContainer}>
                <div className={classes.header}>
                    <h1>Welcome to Admin Panel</h1>
                </div>

                <button onClick={logoutHandler} className={classes.logoutButton}>
                    Log Out
                </button>


                <div className={classes.buttonContainer}>
                    <button 
                        className={classes.button}
                        onClick={()=> toggleCategoriesHandler('categories')}
                    >
                        Categories
                    </button>
                    <button
                        className={classes.button}
                        onClick={() => toggleRecipesHandler('recipes')}
                    >
                        Recipes
                    </button>
                    <button
                        className={classes.button}
                        onClick={() => toggleRecipesHandler('updateorderstatus')}
                    >
                         Orders
                    </button>
                </div>

                {currentPage === 'categories' && (
                    <div className={classes.panelContent}>
                        <CategoriesManagement
                            closeRecipesManagementPage={() => setCurrentPage(false)}
                        />
                    </div>
                )}

                {currentPage === 'recipes' && (
                    <div className={classes.panelContent}>
                        <RecipesManagement
                            closeRecipesManagementPage={() => setCurrentPage(false)}
                        />
                    </div>
                )}
                {currentPage === 'updateorderstatus' && (
                    <div className={classes.panelContent}>
                        <Orders closeRecipesManagementPage={() => setCurrentPage(false)}/>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default CreateRecipes;
