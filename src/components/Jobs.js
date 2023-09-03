import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Job from './Job';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'
import Loading from './Loading';
import JobPost from './JobPost';
import { Button, FormControl, MenuItem, Select } from '@mui/material';

const Jobs = () => {
    const { id } = useParams();
    let [jobs, setJobs] = useState();
    let [companies, setCompanies] = useState();
    let [locations, setLocations] = useState();

    // company
    let [company, setCompany] = useState('');
    const handleChangeForCompany = (e) => {
        setCompany(e.target.value);
    };
    // salary
    let [salary, setSalary] = useState('');
    const handleChangeForSalary = (e) => {
        setSalary(e.target.value);
    };
    // location
    let [location, setLocation] = useState('');
    const handleChangeForLocation = (e) => {
        setLocation(e.target.value);
    };
    let [experienceLevel, setExperienceLevel] = useState('');
    const handleChangeForExperienceLevel = (e) => {
        setExperienceLevel(e.target.value);
    };

    const getJobs = () => {
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
    }

    useEffect(() => {
        const getCompanies = () => {
            getDocs(query(collection(database, `allJobPosts`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let companies = [];
                    snapshot.forEach((job) => {
                        companies.push(job.data().company);
                    })
                    let newCompanies = Array.from(new Set(companies));
                    setCompanies(newCompanies);
                })
        }
        const getLocation = () => {
            getDocs(query(collection(database, `allJobPosts`), orderBy('dateAdded', 'desc')))
                .then((snapshot) => {
                    let locations = [];
                    snapshot.forEach((job) => {
                        locations.push(job.data().location);
                    })
                    let newLocations = Array.from(new Set(locations));
                    setLocations(newLocations);
                })
        }
        getLocation();
        getCompanies();
        getJobs();
    }, []);

    const applyFunc = () => {
        getDocs(query(collection(database, `allJobPosts`), orderBy('dateAdded', 'desc')))
            .then((snapshot) => {
                let jobs = [];

                snapshot.forEach((job) => {
                    if (company !== '') {
                        if (job.data().company === company) {
                            if (location !== '') {
                                if (job.data().location === location) {
                                    if (experienceLevel !== '') {
                                        if (job.data().experienceLevel === experienceLevel) {
                                            if(salary !== ''){
                                                if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                                    jobs.push({
                                                        ...job.data(),
                                                        id: job.id
                                                    });
                                                }
                                            }
                                            else{
                                                jobs.push({
                                                    ...job.data(),
                                                    id: job.id
                                                });
                                            }
                                        }
                                    }
                                    else {
                                        jobs.push({
                                            ...job.data(),
                                            id: job.id
                                        });
                                    }
                                }
                            }
                            else {
                                if (experienceLevel !== '') {
                                    if (job.data().experienceLevel === experienceLevel) {
                                        if(salary !== ''){
                                            if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                                jobs.push({
                                                    ...job.data(),
                                                    id: job.id
                                                });
                                            }
                                        }
                                        else{
                                            jobs.push({
                                                ...job.data(),
                                                id: job.id
                                            });
                                        }
                                    }
                                }
                                else {
                                    if(salary !== ''){
                                        if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                            jobs.push({
                                                ...job.data(),
                                                id: job.id
                                            });
                                        }
                                    }
                                    else{
                                        jobs.push({
                                            ...job.data(),
                                            id: job.id
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (location !== '') {
                            if (job.data().location === location) {
                                if (experienceLevel !== '') {
                                    if (job.data().experienceLevel === experienceLevel) {
                                        if(salary !== ''){
                                            if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                                jobs.push({
                                                    ...job.data(),
                                                    id: job.id
                                                });
                                            }
                                        }
                                        else{
                                            jobs.push({
                                                ...job.data(),
                                                id: job.id
                                            });
                                        }
                                    }
                                }
                                else {
                                    if(salary !== ''){
                                        if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                            jobs.push({
                                                ...job.data(),
                                                id: job.id
                                            });
                                        }
                                    }
                                    else{
                                        jobs.push({
                                            ...job.data(),
                                            id: job.id
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            if (experienceLevel !== '') {
                                if (job.data().experienceLevel === experienceLevel) {
                                    if(salary !== ''){
                                        if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                            jobs.push({
                                                ...job.data(),
                                                id: job.id
                                            });
                                        }
                                    }
                                    else{
                                        jobs.push({
                                            ...job.data(),
                                            id: job.id
                                        });
                                    }
                                }
                            }
                            else {
                                if(salary !== ''){
                                    if(Number(job.data().salary.slice(0, job.data().salary.length - 1)) >= salary){
                                        jobs.push({
                                            ...job.data(),
                                            id: job.id
                                        });
                                    }
                                }
                                else{
                                    jobs.push({
                                        ...job.data(),
                                        id: job.id
                                    });
                                }
                            }
                        }
                    }
                })
                setJobs(jobs);
            })
    }

    const resetFunc = () => {
        getJobs();
        setCompany('');
        setSalary('');
        setLocation('');
        setExperienceLevel('');
    }

    if (!jobs) {
        return (
            <Loading />
        )
    }
    return (
        <div className='container'>
            {/* filter section */}
            <div className='d-flex align-items-center'>
                <FormControl sx={{ my: 1, mr: 2, minWidth: 40, display: "flex", flexDirection: "row" }}>
                    <Select
                        value={company}
                        id='jobInput5'
                        onChange={handleChangeForCompany}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: "40px" }}
                    >
                        <MenuItem value="">
                            <em>Company</em>
                        </MenuItem>
                        {
                            companies.map((item) => {
                                return (
                                    <MenuItem value={item}>{item}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ my: 1, mr: 2, minWidth: 40, display: "flex", flexDirection: "row" }}>
                    <Select
                        value={salary}
                        id='jobInput5'
                        onChange={handleChangeForSalary}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: "40px" }}
                    >
                        <MenuItem value="">
                            <em>Salary</em>
                        </MenuItem>
                        <MenuItem value={100}>100$ +</MenuItem>
                        <MenuItem value={2000}>2000$ +</MenuItem>
                        <MenuItem value={5000}>5000$ +</MenuItem>
                        <MenuItem value={10000}>10000$ +</MenuItem>
                        <MenuItem value={20000}>20000$ +</MenuItem>

                    </Select>
                </FormControl>
                <FormControl sx={{ my: 1, mr: 2, minWidth: 40, display: "flex", flexDirection: "row" }}>
                    <Select
                        value={location}
                        id='jobInput5'
                        onChange={handleChangeForLocation}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: "40px" }}
                    >
                        <MenuItem value="">
                            <em>Location</em>
                        </MenuItem>
                        {
                            locations.map((item) => {
                                return (
                                    <MenuItem value={item}>{item}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ my: 1, mr: 2, minWidth: 40, display: "flex", flexDirection: "row" }}>
                    <Select
                        value={experienceLevel}
                        id='jobInput5'
                        onChange={handleChangeForExperienceLevel}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: "40px" }}
                    >
                        <MenuItem value="">
                            <em>Experience level</em>
                        </MenuItem>
                        <MenuItem value={'beginner'}>Beginner</MenuItem>
                        <MenuItem value={'intern'}>Intern</MenuItem>
                        <MenuItem value={'intermediate'}>Intermediate</MenuItem>
                        <MenuItem value={'expert'}>Expert</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={applyFunc}>Apply</Button>
                <Button onClick={resetFunc}>Reset</Button>
            </div>

            {/* jobs */}
            <div className='d-flex' style={{ alignItems: "flex-start" }}>
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
                {
                    id ?
                        <div className='bg-light' style={{ position: "sticky", top: "10px", margin: "10px", width: "50%" }}>
                            <Job id={id} />
                        </div>
                        :
                        <></>
                }
            </div>
        </div>
    )
}

export default Jobs