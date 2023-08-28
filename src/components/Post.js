import React, { useEffect, useState } from 'react'
import defaultProfileImg from '../images/profileImg2.jpg';
import { IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import database, { auth } from '../firebase/firebaseConfig'

const Post = ({ post }) => {
  const { text, comments, likes, owner, img, dateAdded, id } = post;
  let [checked, setChecked] = useState(false);
  let [likesNum, setLikesNum] = useState(likes);
  let [disabled, setDisabled] = useState(false);

  // look at this one more time***************

  const submitLikesToFirestore = (type, likesNum) => {
    updateDoc(doc(database, `users/${owner.uid}/posts/${id}`), {
      likes: likesNum
    })
      .then(() => {
        updateDoc(doc(database, `allPosts/${id}`), {
          likes: likesNum
        })
      })
    if (type === 'like') {
      setDoc(doc(database, `users/${auth.currentUser.uid}/myLikes/${id}`), {
        ...post,
        likes: likesNum
      })
    }
    else if (type === 'unlike') {
      deleteDoc(doc(database, `users/${auth.currentUser.uid}/myLikes/${id}`));
    }
  }

  const likeFunc = (result) => {
    setDisabled(true);
    if (result === true) {
      setLikesNum(likesNum + 1);
      setChecked(true);
      submitLikesToFirestore('like', likesNum + 1);
    }
    else {
      setLikesNum(likesNum - 1);
      setChecked(false);
      submitLikesToFirestore('unlike', likesNum - 1);
    }

    setTimeout(() => {
      setDisabled(false)
    }, 1000);
  }

  useEffect(() => {
    const controlMyLikes = async () => {
      getDoc(doc(database, `users/${auth.currentUser.uid}/myLikes/${id}`))
      .then((snapshot) => {
        if(snapshot.exists()){
          setChecked(true);
        }
        else{
          setChecked(false);
        }
      })
    }
    controlMyLikes();
  }, []);

  return (
    <div className='shadow-sm' style={{ backgroundColor: "#fff", boxSizing: "border-box", padding: "10px", margin: "10px 0", borderRadius: "10px" }}>
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
          <span><b>{likesNum}</b></span>
        </li>
        <li>
          <b style={{ color: "#0072b1" }}>
            <span style={{ marginRight: "4px" }}>{comments}</span>
            <span>comments</span>
          </b>
        </li>
      </ul>
      <hr style={{ margin: "5px 0", padding: "0" }} />
      <div className="d-flex align-items-center">
        <input type="checkbox" disabled={disabled} checked={checked} id={id} style={{ display: "none" }} defaultChecked={checked} onChange={(e) => {
          likeFunc(e.target.checked)
        }} />
        <label htmlFor={id} style={{ margin: "5px 0px 10px 10px", cursor: "pointer", color: checked ? '#0072b1' : 'grey' }}><i className="fa-solid fa-thumbs-up"></i></label>
        <IconButton>
          <CommentIcon style={{ fontSize: "18px", color: "#0072b1" }} />
        </IconButton>
      </div>
    </div>
  )
}

export default Post