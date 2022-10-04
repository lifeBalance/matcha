import React from 'react'

// router
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// pages
import Test from './pages/Test' // for testing!

import Profile from './pages/Profile'
import Users from './pages/Users'
import User from './pages/User'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import RequestPassword from './pages/RequestPassword'
import ResetPassword from './pages/ResetPassword'
import Confirm from './pages/Confirm'
import PageNotFound from './pages/PageNotFound'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { loginAfterReload } from './store/authSlice'
import Layout from './components/UI/Layout'

// hooks
import useGetProfilePic from './hooks/useGetProfilePic'

function App() {
  const dispatch = useDispatch()
  // const isLoggedIn = useSelector((slices) => slices.auth.isLoggedIn)
  const {
    isLoggedIn,
    accessToken
  } = useSelector(slices => slices.auth)

  // 'profilePic' state must be set here in order to be passed down to
  // the Layout > Navbar; also, 'setProfilePic' is passed to the 'Profile' comp.
  const [profilePic, setProfilePic] = React.useState('')
  const {
    picIsLoading,
    errorGettingPic,
    getProfilePic
  } = useGetProfilePic() // small hook to get the user's profile picture.

  React.useEffect(() => {
    if (!isLoggedIn) return
    getProfilePic(accessToken, setProfilePic)
  }, [profilePic, isLoggedIn, accessToken])

  /* Retrieve the Access Token from Local Storage and set the proper isLoggedIn
    state in the UI. Useful for when the user refreshes the page, or closes
    the browser/tab without loggin out (hence, there's a token in local 
    storage). */
  React.useEffect(() => {
    if (localStorage.getItem('accessToken')) dispatch(loginAfterReload())
  }, [])

  return (
    <BrowserRouter>
      <Layout profilePic={profilePic} >
        <Routes>
          <Route
            path='/'
            element={<Users />}
          />

          <Route
            path='test'
            element={<Test />}
          />

          <Route
            path='/login'
            element={<Login />}
          />

          <Route
            path='/signup'
            element={<SignUp />}
          />

          <Route
            path='/profile'
            element={<Profile setProfilePic={setProfilePic} />}
          />

          <Route
            path='/forgot'
            element={<RequestPassword />}
          />
          <Route path='reset/:email/:token' element={<ResetPassword />} />

          <Route path='confirm' element={<Confirm />} />
          <Route path='confirm/:useremail/:usertoken' element={<Confirm />} />

          <Route
            path='/users/:id'
            element={<User />}
          />

          <Route
            path='/404'
            element={<PageNotFound />}
          />

          <Route
            path='*'
            element={<PageNotFound />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
