import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig'
import Loading from './Loading';
import JobPost from './JobPost';
import Moment from 'react-moment';

const MyNetwork = () => {
    let [myJobApplications, setMyJobApplications] = useState();
    useEffect(() => {
        getDocs(query(collection(database, `users/${auth.currentUser.uid}/myJobApplications`), orderBy('dateSended', 'desc')))
            .then((snapshot) => {
                let jobs = [];
                snapshot.forEach((job) => {
                    jobs.push({
                        ...job.data(),
                        id: job.id
                    });
                })
                console.log(jobs);
                setMyJobApplications(jobs)
            })
    }, []);

    if (!myJobApplications) {
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
                            <div style={{position: "relative"}}>
                                <JobPost post={job.jobAppliedFor} type={'large'} />
                                <small className='text-muted' style={{fontSize: "12px", position: "absolute", top: "10px", right: "10px"}}>Job application was submitted <Moment fromNow>{job.dateSended}</Moment></small>
                                <div style={{fontSize: "14px", position: "absolute", bottom: "10px", right: "10px"}}>{job.situation === 'wait'?<small style={{color: "grey"}}>waiting for reply...</small>:job.situation === 'hire'?<small style={{color: "darkseagreen"}}>You were hired! <i className="fa-solid fa-check"></i></small>:<small style={{color: "red"}}>You were not hired! <i className="fa-solid fa-xmark"></i></small>}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MyNetwork