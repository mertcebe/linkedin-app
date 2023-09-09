import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useReducer, useState } from 'react'
import Loading from './Loading';
import database, { auth } from '../firebase/firebaseConfig'
import Moment from 'react-moment';
import { Button, Divider, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import profileImg3 from '../images/profileImg3.jpg';
import { TagsInput } from "react-tag-input-component";
import { jobApplyReducer, setValuesForApply } from './jobReducer/jobApplyReducer';
import DoneIcon from '@mui/icons-material/Done';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';

const Job = ({ id }) => {
  let [post, setPost] = useState();
  let [showMore, setShowMore] = useState(false);
  let [loading, setLoading] = useState(false);
  let [owner, setOwner] = useState();
  let [isApplied, setIsApplied] = useState(false);
  let [hiredUsersForThisJob, setHiredUsersForThisJob] = useState();
  // tags input
  const [selected, setSelected] = useState([]);

  const getHiredUsersForThatJob = (owner) => {
    getDocs(query(collection(database, `users/${owner.uid}/jobPosts/${id}/hiredUsersForThisJob`)))
      .then((snapshot) => {
        let users = [];
        snapshot.forEach((user) => {
          users.push({
            ...user.data(),
            id: user.id
          });
        })
        setHiredUsersForThisJob(users);
      })
  }

  useEffect(() => {
    setLoading(true);
    getDocs(query(collection(database, `users/${auth.currentUser.uid}/myJobApplications`)))
      .then((snapshot) => {
        let appliedJobIds = [];
        snapshot.forEach((job) => {
          appliedJobIds.push(job.data().jobAppliedFor.id);
        })
        if (appliedJobIds.includes(id)) {
          setIsApplied(true);
        }
        else {
          setIsApplied(false);
        }
      })
    getDoc(doc(database, `allJobPosts/${id}`))
      .then((snapshot) => {
        setPost(snapshot.data());
        setLoading(false);
        setOwner(snapshot.data().owner);
        getHiredUsersForThatJob(snapshot.data().owner);
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
    setSelected([]);
    dispatchForApply({
      type: "SET_ALL_NULL"
    })
  }

  let initialState = {
    name: '',
    surname: '',
    age: 0,
    descYourself: '',
    skills: []
  };
  let [state, dispatchForApply] = useReducer(jobApplyReducer, initialState);

  const submitFunc = () => {
    state.skills = selected;
    addDoc(collection(database, `users/${owner.uid}/jobPosts/${id}/jobApplications`), {
      ...state,
      sender: {
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL
      },
      id: id,
      dateSended: new Date().getTime(),
      situation: 'wait'
    })
      .then((snapshot) => {
        setDoc(doc(database, `users/${auth.currentUser.uid}/myJobApplications/${snapshot.id}`), {
          ...state,
          jobAppliedFor: {
            ...post,
            id: id
          },
          dateSended: new Date().getTime(),
          situation: 'wait'
        })
      })
      .then(() => {
        applyForJobFunc();
        toast.dark('Successfully apply for this job');
      })
  };

  // options button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteJobPost = () => {
    setAnchorEl(null);
    deleteDoc(doc(database, `allJobPosts/${id}`));
    deleteDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${id}`))
      .then(() => {
        toast.info('Successfull job posting removed!');
      })
  }

  let navigate = useNavigate();
  if (!post || loading || !hiredUsersForThisJob) {
    return (
      <Loading />
    )
  }
  return (
    <div style={{ padding: "20px 10px", overflow: "auto", height: "650px", position: "relative" }}>
      {
        auth.currentUser.uid === owner.uid ?
          <div style={{ position: "absolute", top: "10px", right: "50px" }}>
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
              <MenuItem onClick={deleteJobPost} className="nav-item">
                <DeleteIcon /> Delete this job post
              </MenuItem>
            </Menu>
          </div>
          :
          <></>
      }
      <IconButton style={{ position: "absolute", top: "10px", right: "10px" }} onClick={() => {
        navigate('/jobs');
      }}>
        <CloseIcon />
      </IconButton>
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
              <div>
                <TextField id="standard-basic" onChange={(e) => {
                  setValuesForApply('name', e.target.value, dispatchForApply)
                }} label="name" variant="standard" sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" onChange={(e) => {
                  setValuesForApply('surname', e.target.value, dispatchForApply)
                }} label="surname" variant="standard" sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" onChange={(e) => {
                  setValuesForApply('age', e.target.value, dispatchForApply)
                }} label="age" variant="standard" type='number' sx={{ width: "100%", my: "5px" }} />
                <TextField id="standard-basic" onChange={(e) => {
                  setValuesForApply('descYourself', e.target.value, dispatchForApply)
                }} label="descripe yourself" variant="standard" sx={{ width: "100%", my: "5px", mb: "20px" }} />
                <p className='my-1'>Skills</p>
                <TagsInput
                  value={selected}
                  onChange={setSelected}
                  name="skills"
                  placeHolder="enter your skills"
                />
                <div className="text-end" style={{ marginTop: "10px" }}>
                  <IconButton onClick={submitFunc} disabled={state.name && state.surname && state.age && state.descYourself ? false : true}>
                    <DoneIcon />
                  </IconButton>
                </div>
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
              <Button sx={{ mr: "10px" }} onClick={applyForJobFunc} disabled={isApplied ? true : false}>{isApplied ? 'Applied' : 'Apply'}<i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: "5px" }}></i></Button>
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

        {/* features */}
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
        <Divider />
        {/* hired users for this job */}
        {
          hiredUsersForThisJob.length !== 0 ?
            <div className='my-3'>
              <small style={{ display: "block", margin: "10px 0", fontSize: "12px" }}><b>Hired users for this job</b></small>
              {
                hiredUsersForThisJob.map((user) => {
                  return (
                    <NavLink to={user.uid === auth.currentUser.uid ? `/profile` : `/profile/${user.uid}`} style={{ margin: "2px" }} title={user.displayName}>
                      <img src={user.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    </NavLink>
                  )
                })
              }
            </div>
            :
            <></>
        }
      </div>
    </div>
  )
}

export default Job