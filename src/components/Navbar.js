import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../images/Linkedin-logo-png.png'
import { signOut } from 'firebase/auth'
import database, { auth } from '../firebase/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import linkedinLogo from '../images/linkedinLogo.png';
import { Typography, Box, Tooltip, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon, Button, FormControl, InputLabel, Select } from '@mui/material'
import ListIcon from '@mui/icons-material/List';
import Loading from './Loading'
import { collection, endAt, getDocs, orderBy, query, startAt, where } from 'firebase/firestore'


const Navbar = ({ active }) => {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    //* signUpNavbar
    let signUpCollapsed = useSelector((state) => {
        return state.signUpCollapsed;
    })

    //* appNavbar
    // for profile button
    const [anchorEl, setAnchorEl] = useState(null);
    let [size, setSize] = useState(window.innerWidth);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // for dropdown menu
    const [anchorElForMenu, setAnchorElForMenu] = useState(null);
    const openForMenu = Boolean(anchorElForMenu);
    const handleClickForMenu = (e) => {
        setAnchorElForMenu(e.currentTarget);
    };
    const handleCloseForMenu = () => {
        setAnchorElForMenu(null);
    };

    const signOutFunc = () => {
        signOut(auth);
        setAnchorEl(null);
    }

    const openProfileFunc = () => {
        navigate('/profile');
        setAnchorEl(null);
    }

    window.addEventListener('resize', (e) => {
        setSize(e.target.innerWidth);
    })

    // search type
    const [type, setType] = useState('jobApplications');
    const handleChange = (e) => {
        setType(e.target.value);
    };

    // search input
    let [searchJobs, setSearchJobs] = useState();
    let [searchUsers, setSearchUsers] = useState();
    let [searchText, setSearchText] = useState();
    let [searchControl, setSearchControl] = useState(false);
    const searchFunc = (text) => {
        if (text) {
            if (type === 'jobApplications') {
                getDocs(query(collection(database, `allJobPosts`)))
                    .then((snapshot) => {
                        let jobs = [];
                        snapshot.forEach((job) => {
                            if (((job.data().job).toLowerCase()).includes(text)) {
                                jobs.push({
                                    ...job.data(),
                                    id: job.id
                                });
                            }
                        })
                        setSearchControl(true)
                        setSearchJobs(jobs);
                    })
            }
            else if (type === 'users') {
                getDocs(query(collection(database, `users`)))
                    .then((snapshot) => {
                        let users = [];
                        snapshot.forEach((user) => {
                            if (((user.data().name).toLowerCase()).includes(text)) {
                                users.push({
                                    ...user.data(),
                                    id: user.id
                                });
                            }
                        })
                        setSearchControl(true)
                        setSearchUsers(users);
                    })
            }
        }
        else {
            setSearchControl(false)
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target.id !== 'searchJob' || e.target.id !== 'dropdownSearhMenu') {
            setSearchControl(false);
        }
    })

    if (active === 'signInNavbar') {
        return (
            <div className="navbar navbar-expand-sm navbar-light d-flex justify-content-between px-4">
                <div className='d-flex align-items-center'>
                    <Link className="navbar-brand" to='/'>
                        <img src={logo} alt="" style={{ width: "100px", pointerEvents: "none" }} />
                    </Link>
                </div>

                <div>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <button onClick={() => {
                                dispatch({
                                    type: "SET_SIGNUP",
                                    payload: !signUpCollapsed
                                })
                            }} className="nav-link px-4" style={{ borderRadius: "20px", border: "1px solid #0072b1", color: "#0072b1" }}>Sign up</button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    else if (active === 'appNavbar') {
        return (
            <div className="navbar navbar-expand-sm navbar-light bg-light d-flex justify-content-between px-4">
                <div className='d-flex align-items-center'>
                    <Link className="navbar-brand" to='/home'>
                        <img src={linkedinLogo} alt="" style={{ width: "36px", pointerEvents: "none" }} />
                    </Link>
                    <form className="form-inline my-2 my-lg-0" style={{ position: "relative" }}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, position: "absolute", top: "0px", left: "0px", width: "80px" }} size="small">
                            <Select
                                style={{ width: "80px", height: "24px" }}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Type"
                                onChange={handleChange}
                                defaultValue='jobApplications'
                            >
                                <MenuItem value={'jobApplications'}>job applications</MenuItem>
                                <MenuItem value={'users'}>users</MenuItem>
                            </Select>
                        </FormControl>
                        <input className="form-control mr-sm-2" value={searchText} autoComplete='off' id='searchInput1' style={{ paddingLeft: "100px" }} onChange={(e) => {
                            searchFunc(e.target.value);
                            setSearchText(e.target.value);
                        }} type="search" placeholder="Search" />
                        {/* dropdown search menu */}
                        {
                            searchControl && searchText ?
                                <div id='dropdownSearhMenu' style={{ zIndex: 300 }}>
                                    {
                                        type === 'jobApplications' ?
                                            <>
                                                {
                                                    searchJobs.length !== 0 ?
                                                        <>
                                                            {
                                                                searchJobs.slice(0, 10).map((job) => {
                                                                    return (
                                                                        <NavLink to={`/jobs/${job.id}`} id='searchJob' onClick={() => {
                                                                            setSearchControl(false);
                                                                            setSearchText('');
                                                                        }}
                                                                            style={{
                                                                                display: "block",
                                                                                borderRadius: "5px",
                                                                                color: "#000",
                                                                                fontSize: "14px",
                                                                                background: "#fff",
                                                                                textDecoration: "none",
                                                                                margin: "5px",
                                                                                marginBottom: "5px",
                                                                                padding: "5px 10px"
                                                                            }}>
                                                                            {job.job}
                                                                        </NavLink>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                        :
                                                        <small style={{ display: "block", color: "grey", padding: "10px" }}>No match found!</small>
                                                }
                                            </>
                                            :
                                            <>
                                                {
                                                    searchUsers.length !== 0 ?
                                                        <>
                                                            {
                                                                searchUsers.slice(0, 10).map((user) => {
                                                                    return (
                                                                        <NavLink to={`/profile/${user.uid}`} id='searchJob' onClick={() => {
                                                                            setSearchControl(false);
                                                                            setSearchText('');
                                                                        }}
                                                                            style={{
                                                                                display: "block",
                                                                                borderRadius: "5px",
                                                                                color: "#000",
                                                                                fontSize: "14px",
                                                                                background: "#fff",
                                                                                textDecoration: "none",
                                                                                margin: "5px",
                                                                                marginBottom: "5px",
                                                                                padding: "5px 10px"
                                                                            }}>
                                                                            {user.name}
                                                                        </NavLink>
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                        :
                                                        <small style={{ display: "block", color: "grey", padding: "10px" }}>No match found!</small>
                                                }
                                            </>
                                    }
                                </div>
                                :
                                <></>
                        }
                    </form>
                </div>

                <div className='appNavbarMenu'>
                    {
                        size > 800 ?
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to='/home' className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/network' className="nav-link">My Network</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/jobs' className="nav-link">Jobs</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/messaging' className="nav-link">Messaging</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/notifications' className="nav-link">Notifications</NavLink>
                                </li>
                                <li>
                                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                        <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <Avatar sx={{ width: 32, height: 32 }}>{auth.currentUser.displayName[0].toUpperCase()}</Avatar>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem onClick={openProfileFunc}>
                                            <Avatar /> Profile
                                        </MenuItem>
                                        <MenuItem onClick={signOutFunc}>
                                            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "8px", color: "grey", fontSize: "18px" }}></i>Sign Out
                                        </MenuItem>
                                    </Menu>
                                </li>
                            </ul>
                            :
                            <div className='d-flex'>
                                <li style={{ listStyle: "none" }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                        <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <Avatar sx={{ width: 32, height: 32 }}>{auth.currentUser.displayName[0].toUpperCase()}</Avatar>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem onClick={openProfileFunc}>
                                            <Avatar /> Profile
                                        </MenuItem>
                                        <MenuItem onClick={signOutFunc}>
                                            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "8px", color: "grey", fontSize: "18px" }}></i>Sign Out
                                        </MenuItem>
                                    </Menu>
                                </li>
                                <div>
                                    <IconButton
                                        id="basic-button"
                                        aria-controls={openForMenu ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openForMenu ? 'true' : undefined}
                                        onClick={handleClickForMenu}
                                    >
                                        <ListIcon />
                                    </IconButton>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorElForMenu}
                                        open={openForMenu}
                                        onClose={handleCloseForMenu}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleCloseForMenu} className="nav-item">
                                            <NavLink to='/home' className="nav-link">Home</NavLink>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseForMenu} className="nav-item">
                                            <NavLink to='/network' className="nav-link">My Network</NavLink>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseForMenu} className="nav-item">
                                            <NavLink to='/jobs' className="nav-link">Jobs</NavLink>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseForMenu} className="nav-item">
                                            <NavLink to='/messaging' className="nav-link">Messaging</NavLink>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseForMenu} className="nav-item">
                                            <NavLink to='/notifications' className="nav-link">Notifications</NavLink>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default Navbar