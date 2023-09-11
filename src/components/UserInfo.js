import { Divider, IconButton } from '@mui/material'
import React from 'react'
import JobPost from './JobPost'
import database, { auth } from '../firebase/firebaseConfig'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Moment from 'react-moment'
import { sendMessage } from './messages/SendMessageActions'

const UserInfo = ({ jobApplication, type }) => {
    const hirePersonFunc = (jobApplication) => {
        setDoc(doc(database, `users/${auth.currentUser.uid}/hiredUsers/${jobApplication.jobApplication.jobApplicationId}`), {
            ...jobApplication,
            situation: 'hire',
            dateHired: new Date().getTime()
        })
            .then(() => {
                deleteDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${jobApplication.jobApplication.id}/jobApplications/${jobApplication.jobApplication.jobApplicationId}`))
                updateDoc(doc(database, `users/${jobApplication.jobApplication.sender.uid}/myJobApplications/${jobApplication.jobApplication.jobApplicationId}`), {
                    situation: 'hire'
                });
            })
            .then(() => {
                setDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${jobApplication.jobApplication.id}/hiredUsersForThisJob/${jobApplication.jobApplication.sender.uid}`), {
                    ...jobApplication.jobApplication.sender
                })
                toast.dark('Successfully hired!');
                sendMessage(auth.currentUser, jobApplication.jobApplication.sender, `Congratulations, your job application for ${jobApplication.jobPost.job}-${jobApplication.jobPost.company}, has been accepted!`, 'job');
            })
    }

    const notHirePersonFunc = (jobApplication) => {
        updateDoc(doc(database, `users/${jobApplication.jobApplication.sender.uid}/myJobApplications/${jobApplication.jobApplication.jobApplicationId}`), {
            situation: 'notHire'
        })
            .then(() => {
                deleteDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${jobApplication.jobApplication.id}/jobApplications/${jobApplication.jobApplication.jobApplicationId}`))
            })
            .then(() => {
                toast.dark('Successfully did not hire!');
                sendMessage(auth.currentUser, jobApplication.jobApplication.sender, `Unfortunately, your job application for ${jobApplication.jobPost.job}-${jobApplication.jobPost.company}, was not accepted!`, 'job');
            })
    }

    return (
        <div className='m-2' style={{ width: "400px" }}>
            <div className='bg-light shadow p-3 rounded'>
                {/* info and image */}
                <div className='d-flex justify-content-between'>
                    <div style={{ marginRight: "20px" }}>
                        <small className='text-muted' style={{ display: "block", fontSize: "12px" }}>Name</small>
                        <small style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}><b>{jobApplication.jobApplication.name}</b></small>
                        <small className='text-muted' style={{ display: "block", fontSize: "12px" }}>Surname</small>
                        <small style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}><b>{jobApplication.jobApplication.surname}</b></small>
                        <small className='text-muted' style={{ display: "block", fontSize: "12px" }}>Age</small>
                        <small style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}><b>{jobApplication.jobApplication.age}</b></small>
                        <small className='text-muted' style={{ display: "block", fontSize: "12px" }}>Email</small>
                        <small style={{ display: "block", fontSize: "12px", marginBottom: "5px" }}><b>{jobApplication.jobApplication.sender.email}</b></small>
                    </div>
                    <div>
                        <img src={jobApplication.jobApplication.sender.photoURL} alt="" style={{ width: "140px", height: "140px", borderRadius: "10px", pointerEvents: "none" }} />
                    </div>
                </div>

                <Divider sx={{ my: "10px" }} />

                {/* description */}
                <div>
                    <small style={{ display: "block", fontSize: "12px" }}><b>Description</b></small>
                    <small style={{ display: "inline-block", fontSize: "14px", width: "100%" }}>{jobApplication.jobApplication.descYourself}</small>
                </div>

                {/* skills */}
                <small style={{ display: "block", fontSize: "12px", marginTop: "14px" }}><b>Skills</b></small>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {
                        jobApplication.jobApplication.skills.map((skill) => {
                            return (
                                <div style={{ marginRight: "10px", fontSize: "12px" }}>
                                    <b><i className="fa-solid fa-check text-muted"></i> {skill}</b>
                                </div>
                            )
                        })
                    }
                </div>

                <Divider sx={{ mt: "10px" }} />

                {/* applied job */}
                <div>
                    <small style={{ display: "block", fontSize: "12px", marginTop: "14px" }}><b>{type === 'hired' ? `The job I hired ${jobApplication.jobApplication.name} for` : 'The applied job'}</b></small>
                    <JobPost type={'small'} post={jobApplication.jobPost} user={auth.currentUser} />
                </div>

                {
                    type === 'application' ?
                        <div>
                            <IconButton sx={{ mr: "5px" }} onClick={() => {
                                hirePersonFunc(jobApplication)
                            }}><i className="fa-solid fa-handshake" style={{ width: "30px", height: "30px", textAlign: "center", lineHeight: "30px", color: '#146785' }}></i></IconButton>
                            <IconButton><i className="fa-solid fa-xmark" onClick={() => {
                                notHirePersonFunc(jobApplication);
                            }} style={{ width: "30px", height: "30px", textAlign: "center", lineHeight: "30px", color: "darkred" }}></i></IconButton>
                        </div>
                        :
                        <></>
                }
                {
                    type === 'hired' ?
                        <div style={{ textAlign: "end" }}>
                            <small className='text-muted' style={{ fontSize: "12px" }}>Hired <Moment fromNow>{jobApplication.dateHired}</Moment></small>
                        </div>
                        :
                        <></>
                }
            </div>
        </div>
    )
}

export default UserInfo