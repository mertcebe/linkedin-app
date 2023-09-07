import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Post from './Post'
import Loading from './Loading';
import { NavLink, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import { Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import JobPost from './JobPost';
import WorkIcon from '@mui/icons-material/Work';

const ProfilePage = ({ user = auth.currentUser }) => {
    let [posts, setPosts] = useState();
    let [myLikes, setMyLikes] = useState();
    let [commentedPosts, setCommentedPosts] = useState();
    let [commentedPostsNum, setCommentedPostsNum] = useState(4);
    let [savedPosts, setSavedPosts] = useState();
    let [savedPostsNum, setSavedPostsNum] = useState(2);
    let [jobPosts, setJobPosts] = useState();
    let navigate = useNavigate();
    useEffect(() => {
        const getPosts = async () => {
            getDocs(query(collection(database, `users/${user.uid}/posts`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let posts = [];
                    snapshot.forEach((post) => {
                        posts.push({
                            ...post.data(),
                            owner: {
                                name: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                uid: user.uid
                            },
                            id: post.id
                        });
                    })
                    setPosts(posts);
                })
        }
        const getMyLikes = async () => {
            getDocs(query(collection(database, `users/${user.uid}/myLikes`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let posts = [];
                    snapshot.forEach((post) => {
                        posts.push({
                            ...post.data(),
                            id: post.id
                        });
                    })
                    setMyLikes(posts);
                })
        }
        const getCommentedPosts = async () => {
            getDocs(query(collection(database, `allPosts`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let commentedPosts = [];
                    snapshot.forEach(async (post) => {
                        let myPost = {
                            ...post.data(),
                            id: post.id
                        };
                        await getDocs(query(collection(database, `allPosts/${post.id}/allComments`)))
                            .then((snapshot) => {
                                snapshot.forEach((post) => {
                                    if (post.data().sender.uid === user.uid) {
                                        commentedPosts.push({
                                            ...post.data(),
                                            id: post.id,
                                            toPost: {
                                                ...myPost
                                            }
                                        });
                                    }
                                })
                            })
                    })
                    setCommentedPosts(commentedPosts);
                })
        }
        const getSavedPosts = async () => {
            getDocs(query(collection(database, `users/${user.uid}/savedPost`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let posts = [];
                    snapshot.forEach((post) => {
                        posts.push({
                            ...post.data()
                        });
                    })
                    setSavedPosts(posts);
                })
        }
        const getJobPosts = async () => {
            getDocs(query(collection(database, `users/${user.uid}/jobPosts`), orderBy('dateAdded', 'desc')))
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
        }
        getJobPosts();
        getSavedPosts();
        getCommentedPosts()
        getMyLikes();
        getPosts();
    }, [user]);


    let dispatch = useDispatch();
    const toHomeFunc = () => {
        navigate('/home');
        dispatch({
            type: "SET_BACK_COLOR",
            payload: true,
        })
        setTimeout(() => {
            dispatch({
                type: "SET_BACK_COLOR",
                payload: false,
            })
        }, 2000);
    }

    if (!posts || !myLikes || !commentedPosts) {
        return (
            <Loading />
        )
    }
    return (
        <div className='container my-2' id='profilePosts'>
            <div className='profile' style={{ marginBottom: "14px", display: "inline-block" }}>
                <div className='shadow-sm' style={{ backgroundColor: "#e3f0f8", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                    <div className='myProfileImg' style={{ position: "relative", width: "300px" }}>
                        <img src={user.photoURL} alt="" className='profileImgEl' style={{ width: "100%", height: "300px" }} />
                    </div>
                    <div>
                        <b>{user.displayName}</b>
                        <p className='my-1 p-0' style={{ fontSize: "14px" }}>@{user.email}</p>
                    </div>
                </div>

                {/* commented posts */}
                {
                    user.uid === auth.currentUser.uid ?
                        <div className='shadow-sm' style={{ backgroundColor: "#e3f0f8", boxSizing: "border-box", padding: "10px", borderRadius: "10px" }}>
                            <small style={{ display: "inline-block", marginBottom: "10px" }}><RateReviewIcon style={{ fontSize: "20px" }} /><i>Posts I've commented</i></small>
                            <div className='commentedPosts'>
                                {
                                    commentedPosts.length === 0 ?
                                        <small><i>No comments</i></small>
                                        :
                                        <>
                                            {
                                                commentedPostsNum === 'all' ?
                                                    <>
                                                        {
                                                            commentedPosts.map((post) => {
                                                                return (
                                                                    <NavLink to={`/home/${post.toPost.id}`} style={{ display: "inline-block", boxSizing: "border-box", padding: "5px 2px", marginBottom: "5px", borderRadius: "10px", width: "300px", fontSize: "12px", textDecoration: "none", color: "#000", backgroundColor: "#fff" }}>
                                                                        <small>{post.text}</small>
                                                                        <img src={post.toPost.img.src} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", margin: "0 5px" }} />
                                                                        <span className='text-muted'>~<Moment fromNow>{post.dateAdded}</Moment></span>
                                                                    </NavLink>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            commentedPosts.slice(0, commentedPostsNum).map((post) => {
                                                                return (
                                                                    <NavLink to={`/home/${post.toPost.id}`} style={{ display: "inline-block", boxSizing: "border-box", padding: "5px 2px", marginBottom: "5px", borderRadius: "10px", width: "300px", fontSize: "12px", textDecoration: "none", color: "#000", backgroundColor: "#fff" }}>
                                                                        <small>{post.text}</small>
                                                                        <img src={post.toPost.img.src} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", margin: "0 5px" }} />
                                                                        <span className='text-muted'>~<Moment fromNow>{post.dateAdded}</Moment></span>
                                                                    </NavLink>
                                                                )
                                                            })
                                                        }
                                                    </>
                                            }
                                        </>
                                }
                                {
                                    commentedPostsNum === 'all' ?
                                        <></>
                                        :
                                        <Button style={{ color: "#000", fontSize: "9px" }} onClick={() => {
                                            setCommentedPostsNum('all');
                                        }}>
                                            Show all
                                        </Button>
                                }
                            </div>
                        </div>
                        :
                        <></>
                }

                {/* saved posts */}
                {
                    user.uid === auth.currentUser.uid ?
                        <div className='shadow-sm savedPosts my-3' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                            <h5><BookmarkIcon /> Saved posts</h5>
                            <div className='eachSavedPost' style={{ width: "300px" }}>
                                {
                                    savedPosts.length === 0 ?
                                        <small className='text-muted'><i>No my saved post</i></small>
                                        :
                                        <>
                                            {
                                                savedPostsNum === 'all' ?
                                                    <>
                                                        {
                                                            savedPosts.map((post) => {
                                                                return <Post post={post} />
                                                            })
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            savedPosts.slice(0, savedPostsNum).map((post) => {
                                                                return <Post post={post} />
                                                            })
                                                        }
                                                    </>
                                            }
                                        </>
                                }
                                {
                                    savedPostsNum === 'all' ?
                                        <></>
                                        :
                                        <Button style={{ color: "#000", fontSize: "9px" }} onClick={() => {
                                            setSavedPostsNum('all');
                                        }}>
                                            Show all
                                        </Button>
                                }
                            </div>
                        </div>
                        :
                        <></>
                }
            </div>

            {/* my posts */}
            <div className='shadow-sm myPosts' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                <h5><AllInboxIcon /> {user.uid === auth.currentUser.uid ? 'My' : 'User'} Posts</h5>
                <div className='eachPosts'>
                    {
                        posts.length === 0 ?
                            <div>
                                <small className='text-muted'><i>No posts</i></small>
                                <IconButton onClick={toHomeFunc}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>
                            :
                            <>
                                {
                                    posts.map((post) => {
                                        return <Post post={post} />
                                    })
                                }
                            </>
                    }
                </div>
            </div>

            {/* my likes */}
            <div className='shadow-sm myLikes' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                <h5><ThumbUpAltIcon /> {user.uid === auth.currentUser.uid ? 'My' : 'User'} Likes</h5>
                <div className='eachPosts'>
                    {
                        myLikes.length === 0 ?
                            <small className='text-muted'><i>No my likes</i></small>
                            :
                            <>
                                {
                                    myLikes.map((post) => {
                                        return <Post post={post} />
                                    })
                                }
                            </>
                    }
                </div>
            </div>

            {/* job posts */}
            <div className='shadow-sm myJobPosts' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                <h5><WorkIcon /> {user.uid === auth.currentUser.uid ? 'My' : 'User'} Job Posts</h5>
                <div className='eachPosts'>
                    {
                        jobPosts.length === 0 ?
                            <div>
                                <small className='text-muted'><i>No posts</i></small>
                            </div>
                            :
                            <>
                                {
                                    jobPosts.map((post) => {
                                        return <JobPost user={user} type={'small'} post={post} />
                                    })
                                }
                            </>
                    }
                    <Button onClick={() => {
                        navigate('/jobs')
                    }} style={{ fontSize: "9px" }}>Show All Job Posts</Button>
                </div>
            </div>

        </div>
    )
}

export default ProfilePage