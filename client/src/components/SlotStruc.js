import React from 'react'
import { useRef } from 'react';

const SlotStruc = (props) => {
    // console.log("props are:", props.slot);
    const isBooked = props.slot.isBooked;

  return (
    
    <div  onClick={()=> props.handleClickOnSlot(props.slot, props.reff)} className='showpointer mx-3 my-3' style={{display:"inline-block"}}>
    <div id={`${props.slot._id}`} ref={props.reff}   className='showpointer'   title={isBooked?"Booked":"Not Booked"}   style={{height: "100px", width:"100px", border:"8px solid", margin:"10px", display:"inline-block", backgroundColor: isBooked ? "#e28743" : "#abdbe3", borderRadius:"20px" }}>
        <h1 style={{display:"inline-block"}}>{props.slot.number}</h1>
    </div>
    </div>
  )
}

export default SlotStruc
