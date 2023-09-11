import { IconButton } from '@mui/material'
import React from 'react'
import Moment from 'react-moment'
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc } from 'firebase/firestore';
import database, { auth } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const Message = ({ message }) => {
    const deleteMessageFunc = () => {
        deleteDoc(doc(database, `users/${auth.currentUser.uid}/messages/${message.id}`))
            .then(() => {
                toast.dark('Successfully deleted!');
            })
    }
    return (
        <div className='shadow rounded my-2' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", boxSizing: "border-box", padding: "10px" }}>
            <div className='d-flex'>
                <span style={{ marginRight: "20px" }}>{message.type === 'friendRequest' ? <i className="fa-solid fa-user-group text-primary"></i> : message.type === 'job' ? <i className="fa-solid fa-briefcase text-info"></i> : <i className="fa-solid fa-bell text-danger"></i>}</span>
                <p className='m-0 p-0' id='messageText'>{message.msg}</p>
            </div>
            <div>
                <small className='text-muted'>~<Moment fromNow>{message.dateAdded}</Moment></small>
                <IconButton sx={{ ml: "5px" }} onClick={deleteMessageFunc}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Message