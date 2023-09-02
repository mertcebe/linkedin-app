import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Job from './Job';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'
import Loading from './Loading';
import JobPost from './JobPost';

const Jobs = () => {
    const { id } = useParams();
    let [jobs, setJobs] = useState();
    // if(id !== undefined){
    // }
    useEffect(() => {
        getDocs(query(collection(database, `allJobPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let jobs = [];
                snapshot.forEach((job) => {
                    jobs.push({
                        ...job.data(),
                        id: job.id
                    });
                })
                setJobs(jobs);
            })
    }, []);

    if (!jobs) {
        return (
            <Loading />
        )
    }
    return (
        <div className='container'>
            {/* filter section */}
            <div>
            </div>

            {/* jobs */}
            <div>
                {/* jobs title */}
                <div style={{ width: "50%" }}>
                    {
                        jobs.map((job, index) => {
                            return (
                                <JobPost post={job} type={'large'} key={job.id} />
                            )
                        })
                    }
                </div>
                {/* jobs desc */}
                <div>

                </div>
            </div>
        </div>
    )
}

export default Jobs