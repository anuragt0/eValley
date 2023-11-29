import React, { useEffect, useState } from 'react'

const AdminRevenue = () => {
    const pricePerSlot = 10;
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';
    const date = new Date();
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const [revenue, setRevenue] = useState(0);
    const asdf  = "asdfasd";

    useEffect( () => {
        fetch(`${host}/api/auth/getrevenue`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setRevenue(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [])
    

  return (
    <div>
        <h1 className='my-3' style={{textAlign: "center"}}>Revenue details</h1>

        <h2>Total revenue for: </h2> 
        <h2><b> {date.getDate()} {month[date.getMonth()]} {date.getFullYear()}</b></h2>

        <h1> <b> {revenue}</b><i class="fa-solid fa-indian-rupee-sign"></i></h1>

    </div>
  )
}

export default AdminRevenue