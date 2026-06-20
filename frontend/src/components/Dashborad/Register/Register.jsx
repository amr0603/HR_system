import styles from "./Register.module.css";
import {Link} from 'react-router-dom'
export default function Register() {
  return (
    <div className={`${styles.container}`}>
      <form className={`${styles.register}`}>
        <div className={`${styles.int}`}>
          <i class="fa-solid fa-user-shield"></i>
          <h3>ExecuHR</h3>
          <p>Enterprise HRM Suite</p>
        </div>

        <div className={`${styles.form}`}>
          <div className={`${styles.input}`}>
            <span className="input-group-text" id="addon-wrapping">
              <i className="fa-solid fa-user"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
            />
          </div>
          <div className={`${styles.input}`}>
            <span className="input-group-text" id="addon-wrapping">
              <i className="fa-solid fa-envelope"></i>
            </span>
            <input type="email" className="form-control" placeholder="Email" />
          </div>
        </div>

        <div className={`${styles.formpassword}`}>
          <div className={`${styles.input}`}>
            <span className="input-group-text" id="addon-wrapping">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
            
            />
          </div>
          <div className={`${styles.input}`}>
            <span className="input-group-text" id="addon-wrapping">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
           
            />
          </div>
        </div>
        <div className={`${styles.input}`}>
          <input type="checkbox" name="" id="" />
          <span>
            I agree to the Terms of Service and Privacy Policy regarding my
            data.
          </span>
        </div>

        <button className={`${styles.button}`} type="button">
          Create Account
        </button>

      <div className={`${styles.line}`}></div>
         <p>Already have an account? <Link to="/login">Login</Link></p>


        
      </form>
    </div>
  );
}
