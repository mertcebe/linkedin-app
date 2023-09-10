import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig';
import Loading from './Loading';
import { Button, Divider, IconButton } from '@mui/material';
import JobPost from './JobPost';
import { toast } from 'react-toastify';
import UserInfo from './UserInfo';
import { NavLink, useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const Notifications = () => {
  let [jobApplications, setJobApplications] = useState();
  let [friendRequests, setFriendRequests] = useState();

  let navigate = useNavigate();

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

  const getFriendRequests = () => {
    getDocs(query(collection(database, `users/${auth.currentUser.uid}/friendRequests`)))
      .then((snapshot) => {
        let users = [];
        snapshot.forEach((user) => {
          users.push({
            ...user.data()
          })
        })
        setFriendRequests(users);
      })
  }

  useEffect(() => {
    getJobApplications();
    getFriendRequests();
  }, []);



  if (!jobApplications || !friendRequests) {
    return (
      <Loading />
    )
  }
  return (
    <div className='container'>
      <Button onClick={() => {
        getJobApplications();
        getFriendRequests();
      }}>Refresh</Button>
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

      {/* friend requests notifications */}
      {
        friendRequests.length !== 0 ?
          <div className='my-3'>
            <p style={{ color: "#0072b1", font: "caption" }}>Friend Requests Notifications</p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {
                friendRequests.map((user) => {
                  return (
                    <div className='shadow-sm' style={{ background: "#fff", padding: "5px 10px", borderRadius: "5px" }}>
                      <div className='d-flex justify-content-between align-items-center' style={{ width: "300px" }}>
                        <div style={{ pointerEvents: "none" }}>
                          <small style={{ marginRight: "10px" }}><b>{user.name}</b></small>
                          <small>{user.email}</small>
                        </div>
                        <div>
                          <IconButton onClick={() => {
                            navigate(`/profile/${user.uid}`)
                          }}>
                            <PersonSearchIcon />
                          </IconButton>
                          <IconButton>
                            <CheckIcon />
                          </IconButton>
                          <IconButton>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>
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