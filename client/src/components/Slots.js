import {React, useContext, useState, useEffect, useRef, createRef} from 'react'
import AreaContext from '../context/AreaContext';
import SlotStruc from './SlotStruc';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";

const Slots = () => {
    
    const context = useContext(AreaContext);
    const navigate = useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const {area, setArea} = context;
    let temp_area = null;
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';

    const [slots, setSlots] = useState([]);
    const [vegSlot, setVegSlot] = useState([]);
    const [fruitSlot, setFruitSlot] = useState([]);
    const [grainSlot, setGrainSlot] = useState([]);
    const [user, setUser] = useState("");
    const [date, setDate] = useState("");
    let temp_i = 0;
    
    // let updatedSlots ;
    useEffect(() => {
        const date = new Date();
        let fullDate = "";
        
        fullDate += date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        setDate(fullDate);

        console.log(fullDate);
        
        let data;
        data = {"areaID": area._id};
        fetch(`${host}/api/getslots`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((dataa) => {
                // console.log('From slots component:', dataa);
                setSlots(()=>dataa);
                console.log("Got the slots");
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            fetch(`${host}/api/auth/getuser`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
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
    // let clickedSlotNumber;
    const [clickedSlott, setClickedSlott] = useState({id: "", number: null, reff: null});

    setTimeout(() => {
        // console.log("asdfasd", slots);
        let vegSlots = slots.filter((slot)=>{
            return slot.type === 'vegitable'
        })
        let fruitSlots = slots.filter((slot)=>{
            return slot.type === 'fruit'
        })
        let grainSlots = slots.filter((slot)=>{
            return slot.type === 'grain'
        })
        setVegSlot(vegSlots);
        setFruitSlot(fruitSlots);
        setGrainSlot(grainSlots);

    }, 1000);

    
    const generatePDF = ()=>{
        console.log("I am calleddddd");
        var doc = new jsPDF("p", "pt", "a4");
        doc.html(document.getElementById("#content"), {
            callback: function(pdf){
                pdf.save("paymentInvoice.pdf");
            }
        });
    }
    

    const handleClickOnSlot = (clickedSlot, reff)=>{
        // reff.current.style.backgroundColor = "#e28743";
        // console.log("Clicked on slot", clickedSlot);
        // console.log("Area of this slot: ", area._id);
        // Check if user is logged in
        
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
        else if(clickedSlot.isBooked){
            console.log("This slot is already booked");
        }
        else{
            setClickedSlott({id: clickedSlot._id, number: clickedSlot.number, reff: reff});
            ref.current.click();
        }
    }


    const handleConfirm = ()=>{
        refClose.current.click();
        // Book the slot with number clickedSlott and area id area._id
        const authToken = localStorage.getItem('token');
        const data = {areaID: area._id, slotnumber: clickedSlott.number};
        fetch(`${host}/api/auth/bookslot`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((dataa) => {
                console.log('Successfull:', dataa);
                if(dataa.success){
                    
                    clickedSlott.reff.current.style.backgroundColor = "#e28743";
                    setTimeout(() => {
                        alert( "Booked successfully");
                    }, 500);
                }
                else{
                    alert(dataa.msg);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // generatePDF();
    }
    const myRefs = useRef([]);
    myRefs.current = slots.map((element, i) => myRefs.current[i] ?? createRef());

  return (
    <div>
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
            <div className="modal-header" style={{textAlign: "center"}}>
              <div className="modal-title" id="exampleModalLabel" style={{textAlign: "center"}}>
                <h2>Receipt</h2>
              </div>
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
                <div id="content">

                
                <div className="mb-3" style={{textAlign:"left"}}>
                  <h5>Transaction ID: <pre> 111f38q12cba3234</pre></h5>
                </div>
                <div className="mb-3" style={{textAlign:"left"}}>
                  <h5>Date: <pre>  {date}</pre></h5>
                </div>
                <div className="mb-3">
                  <h5>Area name: <pre>{area.name}</pre></h5>
                </div>
                <div className="mb-3">
                  <h5>Slot number: <pre> <b>{clickedSlott.number}</b></pre> </h5>
                </div>
                
                <div className="mb-3">
                  <h5>Booked by: <pre> <b>{user.name}</b></pre></h5>
                </div>
                <hr />
                <div className="mb-3">
                  <h5>Amount to be paid: <pre>20 ₹</pre></h5>
                </div>
                </div>
              </form>
              {/* <hr />
                <h3 style={{color: "pink"}}>Receipt:</h3>
              <hr /> */}
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
                onClick={handleConfirm}
                type="button"
                className="btn btn-primary"
              >
                Book & Print receipt
              </button>
            </div>
          </div>
        </div>
      </div>
      
        <h3 className='my-5'><b>Area:</b>  {area.name}</h3>
        <h3 className='my-5'><b>Address:</b> {area.address}</h3>
        <hr className='my-5'/>
        <h3 className='my-5'>Pick a slot you want to book-</h3>
        <hr />
        <h2 style={{color: "red"}}>Vegetables</h2>
        {vegSlot.map((slot,i) => {
          return (
            <SlotStruc key={slot._id} reff = {myRefs.current[temp_i++]} slot={slot} areaID={area._id} handleClickOnSlot={handleClickOnSlot} />
          );
        })}
        <hr />
        <h2 style={{color: "red"}}>Fruits</h2>
        {fruitSlot.map((slot,i) => {
          return (
            <SlotStruc key={slot._id} reff = {myRefs.current[temp_i++]} slot={slot} areaID={area._id} handleClickOnSlot={handleClickOnSlot} />
          );
        })}
        <hr />
        <h2 style={{color: "red"}}>Others</h2>
        {grainSlot.map((slot,i) => {
          return (
            <SlotStruc key={slot._id} reff = {myRefs.current[temp_i++]} slot={slot} areaID={area._id} handleClickOnSlot={handleClickOnSlot} />
          );
        })}
        
    </div>
  )
}

export default Slots