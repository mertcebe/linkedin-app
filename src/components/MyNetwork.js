import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig'
import Loading from './Loading';
import JobPost from './JobPost';
import Moment from 'react-moment';
import UserInfo from './UserInfo';

const MyNetwork = () => {
    let [myJobApplications, setMyJobApplications] = useState();
    let [myHiredUsers, setMyHiredUsers] = useState();
    useEffect(() => {
        const getMyApplications = () => {
            getDocs(query(collection(database, `users/${auth.currentUser.uid}/myJobApplications`), orderBy('dateSended', 'desc')))
            .then((snapshot) => {
                let jobs = [];
                snapshot.forEach((job) => {
                    jobs.push({
                        ...job.data(),
                        id: job.id
                    });
                })
                setMyJobApplications(jobs)
            })
        }
        const getMyHiredUsers = () => {
            getDocs(query(collection(database, `users/${auth.currentUser.uid}/hiredUsers`), orderBy('dateHired', 'desc')))
            .then((snapshot) => {
                let users = [];
                snapshot.forEach((job) => {
                    users.push({
                        ...job.data(),
                        id: job.id
                    });
                })
                console.log(myHiredUsers)
                setMyHiredUsers(users);
            })
        }
        getMyHiredUsers();
        getMyApplications();
    }, []);

    if (!myJobApplications || !myHiredUsers) {
        return (
            <Loading />
        )
    }
    return (
        <div className='container'>
            {/* my job applications */}
            <div className='my-3'>
                <p style={{ color: "#0072b1", font: "caption" }}>My Job Applications</p>
                {
                    myJobApplications.map((job) => {
                        return (
                            <div id='networkJobDiv' style={{ position: "relative" }}>
                                <JobPost post={job.jobAppliedFor} type={'large'} />
                                <small id='networkDateSendedText' className='text-muted'>Job application was submitted <Moment fromNow>{job.dateSended}</Moment></small>
                                <div style={{ fontSize: "14px", position: "absolute", bottom: "10px", right: "10px", pointerEvents: "none" }}>{job.situation === 'wait' ? <small style={{ color: "grey" }}>waiting for reply...</small> : job.situation === 'hire' ? <small style={{ color: "darkseagreen" }}>You were hired! <i className="fa-solid fa-check"></i></small> : <small style={{ color: "red" }}>You were not hired! <i className="fa-solid fa-xmark"></i></small>}</div>
                            </div>
                        )
                    })
                }
            </div>

            {/* my hired users */}
            <div>
                <p style={{ color: "#0072b1", font: "caption", marginTop: "30px", marginBottom: "10px" }}>My Hired Users</p>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {
                        myHiredUsers.map((user) => {
                            return (
                                <UserInfo jobApplication={user} type={'hired'} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MyNetwork