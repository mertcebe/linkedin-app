import React from 'react'
import defaultProfileImg from '../images/profileImg2.jpg';
import { Divider, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Post = ({ post }) => {
  const { text, comments, likes, owner, img, dateAdded } = post;
  return (
    <div className='shadow-sm' style={{ backgroundColor: "#fff", boxSizing: "border-box", padding: "14px", margin: "10px 0", borderRadius: "10px" }}>
      <div className='d-flex' style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className='d-flex' style={{ alignItems: "flex-start" }}>
          <img src={owner.photoURL !== null ? owner.photoURL : defaultProfileImg} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
          <div>
            <small style={{ display: "block" }}><b>{owner.name}</b></small>
            <small style={{ display: "block", fontSize: "10px" }}>{owner.email}</small>
            <small style={{ display: "block", fontSize: "10px" }}>{new Date(dateAdded).getFullYear()}</small>
          </div>
        </div>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </div>
      <p className='m-0 py-1'>{text}</p>
      {
        img ?
          <div>
            <img src={img.src} alt="" style={{ width: "100%" }} />
          </div>
          :
          <></>
      }
      <ul className='d-flex' style={{ listStyle: "none", margin: "5px 0", padding: "0" }}>
        <li style={{ marginRight: "10px" }}>
          <i className="fa-brands fa-gratipay" style={{ color: "#0072b1", marginRight: "4px" }}></i>
          <span>{likes}</span>
        </li>
        <li>
          <b style={{ color: "#0072b1" }}>
            <span style={{ marginRight: "4px" }}>{comments}</span>
            <span>comments</span>
          </b>
        </li>
      </ul>
      <hr style={{ margin: "5px 0", padding: "0" }} />
      <div className="d-flex">
        <IconButton>
          <ThumbUpIcon style={{ fontSize: "18px", color: "#0072b1" }} />
        </IconButton>
        <IconButton>
          <CommentIcon style={{ fontSize: "18px", color: "#0072b1" }} />
        </IconButton>
      </div>
    </div>
  )
}

export default Post