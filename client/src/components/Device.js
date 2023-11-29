import React, { useEffect, useState } from 'react'

const Device = () => {
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';
    const [filled, setFilled] = useState(false);
    const [time, setTime] = useState("");

    // useEffect(()=>{
    //     console.log("asdfasdf");
    //     getDetail();
    // });
    setInterval(() => {
        console.log("asdfasdf");
        getDetail();
    }, 8000);
    const getDetail = async ()=>{
        await fetch(`${host}/api/getdevices/`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setFilled(data.allDevices.filled);
            if(filled===false){
                setTime(data.allDevices.time);
            }
            // console.log(filled);
            // console.log(time);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }


  return (
    <div>
        <h1>Dustbin status</h1>
        <hr />
        <h3>Checking the LIVE status of dustbin. Please wait...</h3>
        <h3>Status: <span style={{color: 'red'}}> {filled?(`Dustbin is filled `):`Dustbin is empty `}</span></h3>
        {filled?<img height={"400px"} src="https://thumbs.dreamstime.com/z/angry-green-recycle-bin-cartoon-mascot-character-full-garbage-gesturing-stop-vector-illustration-isolated-white-background-182682366.jpg" alt="" />: <img height={"400px"} src="https://previews.123rf.com/images/chudtsankov/chudtsankov1607/chudtsankov160700278/61547748-happy-green-recycle-bin-cartoon-mascot-character-waving-for-greeting-illustration-isolated-on-white-.jpg" alt="" />}
    </div>
  )
}

export default Device