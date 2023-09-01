import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { setUserToFirebase } from './SignInPage';
import ImageIcon from '@mui/icons-material/Image';
import { UploadImgToStorage } from './uploadImgToStorage/UploadImgToStorage';

const SignUpPage = () => {
    let [name, setName] = useState();
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    let [file, setFile] = useState();

    let signUpCollapsed = useSelector((state) => {
        return state.signUpCollapsed;
    })
    let dispatch = useDispatch();

    const signUpFunc = (e) => {
        e.preventDefault();
        if (name && email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredentials) => {
                    await UploadImgToStorage(file, auth.currentUser.uid)
                        .then((snapshot) => {
                            updateProfile(userCredentials.user, {
                                displayName: name,
                                photoURL: snapshot.src
                            })
                            setUserToFirebase(userCredentials.user);
                        })
                })
                .then(() => {
                    toast.success(`Signed up, welcome ${name}`)
                    dispatch({
                        type: "SET_SIGNUP",
                        payload: !signUpCollapsed
                    })
                })
                .catch((error) => {
                    let code = error.code.split('/')[1];
                    let msg = code.split('-').join(' ');
                    toast.dark(msg);
                })
        }
    }

    return (
        <div id='signUpPage'
            style={{
                width: "100%",
                height: "100vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "100",
                backdropFilter: "brightness(0.6)"
            }}>
            <div onClick={() => {
                dispatch({
                    type: "SET_SIGNUP",
                    payload: !signUpCollapsed
                })
            }} style={{ position: "absolute", top: "10px", right: "10px", background: "transparent", color: "#fff", cursor: "pointer", fontSize: "24px" }}><i className="fa-regular fa-circle-xmark"></i></div>
            <div className='shadow-lg'
                style={{
                    width: "500px",
                    borderRadius: "10px",
                    boxSizing: "border-box",
                    padding: "20px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff"
                }}>
                <h4 style={{ textAlign: "center", fontFamily: "serif" }}>Sign up</h4>
                <form onSubmit={signUpFunc}>
                    <div class="form-group mb-2">
                        <label for="exampleInputName1" style={{ fontSize: "12px" }}>Full name</label>
                        <input type="text" class="form-control" onChange={(e) => {
                            setName(e.target.value);
                        }} id="exampleInputName1" placeholder="Full name" />
                    </div>
                    <div class="form-group mb-2">
                        <label for="exampleInputEmail1" style={{ fontSize: "12px" }}>Email address</label>
                        <input type="email" class="form-control" onChange={(e) => {
                            setEmail(e.target.value);
                        }} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div class="form-group mb-4">
                        <label for="exampleInputPassword1" style={{ fontSize: "12px" }}>Password</label>
                        <input type="password" class="form-control" onChange={(e) => {
                            setPassword(e.target.value);
                        }} id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <div style={{ margin: "10px 0" }}>
                        <input type="file" id='profileImgInput' onChange={(e) => {
                            setFile({
                                name: e.target.files[0].name,
                                type: e.target.files[0].type,
                                self: e.target.files[0]
                            });
                        }} style={{ display: "none" }} />
                        <label htmlFor="profileImgInput" style={{ cursor: "pointer", color: "#0072b1" }}><ImageIcon /> <small>Add an avatar</small></label>
                    </div>
                    <button type='submit' style={{ width: "100%", padding: "10px 0", background: "#fff", borderRadius: "30px", border: "1px solid #0072b1", color: "#0072b1" }}>Sign up</button>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage