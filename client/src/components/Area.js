import {useEffect, useState, useRef } from "react";
// import areaContext from "../context/areas/areaContext";
import AreaStruc from "../components/AreaStruc";
import { useNavigate } from 'react-router-dom';


const Area = () => {
    const ref = useRef(null);
    const refClose = useRef(null);
    const navigate = useNavigate();
    // const host = "http://localhost:5000";
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';


    const [areas, setAreas] = useState([]);
    
    useEffect(() => {
        fetch(`${host}/api/getareas`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log('Success:', data);
            setAreas(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
        // getAreas();
        // eslint-disable-next-line
    }, [])

    const [review, setReview] = useState({rating: 5, review: ""});
    const [areaToReview, setAreaToReview] = useState({});

    const reviewArea = (clickedArea)=>{
        // console.log('Clicked on review');
        if(!localStorage.getItem('token')){
            navigate('/login');
        }
        else{
            ref.current.click();
            setAreaToReview(clickedArea);   
        }

    }

    const onChange = (e)=>{
        setReview({...review, [e.target.name]: e.target.value})
    }

    const handleClick = (e)=>{
        // ref.current.click();
        e.preventDefault();
        console.log("Clicked area is: ", areaToReview);
        // API call to http://localhost:5000/api/auth/review
        // Requirements: rating and review in body, auth-token in header, "areaid"
        // If user is not logged in redirect to /login 
        {if(!localStorage.getItem('token')){
            navigate('/login');
            return;
        }}
        if(review.review.length<3 && (review.rating<1 || review.rating>5)){
            alert('Review should be atleast 3 characters long and rating must be in between 1 and 5');
            return;
        }
        if(review.review.length<3){
            alert('Review should be atleast 3 characters long');
            return;
        }
        if(review.rating<1 || review.rating>5){
            alert('Rating should be in between 1 and 5');
            return;
        }

        const areaid = areaToReview._id;
        const authToken = localStorage.getItem('token');
        const ratingg = parseInt(review.rating, 10);
        console.log("here: ", authToken);
        const data = {areaid: areaid, rating: ratingg, review: review.review};
        console.log("data: ", data);
        

        fetch(`${host}/api/auth/review`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('Successful:', data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });

        refClose.current.click();

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
                Review
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
                  <label htmlFor="rating" className="form-label">
                    Rating
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    aria-describedby="emailHelp"
                    // value={note.etitle}
                    onChange={onChange}
                    // minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="review" className="form-label">
                    Review
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="review"
                    name="review"
                    // value={note.edescription}
                    onChange={onChange}
                    minLength={3}
                    required
                  />
                </div>
              </form>
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
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      </div>

        <div className="row my-3" style={{backgroundColor: "#EDDFB3"}}>
        {areas.map((area)=>{
            // {console.log("area is: ",area);}
            return <AreaStruc key={area._id} reviewArea={reviewArea} area={area}/>
        })}
        </div>
    </>
  )
}

export default Area