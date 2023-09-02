import React from 'react'
import Moment from 'react-moment'
import { NavLink } from 'react-router-dom'

let smallPost = {

}

let largePost = {

}

const JobPost = ({ post, type }) => {
    if (type === 'small') {
        return (
            <NavLink to={`/jobPosts/${post.id}`} className='d-flex my-2 shadow-sm p-2' style={{alignItems: "flex-start", textDecoration: "none", color: "#000", position: "relative"}}>
                <div>
                    <img src={post.owner.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", pointerEvents: "none" }} />
                </div>
                <div>
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
            <div className='d-flex align-items-start my-3 shadow p-2'>
                <div>
                    <img src={post.owner.photoURL} alt="" style={{ width: "60px", height: "60px", borderRadius: "50%", marginRight: "10px" }} />
                </div>
                <div>
                    <p className='p-0 m-0' style={{ fontFamily: "serif" }}>{post.job}</p>
                    <small className='p-0 m-0' style={{ fontFamily: "serif", color: "gray" }}><i className="fa-solid fa-location-dot" style={{ color: '#000' }}></i> {post.location}</small>
                </div>
            </div>
        )
    }
}

export default JobPost