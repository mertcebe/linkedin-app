import React from 'react'
import { Navigate, Outlet } from 'react-router'

const PrivateRoute = ({isAuthorized}) => {
    return (
        <>
            {
                isAuthorized?
                <Outlet />
                :
                <Navigate to='/' />
            }
        </>
    )
}

export default PrivateRoute