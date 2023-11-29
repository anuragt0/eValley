import React, {useEffect, useState, useRef } from 'react'
 
const UserProfile = () => {
    const ref = useRef(null);
    const refClose = useRef(null);
    const [user, setUser] = useState({name: "", email: "",phone: "", role: ""});
    const authToken = localStorage.getItem('token');
    
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';
    const [newUser, setNewUser] = useState({name: "", email: "", phone: ""});
    

    useEffect(() => {
        fetch(`${host}/api/auth/getuser`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
        })
        .then((response) => {return response.json()})
        .then((data) => {
            console.log('Success:', data);
            setUser({name: data.name, email: data.email, role: data.role, phone: data.phone});
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
        // getAreas();
        // eslint-disable-next-line
    }, [])

    const onChange = (e)=>{
        setNewUser({...newUser, [e.target.name]: e.target.value})
    }
    const handleEdit = ()=>{
        ref.current.click();
    }
    const handleEditFinal = (e)=>{
        e.preventDefault();
        const {name, phone} = newUser;
        if(name.length<3){
            alert('Name must be atleast 3 characters long');
            return;
        }
        if((phone[0]!=='6' && phone[0]!=='7' &&phone[0]!=='8' &&phone[0]!=='9' ) || phone.length!=10){
            alert('Invalid phone number');
            return;
        }
        fetch(`${host}/api/auth/editprofile`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            body: JSON.stringify({name: newUser.name, email: newUser.email, phone: newUser.phone}),
        })
        .then((response) => {return response.json()})
        .then((data) => {
            console.log('Success:', data);
            setUser({name: data.name, email: data.email, role: data.role, phone: data.phone});
            refClose.current.click();
            // alert(data.msg);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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
              <h5 className="modal-title" id="exampleModalLabel">
                Edit profile
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
              {/* Form */}
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    name="phone"
                    onChange={onChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref = {refClose}
              >
                Close
              </button>
              <button
                onClick={handleEditFinal}
                type="button"
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    
    
    <div>
        <section className="vh-100" style={{backgroundColor: "#f4f5f7", marginTop: "50px"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-lg-6 mb-4 mb-lg-0">
        <div className="card mb-3" style={{borderRadius: ".5rem"}}>
          <div className="row g-0">
            <div className="col-md-4 gradient-custom text-center text-white"
              style={{borderTopLeftRadius: ".5rem", borderBottomLeftRadius: ".5rem"}}>
              <img src="https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg?itok=aMC1MRHJ"
                alt="Avatar" className="img-fluid my-5" />
              <h5>{user.name}</h5>
              <i className="far fa-edit mb-5" style={{cursor: "pointer"}} onClick={handleEdit}></i>
            </div>
            <div className="col-md-8">
              <div className="card-body p-4">
                <h4>User Information</h4>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                  <div>
                    <h6 >&nbsp;&nbsp;&nbsp;&nbsp;Email&nbsp;: </h6>
                    <h6>&nbsp;&nbsp;&nbsp;&nbsp;{user.email}</h6>
                  </div>
                </div>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                  <div>
                    <h6 >&nbsp;&nbsp;&nbsp;&nbsp;Phone&nbsp;: </h6>
                    <h6>&nbsp;&nbsp;&nbsp;&nbsp;{user.phone}</h6>
                  </div>
                </div>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                  <div>
                    <h6 >&nbsp;&nbsp;&nbsp;&nbsp;Role&nbsp;: </h6>
                    <h6>&nbsp;&nbsp;&nbsp;&nbsp;{user.role}</h6>
                  </div>
                </div>
                <hr className="mt-0 mb-4"/>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
    </>
  )
}

export default UserProfile