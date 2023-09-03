import React from 'react'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'

let smallPost = {

}

let largePost = {

}

const JobPost = ({ post, user, type }) => {
    if (type === 'small') {
        return (
            <NavLink to={`/jobs/${post.id}`} className='d-flex my-2 shadow-sm p-2' style={{alignItems: "flex-start", textDecoration: "none", color: "#000", position: "relative"}}>
                <div>
                    <img src={user?user.photoURL:post.owner.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", pointerEvents: "none" }} />
                </div>
                <div style={{marginBottom: "12px"}}>
                    <p className='p-0 m-0' style={{ fontFamily: "serif" }}>{post.job}</p>
                    <small className='p-0 m-0 d-block' style={{ fontFamily: "serif", color: "gray" }}>{post.company}</small>
                    <small className='p-0 m-0 d-block' style={{ fontFamily: "serif", color: "gray" }}><i className="fa-solid fa-location-dot" style={{ color: '#000' }}></i> {post.location}</small>
                </div>
                <span style={{fontSize: "10px", position: "absolute", bottom: "5px", right: "10px", color: "grey"}}>~<Moment fromNow>{post.dateAdded}</Moment></span>
            </NavLink>
        )
    }
    else if (type === 'large') {
        return (
            <NavLink to={`/jobs/${post.id}`} className='d-flex align-items-start my-3 shadow-sm p-2' style={{textDecoration: "none", color: "#000"}}>
                <div>
                    <img src={post.owner.photoURL} alt="" style={{ width: "60px", height: "60px", borderRadius: "50%", marginRight: "10px", pointerEvents: "none" }} />
                </div>
                <div>
                    <p className='p-0 m-0' style={{ fontFamily: "serif", fontSize: "20px" }}><b>{post.job}</b></p>
                    <small className='p-0 m-0' style={{ fontFamily: "serif", color: "#5c5c5c", display: "block", fontSize: "18px" }}>{post.company}</small>
                    <small className='p-0 m-0' style={{ fontFamily: "serif", color: "gray", display: "block", fontSize: "16px" }}><i className="fa-solid fa-location-dot" style={{ color: '#5c5c5c' }}></i> {post.location}</small>
                    <small className='p-0 m-0' style={{ fontFamily: "serif", color: "gray", display: "block", fontSize: "15px" }}><Moment fromNow>{post.dateAdded}</Moment></small>
                </div>
            </NavLink>
        )
    }
}

export default JobPost