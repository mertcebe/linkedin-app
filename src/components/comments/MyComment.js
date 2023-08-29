import React from 'react'
import Moment from 'react-moment';

const MyComment = ({ comment }) => {
    const { text, dateAdded, sender } = comment;
    return (
        <div className='d-flex mb-3' style={{alignItems: "flex-start"}}>
            <img src={sender.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
            <div style={{marginLeft: "10px"}}>
                <p className='p-0 m-0' style={{ color: "grey", fontSize: "12px" }}>@<b>{sender.name}</b> ~<small><Moment fromNow>{dateAdded}</Moment></small></p>
                <p className='p-0 m-0 mb-1' style={{ color: "#000", fontSize: "10px" }}><i class="fa-solid fa-envelope"></i> {sender.email}</p>
                <p className='p-0 px-2 m-0 bg-light' style={{borderRadius: "10px", borderTopLeftRadius: "0"}}>{text}</p>
            </div>
        </div>
    )
}

export default MyComment