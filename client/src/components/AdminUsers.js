import {React, useEffect, useState, useRef} from 'react'

const AdminUsers = () => {
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';

    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({name: "", email: "", phone: "", role: ""});

    const ref = useRef(null);
    const refClose = useRef(null);
    const ref2 = useRef(null);
    const refClose2 = useRef(null);

    useEffect(() => {
        fetch(`${host}/api/auth/admin`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("DATA from users admin is: ", data);
            setUsers(data.allUsers);
        })
        .catch((error) => {
            console.error('Error:', error);
        });  
    }, [])

    const handleDelete = (user)=>{
        console.log("Deleting the user");
        setUser(user);
        ref.current.click();
    }

    const handleMakeAdmin = (user)=>{
        console.log("Making the user admin");
        setUser(user);
        ref2.current.click();
    }

    const handleDltConfirm = ()=>{
        const userID = user._id;
        fetch(`${host}/api/auth/deleteuser`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({userID: userID}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log({msg: "Deleted successfully",data});
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        refClose.current.click();
        window.location.reload();

    }

    const handleMakeAdminConfirm = ()=>{
        const userID = user._id;
        fetch(`${host}/api/auth/makeadmin`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({userID: userID}),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log({msg: "Successful",data});
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        refClose2.current.click();
        window.location.reload();

    }

  return (
    <>

    {/* MODAL STARTING */}
    <button
    ref={ref}
    type="button"
    className="btn btn-primary d-none"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Launch demo modal
  </button>

  <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="exampleModalLabel" style={{"color": "red"}}>
            <b>Delete User</b> 
          </h4>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">
          <h5>Name: {user.name}</h5>
          <h5>Email: {user.email}</h5>
          <h5>phone: {user.phone}</h5>
          <h5>role: {user.role}</h5>
          
        </div>
        <div className="modal-footer">
          <button 
            // ref={refClose}
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            ref = {refClose}
          >
            Close
          </button>
          <button
            onClick={handleDltConfirm}
            type="button"
            className="btn btn-danger"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* SECOND MODAL FOR ADDING AREA */}
  <button
    ref={ref2}
    type="button"
    className="btn btn-primary d-none"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal2"
  >
    Launch demo modal
  </button>

  <div
    className="modal fade"
    id="exampleModal2"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel" style={{"color": "green"}}>
            {user.role==='user'?(<>Make admin</>):( <>Remove admin</> )}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">
            <h5>Name: {user.name}</h5>
            <h5>Email: {user.email}</h5>
            <h5>phone: {user.phone}</h5>
            <h5>role: {user.role}</h5>
        </div>
        <div className="modal-footer">
          <button 
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            ref = {refClose2}
          >
            Close
          </button>
          <button
            onClick={handleMakeAdminConfirm}
            type="button"
            className="btn btn-primary"
          >
            {user.role==='user'?(<>Make admin</>):( <>Remove admin</> )}
          </button>
        </div>
      </div>
    </div>
  </div>


    <div>
      <h1 className="my-5">Users Information</h1>
      

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-danger mx-3"
                    onClick={() => handleDelete(user)}
                  >
                    Delete User
                  </button>
                  <button
                    className="btn btn-success mx-3"
                    onClick={() => handleMakeAdmin(user)}
                  >
                    {user.role==='user'?(<>Make admin</>):( <>Remove admin</> )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AdminUsers;
