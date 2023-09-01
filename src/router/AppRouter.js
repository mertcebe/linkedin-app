import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignInPage from '../components/SignInPage'
import Navbar from '../components/Navbar'
import Home from '../components/Home'
import PrivateRoute from '../routes/PrivateRoute'
import useAuthorized from '../useAuth/useAuthorized'
import { ToastContainer } from 'react-toastify'
import PublicRoute from '../routes/PublicRoute'
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from '../components/ProfilePage'
import OnePost from '../components/OnePost'
import Loading from '../components/Loading'
import ProfilePageOther from '../components/ProfilePageOther'

const AppRouter = () => {
    let { isAuthorized, loading } = useAuthorized();
    if (!loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <BrowserRouter>
                <Navbar active={isAuthorized ? 'appNavbar' : 'signInNavbar'} />
                <Routes>
                    <Route element={<PrivateRoute isAuthorized={isAuthorized} />}>
                        <Route path='/home' element={<Home />} />
                        <Route path='/home/:id' element={<OnePost />} />
                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/profile/:id' element={<ProfilePageOther />} />
                    </Route>
                    <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
                        <Route path='/' element={<SignInPage />} />
                    </Route>
                </Routes>
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </BrowserRouter>
        </>
    )
}

export default AppRouter