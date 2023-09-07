import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import database, { auth } from '../firebase/firebaseConfig';
import profileImg3 from '../images/profileImg3.jpg';
import { Button, Divider, FormControl, FormHelperText, IconButton, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import WorkIcon from '@mui/icons-material/Work';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SendIcon from '@mui/icons-material/Send';
import { jobReducer, setValues } from './jobReducer/JobPostReducer';
import jobBackImg from '../images/jobBackForLinkedin.avif';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Loading from './Loading';
import JobPost from './JobPost';
import { useNavigate } from 'react-router';

const JobPosts = () => {
    let [text, setText] = useState();
    let [jobPosts, setJobPosts] = useState();
    let [control, setControl] = useState(false);

    // experience level and sectors
    let [experienceLevel, setExperienceLevel] = useState('');
    let [sectors, setSectors] = useState('');
    const handleChange = (e) => {
        setExperienceLevel(e.target.value);
    };

    const handleChangeForSectors = (e) => {
        setSectors(e.target.value);
    };

    let startJobPost = useSelector((state) => {
        return state.startJobPost;
    });
    let dispatch = useDispatch();

    let navigate = useNavigate();

    const startJobPostFunc = () => {
        dispatch({
            type: "SET_JOB_POST",
            payload: !startJobPost
        });
        dispatchForJob({
            type: "SET_ALL_NULL"
        })
        setText('');
        setExperienceLevel('');
        setSectors('');
    };

    const postAJobPost = () => {
        addDoc(collection(database, `allJobPosts`), {
            ...stateForJob,
            description: text,
            owner: {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                uid: auth.currentUser.uid,
                photoURL: auth.currentUser.photoURL
            },
            experienceLevel: experienceLevel,
            sectors: sectors,
            dateAdded: new Date().getTime()
        })
            .then((snapshot) => {
                setDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${snapshot.id}`), {
                    ...stateForJob,
                    description: text,
                    experienceLevel: experienceLevel,
                    sectors: sectors,
                    dateAdded: new Date().getTime()
                })
                    .then(() => {
                        toast.success('Successfully created a job post!');
                        startJobPostFunc();
                        setControl(!control);
                        setExperienceLevel('');
                        setSectors('');
                    })
            })
    }

    let initialState = {
        company: '',
        salary: 0,
        location: '',
        job: '',
        experienceLevel: '',
        lastDate: ''
    };
    let [stateForJob, dispatchForJob] = useReducer(jobReducer, initialState);

    useEffect(() => {
        getDocs(query(collection(database, `allJobPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let posts = [];
                snapshot.forEach((post) => {
                    posts.push({
                        ...post.data(),
                        id: post.id
                    });
                })
                setJobPosts(posts);
            })
    }, [control]);

    if (!jobPosts) {
        return (
            <Loading />
        )
    }
    return (
        <div>
            {
                startJobPost ?
                    <div style={{ position: "fixed", top: "50%", left: "50%", backdropFilter: "brightness(0.5)", width: "100%", height: "100vh", transform: "translate(-50%, -50%)", zIndex: "100" }}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", background: `url(${jobBackImg}) no-repeat`, backgroundSize: "cover", transform: "translate(-50%, -50%)", width: "900px", borderRadius: "5px", padding: "20px" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Create a job post</b>
                                <IconButton onClick={startJobPostFunc}>
                                    <HighlightOffIcon />
                                </IconButton>
                            </div>
                            <div className='p-2'>
                                <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
                                <small><b>{auth.currentUser.displayName}</b></small>
                                <textarea onChange={(e) => {
                                    setText(e.target.value);
                                }} style={{ width: "100%", minHeight: "80px", border: "none", outline: "none", maxHeight: "80px", marginTop: "10px", background: "transparent" }} placeholder='Why should I choose you?'></textarea>
                            </div>

                            <div className='my-2'>
                                <label htmlFor="jobInput1" style={{ width: "20%" }}>Company</label>
                                <input type="text" id='jobInput1' onChange={(e) => {
                                    setValues('company', e.target.value, dispatchForJob);
                                }} style={{ width: "75%", border: "none", background: "transparent", borderBottom: "1px solid #000", outline: "none" }} />
                            </div>

                            <div className='my-2'>
                                <label htmlFor="jobInput2" style={{ width: "20%" }}>Salary</label>
                                <input type="text" id='jobInput2' onChange={(e) => {
                                    setValues('salary', e.target.value, dispatchForJob);
                                }} style={{ width: "75%", border: "none", background: "transparent", borderBottom: "1px solid #000", outline: "none" }} />
                            </div>

                            <div className='my-2'>
                                <label htmlFor="jobInput3" style={{ width: "20%" }}>Location</label>
                                <input type="text" id='jobInput3' onChange={(e) => {
                                    setValues('location', e.target.value, dispatchForJob);
                                }} style={{ width: "75%", border: "none", background: "transparent", borderBottom: "1px solid #000", outline: "none" }} />
                            </div>

                            <div className='my-2'>
                                <label htmlFor="jobInput4" style={{ width: "20%" }}>Job</label>
                                <input type="text" id='jobInput4' onChange={(e) => {
                                    setValues('job', e.target.value, dispatchForJob);
                                }} style={{ width: "75%", border: "none", background: "transparent", borderBottom: "1px solid #000", outline: "none" }} />
                            </div>

                            <FormControl sx={{ my: 1, minWidth: 40, display: "flex", flexDirection: "row" }}>
                                <label htmlFor="jobInput5" style={{ width: "20%" }}>Experience level</label>
                                <Select
                                    value={experienceLevel}
                                    id='jobInput5'
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    sx={{ height: "40px" }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'beginner'}>Beginner</MenuItem>
                                    <MenuItem value={'intern'}>Intern</MenuItem>
                                    <MenuItem value={'intermediate'}>Intermediate</MenuItem>
                                    <MenuItem value={'expert'}>Expert</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ my: 1, minWidth: 40, display: "flex", flexDirection: "row" }}>
                                <label htmlFor="jobInput6" style={{ width: "20%" }}>Sectors</label>
                                <Select
                                    value={sectors}
                                    id='jobInput6'
                                    onChange={handleChangeForSectors}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    sx={{ height: "40px" }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Healty'}>Healty</MenuItem>
                                    <MenuItem value={'Restaurant'}>Restaurant</MenuItem>
                                    <MenuItem value={'Technology, Information and Internet'}>Technology, Information and Internet</MenuItem>
                                    <MenuItem value={'Software'}>Software</MenuItem>
                                    <MenuItem value={'Internet Broadcasting'}>Internet Broadcasting</MenuItem>
                                    <MenuItem value={'Real estate'}>Real estate</MenuItem>
                                    <MenuItem value={'Advertising Services'}>Advertising Services</MenuItem>
                                    <MenuItem value={'High education'}>High education</MenuItem>
                                    <MenuItem value={'Design'}>Design</MenuItem>
                                    <MenuItem value={'Others'}>Others</MenuItem>
                                </Select>
                            </FormControl>

                            <div className='my-2'>
                                <label htmlFor="jobInput5" style={{ width: "20%" }}>Last date</label>
                                <input type="date" id='jobInput5' onChange={(e) => {
                                    setValues('lastDate', e.target.value, dispatchForJob);
                                }} style={{ width: "75%", border: "none", background: "transparent", borderBottom: "1px solid #000", outline: "none" }} />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">

                                <IconButton onClick={postAJobPost} disabled={text ? false : true} style={{ color: text ? '#0072b1' : 'grey' }}>
                                    <AddTaskIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

            {/* startAJob */}
            <div className='shadow-sm startAJob' style={{ borderRadius: "20px", backgroundColor: "#fff", margin: "10px 0" }}>
                <div className='d-flex align-items-center' style={{ padding: "10px" }}>
                    <IconButton onClick={startJobPostFunc} style={{ background: 'transparent', color: "#6ba7ba" }}>
                        <WorkIcon />
                    </IconButton>
                    <p className='p-0 m-0' style={{ color: "#717171", fontFamily: "serif", pointerEvents: "none" }}>Start a job post!</p>
                </div>
            </div>

            {/* job posts */}
            <div className='bg-light p-2 shadow-sm rounded'>
                {
                    jobPosts.slice(0, 4).map((post) => {
                        return (
                            <JobPost post={post} type={'small'} key={post.id} />
                        )
                    })
                }
                <Button onClick={() => {
                    navigate('/jobs')
                }} style={{ fontSize: "9px" }}>Show All</Button>
            </div>
        </div>
    )
}

export default JobPosts