import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../images/Linkedin-logo-png.png'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

const Navbar = ({ active }) => {
    if (active === 'signInNavbar') {
        return (
            <div className="navbar navbar-expand-sm navbar-light d-flex justify-content-between px-4">
                <div className='d-flex align-items-center'>
                    <Link className="navbar-brand" to='/'>
                        <img src={logo} alt="" style={{width: "100px", pointerEvents: "none"}}/>
                    </Link>
                </div>

                <div>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink to='/sign-up' className="nav-link px-4" style={{background: "", borderRadius: "20px", border: "1px solid #0072b1", color: "#0072b1"}}>Sign up</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    else if (active === 'appNavbar') {
        return (
            <div className="navbar navbar-expand-sm navbar-light bg-light d-flex justify-content-between">
                <div className='d-flex align-items-center'>
                    <Link className="navbar-brand" to='/home'>Navbar</Link>
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    </form>
                </div>

                <div>
                    <ul className="navbar-nav mr-auto">
                        <button onClick={() => {
                            signOut(auth);
                        }}>signOut</button>
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
                    </ul>
                </div>
            </div>
        )
    }
}

export default Navbar