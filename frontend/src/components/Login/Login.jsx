import styles from "./Login.module.css";
import { Link } from "react-router-dom";

export default function Login() {

  return (
    <container className={`${styles.loginContainer}`}>
      <form className={`${styles.loginForm}`}>
        <div >
          <h2>Executive HR Pulse</h2>
          <p>
            Welcome back. Please sign in to access your administrative suite.
          </p>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <i className="fa-solid fa-envelope"></i>
          </span>
          <input type="email" className="form-control" placeholder="Email" />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <i className="fa-solid fa-lock"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="" id="" />
          <label className="form-check-label" htmlFor="">
            I agree to the Terms of Service and Privacy Policy regarding my
            data.
          </label>
        </div>

         <button  type="submit" className={styles.button}>
          <Link to='/dashboard' style={{textDecoration:'none' , color:'white'}}>
                  Login to Suite
          </Link>
                </button>
                <button  type="submit" className={styles.button}>
                  Forgot password?
                  <Link className={styles.link} to="/forgot-password">
                    Reset here
                  </Link>
                </button>

                <p>Don't have an account? Contact HR Support</p>
      </form>
    </container>
  );
}
