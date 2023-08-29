import { IconButton } from '@mui/material';
import React, { useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';

const Comments = () => {
    let commentsSec = useSelector((state) => {
        return state.commentsSec;
    });
    let dispatch = useDispatch();
    const setCommentFunc = () => {
        dispatch({
            type: "SET_COMMENTS",
            payload: !commentsSec
        });
    }

    return (
        <div style={{ position: "fixed", top: "50%", left: "50%", backdropFilter: "brightness(0.8)", width: "100%", height: "100vh", transform: "translate(-50%, -50%)", zIndex: "100" }}>
            <div id='commentsSec' style={{ position: "absolute", top: "50%", left: "50%", background: "#fff", transform: "translate(-50%, -50%)", width: "500px", padding: "10px" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <b>Comments</b>
                    <IconButton onClick={setCommentFunc}>
                        <HighlightOffIcon />
                    </IconButton>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}

export default Comments