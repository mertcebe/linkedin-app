import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig'
import profileImg3 from '../images/profileImg3.jpg';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Divider, Icon, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import Post from './Post';
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Loading from './Loading';
import { UploadImgToStorage } from './uploadImgToStorage/UploadImgToStorage';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ReactPlayer from 'react-player'

const Posts = () => {
    let [text, setText] = useState();
    let [selectedImg, setSelectedImg] = useState();
    let [posts, setPosts] = useState();
    let [loading, setLoading] = useState(false);
    let [file, setFile] = useState();
    let [linkInput, setLinkInput] = useState(false);
    let [videoLink, setVideoLink] = useState(false);

    let [startPost, toHomePost, refreshPosts] = useSelector((state) => {
        return [state.startPost, state.toHomePost, state.refreshPosts];
    })

    const getPosts = async () => {
        await getDocs(query(collection(database, `allPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let allPosts = [];
                snapshot.forEach((post) => {
                    allPosts.push({
                        ...post.data(),
                        id: post.id
                    });
                });
                setPosts(allPosts);
            })
    }

    useEffect(() => {
        getPosts();
    }, [refreshPosts]);


    let dispatch = useDispatch();

    const startPostFunc = () => {
        dispatch({
            type: "SET_START_POST",
            payload: !startPost
        });
        setSelectedImg(null);
        setLinkInput(false);
        setVideoLink(null)
    }

    const postAPost = async () => {
        setLoading(true);
        startPostFunc();
        await UploadImgToStorage(file, auth.currentUser.uid)
            .then(async (snapshot) => {
                let post = {
                    text: text,
                    likes: 0,
                    img: await snapshot,
                    dateAdded: new Date().getTime()
                };
                addDoc(collection(database, `users/${auth.currentUser.uid}/posts`), post)
                    .then((snapshot) => {
                        setDoc(doc(database, `allPosts/${snapshot.id}`), {
                            ...post,
                            owner: {
                                name: auth.currentUser.displayName,
                                email: auth.currentUser.email,
                                photoURL: auth.currentUser.photoURL,
                                uid: auth.currentUser.uid
                            }
                        });
                    })
                    .then(() => {
                        getPosts()
                            .then(() => {
                                setLoading(false);
                                toast.dark('Successfully created a post!');
                            })
                    })
            })
    }

    if (!posts) {
        return (
            <h5>loading...</h5>
        )
    }
    return (
        <div style={{ boxSizing: "border-box" }}>
            {/* create a post */}
            {
                startPost ?
                    <div style={{ position: "fixed", top: "50%", left: "50%", backdropFilter: "brightness(0.5)", width: "100%", height: "100vh", transform: "translate(-50%, -50%)", zIndex: "100" }}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", background: "#fff", transform: "translate(-50%, -50%)", width: "500px", padding: "10px" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Create a post</b>
                                <IconButton onClick={startPostFunc}>
                                    <HighlightOffIcon />
                                </IconButton>
                            </div>
                            <Divider />
                            <div className='p-2'>
                                <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
                                <small><b>{auth.currentUser.displayName}</b></small>
                                <textarea onChange={(e) => {
                                    setText(e.target.value);
                                }} style={{ width: "100%", minHeight: "120px", border: "none", outline: "none", maxHeight: "200px", margin: "10px 0" }} placeholder='What do you want to talk about?'></textarea>
                            </div>
                            <div>
                                {
                                    selectedImg !== null ?
                                        <>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <p><i style={{ color: "grey" }}>{selectedImg.name}</i></p>
                                                <IconButton onClick={() => {
                                                    setSelectedImg(null);
                                                    document.getElementById("fileInput1").value = '';
                                                }}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </div>
                                            <img src={selectedImg.src} alt="" style={{ width: "100%", height: "300px", borderRadius: "10px", marginBottom: "10px" }} />
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    linkInput ?
                                        <div style={{ textAlign: "center", margin: "5px 0" }}>
                                            <input type="text" style={{ width: "96%", border: "1px solid #000" }} onChange={(e) => {
                                                setVideoLink(e.target.value);
                                            }} placeholder='Enter a video link' />
                                            {
                                                videoLink ?
                                                    <ReactPlayer controls width={'100%'} height={'300px'} style={{ boxSizing: "border-box", padding: "20px" }} url={videoLink} />
                                                    :
                                                    <></>
                                            }
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <input type="file" style={{ display: "none" }} id='fileInput1' onChange={(e) => {
                                        let src = URL.createObjectURL(e.target.files[0]);
                                        let myFile = e.target.files[0];
                                        setSelectedImg({
                                            src: src,
                                            name: myFile.name
                                        });
                                        setFile({
                                            name: myFile.name,
                                            type: myFile.type,
                                            self: myFile
                                        })
                                    }} />
                                    <label htmlFor="fileInput1" style={{ cursor: "pointer", color: "grey" }}><ImageIcon /></label>
                                    <IconButton onClick={() => {
                                        setLinkInput(!linkInput);
                                    }}>
                                        <YouTubeIcon />
                                    </IconButton>
                                </div>
                                <IconButton onClick={postAPost} disabled={text || selectedImg ? false : true} style={{ color: text || selectedImg ? '#0072b1' : 'grey' }}>
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

            {/* start a post */}
            <div className='shadow-sm startAPost' style={{ borderRadius: "20px", backgroundColor: "#fff", margin: "10px 0" }}>
                <div className='d-flex align-items-center' style={{ padding: "10px" }}>
                    <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} />
                    <button onClick={startPostFunc} style={{ width: "100%", borderRadius: "40px", background: toHomePost ? '#6ba7ba' : 'transparent', border: "1px solid #dfdfdf", color: toHomePost ? "#fff" : "grey", textAlign: "left", padding: "10px 16px", transition: "all 0.3s ease" }}><b>Start a post</b></button>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Photo</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Video</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Event</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Write article</button>
                </div>
            </div>

            {/* posts */}
            <div>
                {
                    loading ?
                        <Loading />
                        :
                        <></>
                }
                {
                    posts ?
                        <>
                            {
                                posts.map((post) => {
                                    return <Post post={post} key={post.id} />
                                })
                            }
                        </>
                        :
                        <small><i>No post</i></small>
                }
            </div>
        </div>
    )
}

export default Posts