import React, { useEffect } from 'react'
import { auth } from '../firebase/firebaseConfig';

const ProfilePage = () => {
    useEffect(() => {

    }, []);
    return (
        <div>
            <div className='shadow-sm profile' style={{backgroundColor: "#d1dde4", display: "inline-block", padding: "10px", borderRadius: "10px"}}>
                <div className='myProfileImg' style={{ position: "relative", width: "200px" }}>
                    <img src={auth.currentUser.photoURL} alt="" className='profileImgEl' style={{ width: "100%", height: "200px" }} />
                    <div className='updateIcon' style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                        <input type="file" id='profileFileInput' style={{ display: "none" }} />
                        <label htmlFor="profileFileInput" style={{ fontSize: "20px" }}><i className="fa-solid fa-pen-to-square"></i></label>
                    </div>
                </div>
                <div>
                    <p className='my-1 p-0'>{auth.currentUser.displayName}</p>
                    <b>@{auth.currentUser.email}</b>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage