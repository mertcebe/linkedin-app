import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../images/Linkedin-logo-png.png'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import linkedinLogo from '../images/linkedinLogo.png';
import { Typography, Box, Tooltip, IconButton, Avatar, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material'

const Navbar = ({ active }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const signOutFunc = () => {
        signOut(auth);
        setAnchorEl(null);
    }
    let signUpCollapsed = useSelector((state) => {
        return state.signUpCollapsed;
    })
    let dispatch = useDispatch();
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
                    <Link className="navbar-brand" to='/home'><img src={linkedinLogo} alt="" style={{width: "36px", pointerEvents: "none"}} /></Link>
                    <form className="form-inline my-2 my-lg-0" style={{position: "relative"}}>
                        <label htmlFor='searchInput1' style={{position: "absolute", top: "6px", left: "10px"}}><i className="fa-solid fa-magnifying-glass"></i></label>
                        <input className="form-control mr-sm-2" id='searchInput1' style={{paddingLeft: "30px"}} type="search" placeholder="Search" />
                    </form>
                </div>

                <div>
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
                                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
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
                                <MenuItem onClick={handleClose}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <MenuItem onClick={signOutFunc}>
                                    <i className="fa-solid fa-right-from-bracket" style={{marginRight: "8px", color: "grey", fontSize: "18px"}}></i>Sign Out
                                </MenuItem>
                            </Menu>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Navbar