import React from 'react'

const ReviewStruc = (props) => {
    const {review} = props;
    let date = new Date(review.date).toUTCString();
    date = date.split(' ').slice(0, 4).join(' ')
    console.log(date);

  return (
    <div className="card" id={`${review._id}`} style={{width: "18rem", display:"inline-block", padding: "20px", margin: "40px"}}>
            <div className="card-body">
                <p className="card-title"> <b>By: </b> {review.userName}</p>
                <p className="card-text"><b>Rating: </b>{review.rating}/5</p>
                <p className="card-text"><b>Review: </b>{review.review}</p>
                <p className="card-text"><b>Time: </b>{date}</p>

                
            </div>
        </div>
  )
}

export default ReviewStruc