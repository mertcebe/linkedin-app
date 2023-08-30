import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Post from './Post'
import Loading from './Loading';
import { NavLink } from 'react-router-dom';
import Moment from 'react-moment';

const ProfilePage = () => {
    let [posts, setPosts] = useState();
    let [myLikes, setMyLikes] = useState();
    let [commentedPosts, setCommentedPosts] = useState();
    useEffect(() => {
        const getPosts = async () => {
            getDocs(query(collection(database, `users/${auth.currentUser.uid}/posts`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let posts = [];
                    snapshot.forEach((post) => {
                        posts.push({
                            ...post.data(),
                            owner: {
                                name: auth.currentUser.displayName,
                                email: auth.currentUser.email,
                                photoURL: auth.currentUser.photoURL,
                                uid: auth.currentUser.uid
                            },
                            id: post.id
                        });
                    })
                    setPosts(posts);
                })
        }
        const getMyLikes = async () => {
            getDocs(query(collection(database, `users/${auth.currentUser.uid}/myLikes`), orderBy('dateAdded', 'desc')))
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
            getDocs(query(collection(database, `allPosts`)))
                .then((snapshot) => {
                    let ids = [];
                    let commentedPosts = [];
                    snapshot.forEach((post) => {
                        let myPost = {
                            ...post.data(),
                            id: post.id
                        };
                        getDocs(query(collection(database, `allPosts/${post.id}/allComments`)))
                        .then((snapshot) => {
                            snapshot.forEach((post) => {
                                if(post.data().sender.uid === auth.currentUser.uid){
                                    console.log(post.data())
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
        getCommentedPosts()
        getMyLikes();
        getPosts();
    }, []);
    if (!posts || !myLikes || !commentedPosts) {
        return (
            <Loading />
        )
    }
    return (
        <div className='container my-2' id='profilePosts'>
            <div className='profile' style={{marginBottom: "14px", display: "inline-block"}}>
                <div className='shadow-sm' style={{ backgroundColor: "#e3f0f8", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                    <div className='myProfileImg' style={{ position: "relative", width: "200px" }}>
                        <img src={auth.currentUser.photoURL} alt="" className='profileImgEl' style={{ width: "100%", height: "200px" }} />
                    </div>
                    <div>
                        <b>{auth.currentUser.displayName}</b>
                        <p className='my-1 p-0' style={{ fontSize: "14px" }}>@{auth.currentUser.email}</p>
                    </div>
                </div>

                <div className='shadow-sm' style={{backgroundColor: "#e3f0f8", boxSizing: "border-box", padding: "10px", borderRadius: "10px"}}>
                    <small><i>Posts I've commented</i></small>
                    <div style={{width: "200px"}}>
                        {
                            commentedPosts.map((post) => {
                                return <NavLink to={`/`} style={{display: "inline-block", boxSizing: "border-box", padding: "5px 2px", marginBottom: "5px", borderRadius: "10px", width: "100%", fontSize: "12px", textDecoration: "none", color: "#000", backgroundColor: "#fff"}}>
                                    <small>{post.text}</small>
                                    <span>~<Moment fromNow>{post.dateAdded}</Moment></span>
                                </NavLink>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='shadow-sm myPosts' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                <h5>My Posts</h5>
                <div style={{ width: "500px" }}>
                    {
                        posts.map((post) => {
                            return <Post post={post} />
                        })
                    }
                </div>
            </div>
            <div className='shadow-sm myLikes' style={{ backgroundColor: "#e3f0f8", display: "inline-block", padding: "10px", borderRadius: "10px", marginBottom: "14px" }}>
                <h5>My Likes</h5>
                <div style={{ width: "500px" }}>
                    {
                        myLikes.map((post) => {
                            return <Post post={post} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfilePage