import React, { useEffect, useState } from 'react'
import Moment from 'react-moment';
import database, { auth } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const MyComment = ({ comment }) => {
    const { text, dateAdded, sender } = comment;
    let [ownerUid, setOwnerUid] = useState();

    let postIdForComment = useSelector((state) => {
        return state.postIdForComment;
    });

    useEffect(() => {
        getDoc(doc(database, `allPosts/${postIdForComment}`))
            .then((snapshot) => {
                setOwnerUid(snapshot.data().owner.uid);
            })
    }, []);

    if (ownerUid) {
        if (sender.uid !== ownerUid) {
            return (
                <div className='d-flex mb-3' style={{ alignItems: "flex-start" }}>
                    <img src={sender.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    <div style={{ marginLeft: "10px" }}>
                        <p className='p-0 m-0' style={{ color: sender.uid === auth.currentUser.uid ? '#000' : 'grey', fontSize: "12px" }}>@<b>{sender.name}</b> ~<small><Moment fromNow>{dateAdded}</Moment></small></p>
                        <p className='p-0 m-0 mb-1' style={{ color: "#000", fontSize: "10px" }}><i class="fa-solid fa-envelope"></i> {sender.email}</p>
                        <p className='p-0 px-2 m-0' style={{ background: sender.uid === auth.currentUser.uid ? '#fff' : '#efefef', borderRadius: "10px", borderTopLeftRadius: "0" }}>{text}</p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='d-flex mb-3' style={{ alignItems: "flex-start", justifyContent: "end" }}>
                    <div style={{ marginLeft: "10px" }}>
                        <p className='p-0 m-0' style={{ color: sender.uid === auth.currentUser.uid ? '#000' : 'grey', fontSize: "12px" }}>@<b>{sender.name}</b> ~<small><Moment fromNow>{dateAdded}</Moment></small></p>
                        <p className='p-0 m-0 mb-1' style={{ color: "#000", fontSize: "10px", textAlign: "end" }}><i class="fa-solid fa-envelope"></i> {sender.email}</p>
                        <p className='p-0 px-2 m-0' style={{ background: sender.uid === auth.currentUser.uid ? '#fff' : '#efefef', borderRadius: "10px", borderTopRightRadius: "0" }}>{text}</p>
                    </div>
                    <img src={sender.photoURL} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", marginLeft: "10px" }} />
                </div>
            )
        }
    }
}

export default MyComment