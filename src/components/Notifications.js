import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig';
import Loading from './Loading';
import { Button, Divider, IconButton } from '@mui/material';
import JobPost from './JobPost';
import { toast } from 'react-toastify';
import UserInfo from './UserInfo';

const Notifications = () => {
  let [jobApplications, setJobApplications] = useState();

  const getJobApplications = async () => {
    await getDocs(query(collection(database, `users/${auth.currentUser.uid}/jobPosts`)))
      .then((snapshot) => {
        let jobs = [];
        snapshot.forEach(async (job) => {
          await getDocs(query(collection(database, `users/${auth.currentUser.uid}/jobPosts/${job.id}/jobApplications`), orderBy('dateSended', 'desc')))
            .then((snapshot) => {
              if (snapshot.size !== 0) {
                snapshot.forEach((jobApplication) => {
                  jobs.push({
                    jobApplication: {
                      ...jobApplication.data(),
                      jobApplicationId: jobApplication.id
                    },
                    jobPost: {
                      ...job.data(),
                      id: job.id
                    }
                  });
                })
              }
            })
          console.log(jobs)
          setJobApplications(jobs);
        })
      })
  }

  useEffect(() => {
    getJobApplications();
  }, []);

  

  if (!jobApplications) {
    return (
      <Loading />
    )
  }
  return (
    <div className='container'>
      <Button onClick={(getJobApplications)}>Refresh</Button>
      {/* job application notifications */}
      {
        jobApplications.length !== 0 ?
          <div className='my-3'>
            <p style={{ color: "#0072b1", font: "caption" }}>Job Application Notifications</p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {
                jobApplications.map((jobApplication) => {
                  return (
                    <UserInfo jobApplication={jobApplication} type={'application'} />
                  )
                })
              }
            </div>
          </div>
          :
          <></>
      }
    </div>
  )
}

export default Notifications