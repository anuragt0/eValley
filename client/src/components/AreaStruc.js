import React, { useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import AreaContext from '../context/AreaContext';

const AreaStruc = (props) => {

    const navigate = useNavigate();

    const context = useContext(AreaContext);
    const {area1, setArea} = context;
    // console.log("clicked area is", area);

    const bookSlot =()=>{
        // const data = {"areaID": areaID};
        // console.log("Show all slots of area with id: ",areaID);
        setArea(props.area);
        navigate(`/areas/slots`);
    }

    const seeReviews =()=>{
        setArea(props.area);
        navigate(`/areas/reviews`);
    }

    const {reviewArea, area} = props;
    
  return (
        <>
          <div className="card" id={`${props.area._id}`} style={{width: "18rem", border: "1px solid", display:"inline-block", padding: "20px", margin: "40px"}}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY-1IC8C9PRC45b_SUwrxwJWp1VitPNcEjFA&usqp=CAU" className="card-img-top" alt="..."/>
            <div className="card-body">
                <p className="card-title"> <b>Name: </b> {props.area.name}</p>
                <p className="card-text"><b>Address: </b>{props.area.address}</p>
                <p className="card-text"><b>Ratings: </b>{props.area.avgRating==null?"unrated":props.area.avgRating+"/5"}</p>
                <p className="card-text"><b>Total reviews: </b>{props.area.totalReviews==null?0:props.area.totalReviews}</p>

                <div className="btn-toolbar">
                    <button type="button" id="btnSubmit" onClick={()=>{reviewArea(area)}} className="btn btn-primary btn-sm mx-3">Review</button>
                    <button type="button" id="btnCancel" onClick={bookSlot} className="btn btn-primary btn-sm mx-3">Book Slot</button>
                    <button type="button" onClick={seeReviews} className="btn btn-primary btn-sm mx-3 my-3 mx-auto">See reviews</button>
                </div>
            </div>
        </div>
    
        </>
  )
}

export default AreaStruc
