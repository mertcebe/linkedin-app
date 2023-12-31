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
import Jobs from '../components/Jobs'
import Notifications from '../components/Notifications'
import MyNetwork from '../components/MyNetwork'
import Messages from '../components/messages/Messages'
import TicTacToe from '../components/TicTacToe'
import SearchPage from '../components/SearchPage'

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
                        <Route path='/jobs' element={<Jobs />} />
                        <Route path='/jobs/:id' element={<Jobs />} />
                        <Route path='/network' element={<MyNetwork />} />
                        <Route path='/messaging' element={<Messages />} />
                        <Route path='/notifications' element={<Notifications />} />
                        <Route path='/*' element={<SearchPage />} />
                    </Route>
                    <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
                        <Route path='/' element={<SignInPage />} />
                    </Route>
                </Routes>
                <ToastContainer
                    position="bottom-center"
                    autoClose={2000}
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