import React, { useState } from 'react'
import { auth } from '../firebase/firebaseConfig'
import profileImg3 from '../images/profileImg3.jpg';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Divider, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';

const Posts = () => {
    let [text, setText] = useState();
    let startPost = useSelector((state) => {
        return state.startPost;
    })
    let dispatch = useDispatch();
    const startPostFunc = () => {
        dispatch({
            type: "SET_START_POST",
            payload: !startPost
        });
    }
    const postAPost = () => {

    }
    return (
        <div style={{ boxSizing: "border-box" }}>
            {/* post box */}
            {
                startPost ?
                    <div style={{ position: "absolute", top: "50%", left: "50%", backdropFilter: "brightness(0.5)", width: "100%", height: "100vh", transform: "translate(-50%, -50%)" }}>
                        <div style={{ position: "absolute", top: "40%", left: "50%", background: "#fff", transform: "translate(-50%, -50%)", width: "500px", padding: "10px" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Create a post</b>
                                <IconButton onClick={startPostFunc}>
                                    <HighlightOffIcon />
                                </IconButton>
                            </div>
                            <Divider />
                            <div className='p-2'>
                                <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }} />
                                <small><b>{auth.currentUser.displayName}</b></small>
                                <textarea onChange={(e) => {
                                    setText(e.target.value);
                                }} style={{ width: "100%", minHeight: "140px", border: "none", outline: "none", maxHeight: "200px", margin: "10px 0" }} placeholder='What do you want to talk about?'></textarea>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <input type="file" style={{display: "none"}} id='fileInput1' onChange={(e) => {
                                        console.log(e.target.files[0]);
                                    }} />
                                    <label htmlFor="fileInput1" style={{cursor: "pointer", color: "#0072b1"}}><ImageIcon /></label>
                                    <button>youtube</button>
                                    <button>text</button>
                                </div>
                                <IconButton onClick={postAPost} disabled={text ? false : true} style={{ color: text ? '#0072b1' : 'grey' }}>
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

            {/* start a post */}
            <div style={{ borderRadius: "20px", backgroundColor: "#fff" }}>
                <div className='d-flex align-items-center' style={{ padding: "10px" }}>
                    <img src={auth.currentUser.photoURL ? auth.currentUser.photoURL : profileImg3} alt="" style={{ width: "40px", borderRadius: "50%" }} />
                    <button onClick={startPostFunc} style={{ width: "100%", borderRadius: "40px", background: "transparent", border: "1px solid #dfdfdf", color: "grey", textAlign: "left", padding: "10px 16px" }}><b>Start a post</b></button>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Photo</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Video</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Event</button>
                    <button style={{ background: "transparent", border: "none", width: "20%" }}>Write article</button>
                </div>
            </div>
        </div>
    )
}

export default Posts