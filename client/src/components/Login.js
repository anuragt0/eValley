import React, { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import AreaContext from '../context/AreaContext';

const Login = (props) => {
    const navigate = useNavigate();
    const context = useContext(AreaContext);
    const {isAdmin, setIsAdmin} = context;

    const [credentials, setCredentials] = useState({email: "", password: ""});
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';


    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        // console.log('email: ', credentials.email);
        console.log(json);
        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            navigate("/areas");
            // props.showAlert("Logged in succesfully", "success");
            // Checking if user is admin or not
            fetch(`${host}/api/auth/getuser`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            })
            .then((response) => response.json())
            .then((data) => {
                // console.log('USER IS:', data);
                if(data.role==='admin'){
                    setIsAdmin(true);
                }
                // Navbar.forceUpdate();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            // window.location.reload();
        }
        else{
            alert("Invalid credentials");
            console.log("Please enter valid credentials");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }


  return (
    <div>
        
        {/* <div className="container col-xl-10 col-xxl-8 px-4 py-5">
    <div className="row align-items-center g-lg-5 py-5 signin-row" > 
      <div className="col-lg-7 text-center text-lg-start">
        <h1 className="display-4 fw-bold lh-1 mb-3">Vertically centered hero sign-up form</h1>
        <p className="col-lg-10 fs-4">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
      </div>
      <div className="col-md-10 mx-auto col-lg-5">
        <form className="p-4 p-md-5 border rounded-3 bg-light">
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="floatingInput" name='email' placeholder="Email" value={credentials.email} onChange={onChange}/>
            <label htmlFor="floatingInput">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="floatingPassword" name='password' placeholder="Password" value={credentials.password} onChange={onChange}/>
            <label htmlFor="floatingPassword">Password</label>
          </div>
          
          <button className="w-100 btn btn-lg btn-primary" type="submit" onClick={handleSubmit}>Sign in</button>
          
        </form>
      </div>
    </div>
  </div> */}
  <section className="vh-100">
  <div className="container-fluid h-custom my-5">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-9 col-lg-6 col-xl-5">
        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="img-fluid" alt="Sample image"/>
      </div>

      <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form className='my-5'>
          
          <div className="form-outline mb-4">
          <input type="email" className="form-control form-control-lg"  id="floatingInput" name='email' placeholder="Enter a valid email address" value={credentials.email} onChange={onChange}/>
            <label className="form-label" htmlFor="floatingInput">Email</label>
            {/* <input type="email" id="form3Example3" className="form-control form-control-lg" */}
              {/* placeholder="Enter a valid email address" /> */}
            {/* <label className="form-label" for="form3Example3">Email address</label> */}
          </div>

          <div className="form-outline mb-3">
            {/* <input type="password" id="form3Example4" className="form-control form-control-lg"
              placeholder="Enter password" />
            <label className="form-label" for="form3Example4">Password</label> */}

            <input type="password" className="form-control form-control-lg" id="floatingPassword" name='password' placeholder="Enter Password" value={credentials.password} onChange={onChange}/>
            <label className="form-label" htmlFor="floatingPassword">Password</label>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            
            <Link  className="text-body" to="/signup">Forgot password?</Link>
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}
              >Login</button>
            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/signup"
                className="link-danger">Register</Link></p>
          </div>

        </form>
      </div>
    </div>
  </div>
 
</section>

    </div>
  )
}

export default Login