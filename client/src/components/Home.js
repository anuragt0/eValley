import React from 'react'
import { useState, useEffect } from 'react';

const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';

const Home = () => {
    const authToken = localStorage.getItem('token');
const [user, setUser] = useState({name: ""});

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
        setUser({name: data.name});
    })
    .catch((error) => {
        console.error('Error:', error);
    });

  
}, [])
  return (
    <>
        <div className='my-5'>
            <h1>Welcome <p style={{color: "red"}}>{localStorage.getItem('token')?(user.name): "user"} <i class="fa-solid fa-hands-praying"></i></p></h1>
        </div>
        <hr style={{height:"1px", border:"none", color:"#333", backgroundColor:"#333"}} />    
        <h1 style={{fontSize: "40px"}}> Overview</h1>
        <div className='my-3' style={{fontSize: "27px", color:'#0F3D3E'}}>
        <p className='my-3'  ><b>eValley</b> provides you a platform where you can book slots, review any area/slot and get all the details regarding slot booking from only few clicks. We the eValley team is blessed to serve you selflessly. Any queries and suggestions are always welcome. Thank you.</p>
        </div>
        <hr className='my-5'/>

          
        <h1 >User manual</h1>
        <p style={{fontSize: "27px", color:'#0F3D3E'}} className='my-3'  >Want to learn to book a slot? Watch out this tutorial video which will guide you through our platform!</p>

        <video  className='my-5' width="800" height="400" controls >
            <source src="/manual.mp4" type="video/mp4"/>
        </video>

        
    <h1>Any problems?</h1>
    <p style={{fontSize: "27px", color:'#0F3D3E'}} className='my-3'  >Share your problems with us and our team will reach out to you in 24 hours!</p>
    <form className='my-5'>
  <div className="form-group" fontSize="20px">
    <label for="exampleInputEmail1" style={{fontSize: "25px"}}>Email </label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div className="form-group my-5">
    <textarea name="textarea" id="" cols="50" rows="10" placeholder='Describe your problem in detail'></textarea>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>

    <h1>About us</h1>
    <div className='my-5'>
    <p style={{fontSize: "27px", color:'#0F3D3E'}} className='my-3'>We are a tech based startup which works for providing different types facilities for vendors.</p>
    <p style={{fontSize: "27px", color:'#0F3D3E'}} className='my-3'>Want to react out?</p>
    <hr />
    <p style={{fontSize: "27px", color:'#0F3D3E'}}>Contact: <b>9522216277</b> </p>
    <p style={{fontSize: "27px", color:'#0F3D3E'}}>Email: <b>sibyangeline@gmail.com</b> </p>
    </div>
    <hr style={{height:"1px", border:"none", color:"#333", backgroundColor:"#333"}} className='my-5' />    
    </>
  )
}

export default Home