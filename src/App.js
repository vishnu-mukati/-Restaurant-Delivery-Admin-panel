import { useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import AuthForm from "./components/auth/AuthForm";
import ChangePassword from "./components/page/ChangePassword";
import Welcome from "./components/welcome/Welcome";

function App() {
    // const isAuth = useSelector(state => state);
    const isAuth = useSelector(state => state.auth.isAuthenticated);
    return (
        <BrowserRouter>
            <Switch>
                {!isAuth && <Route path='/' exact component={AuthForm} />}
                <Route path='/changepassword' component={ChangePassword} />
                {isAuth && (
                    <Route path="/" exact component={Welcome} />
                )}
                <Route>
                    <Redirect to='/' />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;