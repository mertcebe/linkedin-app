import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Loading from './Loading';
import database, { auth } from '../firebase/firebaseConfig'
import Moment from 'react-moment';
import { Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import profileImg3 from '../images/profileImg3.jpg';
import { TagsInput } from "react-tag-input-component";

const Job = ({ id }) => {
  let [post, setPost] = useState();
  let [showMore, setShowMore] = useState(false);
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getDoc(doc(database, `allJobPosts/${id}`))
      .then((snapshot) => {
        setPost(snapshot.data());
        setLoading(false);
      })
    setShowMore(false);
  }, [id]);

  const applyForJob = useSelector((state) => {
    return state.applyForJob;
  });

  let dispatch = useDispatch();

  const applyForJobFunc = () => {
    dispatch({
      type: "SET_APPLY_A_JOB",
      payload: !applyForJob
    });
  }

  // tags input
  const [selected, setSelected] = useState([]);


  if (!post || loading) {
    return (
      <Loading />
    )
  }
  return (
    <div style={{ padding: "20px 10px", overflow: "auto", height: "650px" }}>
      {/* applyForJob */}
      {
        applyForJob ?
          <div style={{ position: "fixed", top: "50%", left: "50%", backdropFilter: "brightness(0.5)", width: "100%", height: "100vh", transform: "translate(-50%, -50%)", zIndex: "100" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", background: "#fff", transform: "translate(-50%, -50%)", width: "500px", padding: "20px" }}>
              <div className="d-flex justify-content-between align-items-center">
                <b>Apply for a job</b>
                <IconButton onClick={applyForJobFunc}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
              <Divider />
              <div className='p-2'>
                <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
                <small><b>{auth.currentUser.displayName}</b></small>
              </div>
              <div className='my-3'>
                <TextField id="standard-basic" label="name" variant="standard" sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" label="surname" variant="standard" sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" label="age" variant="standard" type='number' sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" label="descripe yourself" variant="standard" sx={{ width: "100%", my: "5px", mb: "20px" }} />
                <p className='my-1'>Skills</p>
                <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="skills"
                  placeHolder="enter your skills"
                />
              </div>
            </div>
          </div>
          :
          <></>
      }
      <img src={post.owner.photoURL} alt="" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
      <div>
        <h4 className='my-2'>{post.job}</h4>
        <p className='my-1'><span style={{ color: "#000" }}>{post.company}</span> - <span style={{ color: "gray" }}>{post.location}</span></p>
        <p className='text-muted' style={{ fontSize: "12px" }}><Moment fromNow>{post.dateAdded}</Moment></p>
        {
          auth.currentUser.uid !== post.owner.uid ?
            <div className='d-flex'>
              <Button sx={{ mr: "10px" }} onClick={applyForJobFunc}>Apply<i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: "5px" }}></i></Button>
              <Button>Save</Button>
            </div>
            :
            <></>
        }
        <Divider sx={{ my: "10px" }} />
        <div>
          <div style={{ position: "relative" }}>
            <p style={{ background: "", overflow: "hidden" }}>
              {showMore ? post.description : `${post.description.slice(0, 170)}...`}
            </p>
          </div>
          {
            post.description.length > 170 ?
              <button onClick={(() => {
                setShowMore(!showMore);
              })} style={{ display: "block", margin: "10px 0", background: "transparent", border: '1px solid #000', padding: "5px 24px", borderRadius: "30px" }}>Show {showMore ? 'less' : 'more'} <i className={`fa-solid fa-angle-${showMore ? 'up' : 'down'}`}></i>
              </button>
              :
              <></>
          }
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ width: "40%", boxSizing: "border-box", padding: "10px" }}>
            <small className='d-block text-muted'>Experience level</small>
            <small style={{ fontSize: "16px" }}><b>{post.experienceLevel}</b></small>
          </div>
          <div style={{ width: "40%", boxSizing: "border-box", padding: "10px" }}>
            <small className='d-block text-muted'>Sectors</small>
            <small style={{ fontSize: "16px" }}><b>{post.sectors ? post.sectors : 'General'}</b></small>
          </div>
          <div style={{ width: "40%", boxSizing: "border-box", padding: "10px" }}>
            <small className='d-block text-muted'>Salary</small>
            <small style={{ fontSize: "16px" }}><b>{post.salary}</b></small>
          </div>
          <div style={{ width: "40%", boxSizing: "border-box", padding: "10px" }}>
            <small className='d-block text-muted'>Application deadline</small>
            <small style={{ fontSize: "16px" }}><b>Hiring will end <Moment fromNow>{post.lastDate}</Moment></b></small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job