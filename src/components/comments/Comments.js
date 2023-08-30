import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDispatch, useSelector } from 'react-redux';
import MyComment from './MyComment';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import database from '../../firebase/firebaseConfig'
import Loading from '../Loading';

const Comments = () => {
    let [comments, setComments] = useState();
    let commentsSec = useSelector((state) => {
        return state.commentsSec;
    });
    let postIdForComment = useSelector((state) => {
        return state.postIdForComment;
    });
    let dispatch = useDispatch();
    const setCommentFunc = () => {
        dispatch({
            type: "SET_COMMENTS",
            payload: !commentsSec
        });
    }

    useEffect(() => {
        const getComments = async () => {
            getDocs(query(collection(database, `allPosts/${postIdForComment}/allComments`), orderBy('dateAdded', 'asc')))
                .then((snapshot) => {
                    let comments = [];
                    snapshot.forEach((comment) => {
                        comments.push(comment.data());
                    })
                    setComments(comments);
                })
        }
        getComments();
    }, []);

    if (!comments) {
        return (
            <></>
        )
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
                <div className='commentsMade'>
                    {
                        comments.length === 0 ?
                            <small><i>No comments</i></small>
                        :
                            <>
                                {
                                    comments.map((comment) => {
                                        return <MyComment comment={comment} />
                                    })
                                }
                            </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Comments