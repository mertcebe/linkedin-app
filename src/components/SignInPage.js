import React, { useState } from 'react'
import backImg from '../images/linkedin-back.svg';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import database, { auth } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import SignUpPage from './SignUpPage';
import { useSelector } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';


export const setUserToFirebase = async (user) => {
    console.log(user);
    await setDoc(doc(database, `users/${user.uid}`), {
        name: user.displayName,
        uid: user.uid,
        email: user.email
    })
}

const SignInPage = () => {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();

    let signUpCollapsed = useSelector((state) => {
        return state.signUpCollapsed;
    })

    let navigate = useNavigate();
    const signInWithGoogle = () => {
        let provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider)
            .then(() => {
                toast.success('Successfully sign in!')
            })
    }
    const submitFunc = (e) => {
        e.preventDefault();
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredentials) => {
                    setUserToFirebase(userCredentials.user)
                    toast.success(`${userCredentials.user.displayName}, welcome!`);
                })
                .catch((error) => {
                    let msg =  error.code.split('/')[1].split('-').join(' ');
                    toast.error(msg);
                })
        }
        else if (!email) {
            toast.dark('Enter an email!');
        }
        else if (!password) {
            toast.dark('Enter a password!');
        }
    }
    return (
        <>
            {
                signUpCollapsed?
                <></>
                :
                <SignUpPage />
            }
            <div className='d-flex justify-content-between' style={{ width: "100%", height: "92vh" }}>
                <div style={{ width: "50%", boxSizing: "border-box", padding: "100px" }}>
                    <p className='' style={{ width: "500px", fontSize: "50px", fontFamily: "serif", color: "#0072b1", marginBottom: "40px" }}>Welcome to your professional community</p>
                    <form onSubmit={submitFunc}>
                        <div className="form-group mb-2">
                            <label for="exampleInputEmail1" style={{ fontSize: "12px" }}>Email address</label>
                            <input type="email" className="form-control" onChange={(e) => {
                                setEmail(e.target.value);
                            }} id="exampleInputEmail1" placeholder="Enter email" />
                        </div>
                        <div className="form-group mb-4">
                            <label for="exampleInputPassword1" style={{ fontSize: "12px" }}>Password</label>
                            <input type="password" className="form-control" onChange={(e) => {
                                setPassword(e.target.value);
                            }} id="exampleInputPassword1" placeholder="Password" />
                        </div>
                        <button type='submit' style={{ width: "100%", padding: "10px 0", background: "#fff", borderRadius: "30px", border: "1px solid #0072b1", color: "#0072b1" }}>Sign in</button>
                        <div style={{ position: "relative", margin: "30px 0", padding: "0 20px" }}>
                            <hr />
                            <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#eff3f5", padding: "0 10px", zIndex: "10" }}>or</span>
                        </div>
                    </form>
                    <button onClick={signInWithGoogle} style={{ width: "100%", padding: "10px 0", background: "#fff", borderRadius: "30px", border: "1px solid #0072b1", color: "#0072b1" }}><i className="fa-brands fa-google"></i> Sign in with Google</button>
                </div>
                <div style={{ alignSelf: "end" }}>
                    <img src={backImg} alt="" style={{ width: "700px", pointerEvents: "none" }} />
                </div>
            </div>
        </>
    )
}

export default SignInPage