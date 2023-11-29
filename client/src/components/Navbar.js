import React, { useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import AreaContext from '../context/AreaContext';

const Navbar = () => {
    const context = useContext(AreaContext);
    const {isAdmin, setIsAdmin} = context;

    const navigate = useNavigate();
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }

    const showUserProfile = ()=>{
        navigate('/profile')
    }
    

    useEffect(() => {
    //   const authToken = localStorage.getItem('token');
    //   console.log("authtoken is: ", authToken);
      if(localStorage.getItem('token')){
        // console.log("hereeeeeeeeee");
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
      }

    }, [])
    

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          Phoenix
        </a>
        <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link active"  to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link active" to="/areas">
                Slot details
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link active" to="/about">
                About
              </Link>
            </li>

          </ul>
          <ul className="nav navbar-nav navbar-right">
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <li className="nav-item active">
                  <Link className="nav-link active mx-3" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link active mx-3" to="/signup">
                    Sign up
                  </Link>
                </li>
              </form>
            ) : (
                <>
                {/* CHECK IF USER IS ADMIN */}
                {/* {console.log("ISADMIN: ", isAdmin)} */}
                {isAdmin?(<> 
                <li className="nav-item active">
                  <Link className="nav-link active mx-3" to="/admin">
                    <button className="btn btn-success">Admin stuff</button> 
                  </Link>
                    </li>
                    <li className="nav-item active">
                  <Link className="nav-link active mx-3" to="/admin/device">
                    <button className="btn btn-success">Dustbin details</button> 
                  </Link>
                    </li>
                     </>
                ):(<p></p>)}
                <button className="mx-3" onClick={showUserProfile}>
                    <i className="fa-solid fa-user " onClick={showUserProfile}></i>
                </button>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
              </>
            )}
          </ul>
        </div>
      </nav>
      
    </div>
  );
};

export default Navbar;
