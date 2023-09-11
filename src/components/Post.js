import React, { useEffect, useState } from 'react'
import defaultProfileImg from '../images/profileImg2.jpg';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import database, { auth } from '../firebase/firebaseConfig'
import Comments from './comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Moment from 'react-moment'
import { toast } from 'react-toastify';
import ProfilePage from './ProfilePage';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const { text, comments: commentsNum, likes, owner, img, dateAdded, id } = post;
  let [checked, setChecked] = useState(false);
  let [likesNum, setLikesNum] = useState(likes);
  let [disabled, setDisabled] = useState(false);
  let [openComment, setOpenComment] = useState(false);
  let [commentText, setCommentText] = useState();
  let [commentsNumber, setCommentsNumber] = useState(commentsNum);
  let [readMoreControl, setReadMoreControl] = useState(false);
  let [savedPost, setSavedPost] = useState(false);

  let [commentsSec, refreshPosts] = useSelector((state) => {
    return [state.commentsSec, state.refreshPosts];
  });
  let dispatch = useDispatch();

  let navigate = useNavigate();

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

  const openCommentsFunc = () => {
    dispatch({
      type: "SET_COMMENTS",
      postIdForComment: id,
      payload: !commentsSec
    });
  }

  const openCommentInput = () => {
    setOpenComment(!openComment);
  }

  const sendCommentFunc = () => {
    const comment = {
      text: commentText,
      dateAdded: new Date().getTime(),
      sender: {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL
      }
    };
    addDoc(collection(database, `allPosts/${id}/allComments`), comment)
      .then((snapshot) => {
        setDoc(doc(database, `users/${owner.uid}/posts/${id}/allComments/${snapshot.id}`), comment)
          .then(() => {
            toast.info('Successfully sended!');
          })
      })
    setCommentText('');
    getCommentsNum();
  }

  const showMoreFunc = () => {
    setReadMoreControl(!readMoreControl);
  }

  const getCommentsNum = async () => {
    getDocs(query(collection(database, `allPosts/${id}/allComments`)))
      .then((snapshot) => {
        setCommentsNumber(snapshot.size);
      })
  }

  const controlMySaved = async () => {
    getDoc(doc(database, `users/${auth.currentUser.uid}/savedPost/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSavedPost(true);
        }
        else {
          setSavedPost(false);
        }
      })
  }

  useEffect(() => {
    const controlMyLikes = async () => {
      getDoc(doc(database, `users/${auth.currentUser.uid}/myLikes/${id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            setChecked(true);
          }
          else {
            setChecked(false);
          }
        })
    }
    controlMySaved();
    controlMyLikes();
    getCommentsNum();
  }, [savedPost, commentsNumber]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const savePost = () => {
    setDoc(doc(database, `users/${auth.currentUser.uid}/savedPost/${id}`), post)
      .then(() => {
        toast.dark('Successfully saved!');
      })
    setAnchorEl(null);
    controlMySaved();
  }

  const deleteSavedPost = () => {
    deleteDoc(doc(database, `users/${auth.currentUser.uid}/savedPost/${id}`))
      .then(() => {
        toast.dark('Successfully deleted my saved posts!');
      })
    setAnchorEl(null);
    controlMySaved();
  }

  const gotoProfileFunc = () => {
    if (auth.currentUser.uid !== owner.uid) {
      navigate(`/profile/${owner.uid}`);
    }
    else {
      navigate('/profile')
    }
    setAnchorEl(null);
  }

  const deletePost = () => {
    getDocs(query(collection(database, `users`)))
      .then((snapshot) => {
        snapshot.forEach((user) => {
          getDoc(doc(database, `users/${user.data().uid}/savedPost/${id}`))
            .then((snapshot2) => {
              if (snapshot2.exists()) {
                deleteDoc(doc(database, `users/${user.data().uid}/savedPost/${id}`))
              }
            })
            .then(() => {
              getDoc(doc(database, `users/${user.data().uid}/myLikes/${id}`))
                .then((snapshot3) => {
                  if (snapshot3.exists()) {
                    deleteDoc(doc(database, `users/${user.data().uid}/myLikes/${id}`))
                  }
                })
            })
        });
      })
    deleteDoc(doc(database, `users/${auth.currentUser.uid}/posts/${id}`))
      .then(() => {
        deleteDoc(doc(database, `allPosts/${id}`))
          .then(() => {
            toast.done('Successfully this post is deleted!');
          })
      })
    setAnchorEl(null);
    dispatch({
      type: "SET_REFRESH",
      payload: !refreshPosts
    });
  }

  return (
    <div className='shadow-sm' style={{ backgroundColor: "#fff", boxSizing: "border-box", padding: "10px", margin: "10px 0", borderRadius: "10px" }}>
      <div className='d-flex' style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className='d-flex' style={{ alignItems: "flex-start" }}>
          <img src={owner.photoURL !== null ? owner.photoURL : defaultProfileImg} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
          <div>
            <small style={{ display: "block" }}><b>{owner.name}</b></small>
            <small style={{ display: "block", fontSize: "10px" }}>{owner.email}</small>
            <small style={{ display: "block", fontSize: "10px" }}><Moment fromNow>{dateAdded}</Moment></small>
          </div>
        </div>
        <IconButton
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {
            savedPost ?
              <MenuItem onClick={deleteSavedPost}><BookmarksIcon /> Delete my saved posts</MenuItem>
              :
              <MenuItem onClick={savePost}><BookmarksIcon /> Save</MenuItem>
          }
          <MenuItem onClick={gotoProfileFunc} className="nav-item">
            <AccountCircleIcon />{`Go to ${owner.name}'s profile`}
          </MenuItem>
          {
            auth.currentUser.uid === owner.uid ?
              <MenuItem onClick={deletePost} className="nav-item">
                <DeleteIcon /> Delete this post
              </MenuItem>
              :
              <></>
          }
        </Menu>
      </div>
      <div className='m-0 py-2' style={{ width: "100%", overflow: "hidden", wordWrap: "break-word" }}>
        <p className='d-inline' style={{ width: "100%" }}>{text.length > 100 ? readMoreControl ? text : `${text.slice(0, 100)}...` : text}</p>
        {
          text.length > 100 ?
            readMoreControl ?
              <button className='d-inline' style={{ background: "transparent", border: "none", padding: "0", margin: "0 5px", fontSize: "11px", color: "grey", cursor: "pointer" }} onClick={showMoreFunc}><b>read less</b></button>
              :
              <button className='d-inline' style={{ background: "transparent", border: "none", padding: "0", margin: "0", fontSize: "11px", color: "grey", cursor: "pointer" }} onClick={showMoreFunc}><b>read more</b></button>
            :
            <></>
        }
      </div>
      {
        img ?
          <div>
            <img src={img.src} alt="" style={{ width: "100%", pointerEvents: "none" }} />
          </div>
          :
          <></>
      }
      <ul className='d-flex' style={{ listStyle: "none", margin: "5px 0", padding: "0" }}>
        <li style={{ marginRight: "10px" }}>
          <i className="fa-brands fa-gratipay" style={{ color: "#0072b1", marginRight: "4px" }}></i>
          <span><b>{likesNum}</b></span>
        </li>
        <li style={{ marginRight: "10px" }}>
          <b style={{ color: "#0072b1" }}>
            <span style={{ marginRight: "4px" }}>{commentsNumber === 0 ? 'No' : commentsNumber}</span>
            <span>{commentsNumber <= 1 ? 'comment' : 'comments'}</span>
          </b>
        </li>
        <li>
          <IconButton onClick={openCommentsFunc}>
            <QuestionAnswerIcon style={{ fontSize: "16px", color: "#0072b1" }} />
          </IconButton>
        </li>
      </ul>
      <hr style={{ margin: "5px 0", padding: "0" }} />
      <div className="d-flex align-items-center">
        <input type="checkbox" disabled={disabled} checked={checked} id={id} style={{ display: "none" }} defaultChecked={checked} onChange={(e) => {
          likeFunc(e.target.checked)
        }} />
        <label htmlFor={id} style={{ margin: "5px 0px 10px 10px", cursor: "pointer", color: checked ? '#0072b1' : 'grey' }}><i className="fa-solid fa-thumbs-up"></i></label>
        <IconButton onClick={openCommentInput}>
          <CommentIcon style={{ fontSize: "18px", color: openComment ? "#0072b1" : "grey" }} />
        </IconButton>
      </div>

      {
        openComment ?
          <div style={{ width: "100%", display: "flex" }}>
            <textarea value={commentText} style={{ width: "92%", height: "70px", resize: "none" }} placeholder='Enter comments...' onChange={(e) => {
              setCommentText(e.target.value);
            }}></textarea>
            <IconButton style={{ width: "40px", alignSelf: "flex-end" }} disabled={commentText ? false : true} onClick={sendCommentFunc}>
              <SendIcon />
            </IconButton>
          </div>
          :
          <></>
      }
      {
        commentsSec ?
          <Comments />
          :
          <></>
      }
    </div>
  )
}

export default Post