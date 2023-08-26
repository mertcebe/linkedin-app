import React from 'react'
import { Navigate, Outlet } from 'react-router'

const PublicRoute = ({ isAuthorized }) => {
    return (
        <>
            {
                isAuthorized ?
                    <Navigate to='/home' />
                    :
                    <Outlet />
            }
        </>
    )
}

export default PublicRoute