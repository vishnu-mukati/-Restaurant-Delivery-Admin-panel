import { useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import classes from './AuthForm.module.css';
import axios from 'axios';
import { authActions } from '../../store/AuthSlice';
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  async function formSubmitHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDaNpijGkjW8oR2729Z3IrBcLlZ-n7EaSM';

    try {
      const response = await axios.post(url, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });

      setIsLoading(false);
      const token = response.data.idToken;

      dispatch(authActions.isLogin({ email: enteredEmail, token: token }));

      if (response.status === 200) {
        console.log('User logged in successfully');
        history.push("/");  // Redirect to homepage or dashboard
      }
    } catch (err) {
      alert(err.response.data.error.message);
      setIsLoading(false);
    }
  }

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>

        <div className={classes.actions}>
          <button type='submit' className={classes.actions}>
            {isLoading ? "Sending request..." : "Login"}
          </button>
        </div>

        <div>
          <a href="/changepassword" className={classes.forgotPassword}>
            Forgot Password?
          </a>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;

