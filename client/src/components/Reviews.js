import {React, useContext, useEffect, useState} from 'react'
import AreaContext from '../context/AreaContext';
import ReviewStruc from './ReviewStruc';

const Reviews = () => {
    const context = useContext(AreaContext);
    const {area} = context;
    // console.log("Clicked area is: ", area);
    const [reviewsArray, setReviewsArray] = useState([]);
    const host = process.env.NODE_ENV === 'production' ? 'https://evalleyy.herokuapp.com' : 'http://localhost:5000';


    useEffect(() => {
        const data = {areaid: String(area._id)};
        fetch(`${host}/api/getreviews`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((dataa) => {
                console.log('From Reviews component:', dataa);
                setReviewsArray([...dataa]);
                // console.log("here", reviewsArray);
            })
            .catch((error) => {
                console.error('Error:', error);
            });  
    }, [])

    return (
        <>
            <h2 className='my-3'>Reviews: <b> {area.name}, {area.address}</b></h2>
            {/* {console.log("Reviews array looks like", reviewsArray)} */}
            {reviewsArray.length==0? <h2>This area currently has no reviews</h2>:
            <div className="row my-3">
                {reviewsArray.map((review)=>{
                    return <ReviewStruc key={review._id} review={review}/>
                })}
            </div>
            }
        </>
    )
}

export default Reviews