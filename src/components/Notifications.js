import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig';
import Loading from './Loading';
import { Button, Divider, IconButton } from '@mui/material';
import JobPost from './JobPost';
import { toast } from 'react-toastify';

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

  const hirePersonFunc = (jobApplication) => {
    setDoc(doc(database, `users/${auth.currentUser.uid}/hiredUsers/${jobApplication.jobApplication.jobApplicationId}`), {
      ...jobApplication,
      situation: 'hire'
    })
    .then(() => {
      deleteDoc(doc(database, `users/${auth.currentUser.uid}/jobPosts/${jobApplication.jobApplication.id}/jobApplications/${jobApplication.jobApplication.jobApplicationId}`))
      updateDoc(doc(database, `users/${jobApplication.jobApplication.sender.uid}/myJobApplications/${jobApplication.jobApplication.jobApplicationId}`), {
        situation: 'hire'
      });
    })
    .then(() => {
      toast.dark('Successfully hired!');
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
    })
  }

  if (!jobApplications) {
    return (
      <Loading />
    )
  }
  return (
    <div className='container'>
      <Button onClick={(getJobApplications)}>Refresh</Button>
      {/* job application notifications */}
      <div className='my-3'>
        <p style={{ color: "#0072b1", font: "caption" }}>Job Application Notifications</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {
            jobApplications.map((jobApplication) => {
              return (
                <div className='m-2' style={{ width: "30%" }}>
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
                      <small style={{ display: "block", fontSize: "12px", marginTop: "14px" }}><b>The applied job</b></small>
                      <JobPost type={'small'} post={jobApplication.jobPost} user={auth.currentUser} />
                    </div>

                    <div>
                      <IconButton sx={{mr: "5px"}} onClick={() => {
                        hirePersonFunc(jobApplication)
                      }}><i className="fa-solid fa-handshake" style={{width: "30px", height: "30px", textAlign: "center", lineHeight: "30px", color: '#146785'}}></i></IconButton>
                      <IconButton><i className="fa-solid fa-xmark" onClick={() => {
                        notHirePersonFunc(jobApplication);
                      }} style={{width: "30px", height: "30px", textAlign: "center", lineHeight: "30px", color: "darkred"}}></i></IconButton>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Notifications