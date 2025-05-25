import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthSlice";
import CategoriesManagemenet from "../categories-management/CategoriesManagement";
import classes from './Welcome.module.css';
import Orders from "../page/Orders";

const CreateRecipes = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState('categories');

    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    const toggleCategoriesHandler = (page) => {
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
                        onClick={() => toggleCategoriesHandler('categories')}
                    >
                        Add Categories & Recipes
                    </button>
                    <button
                        className={classes.button}
                        onClick={() => toggleCategoriesHandler('updateorderstatus')}
                    >
                        Update Order Status
                    </button>
                </div>

                {currentPage === 'categories' && (
                    <div className={classes.panelContent}>
                        <CategoriesManagemenet
                            closeCategoriesManagementPage={() => setCurrentPage(false)}
                        />
                    </div>
                )}
                {currentPage === 'updateorderstatus' && (
                    <div className={classes.panelContent}>
                        <Orders closeCategoriesManagementPage={() => setCurrentPage(false)}/>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default CreateRecipes;
