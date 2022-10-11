import React from 'react'

// router
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// pages
import Test from './pages/Test' // for testing!

import Settings from './pages/Settings'
import Profile from './pages/Profile'
import ProfileList from './pages/ProfileList'
import User from './pages/User'     // marked for deletion
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

  /* The 'profilePic' state must be set here in order to be passed down to
    the 'Layout' then to the 'Navbar'. Also, 'setProfilePic' is passed to the
    'Settings' page, so that when the user adds the first picture, we can 
    invoke it right there to set the `profilePic' state. */
  const [profilePic, setProfilePic] = React.useState('')
  const {
    picIsLoading,
    errorGettingPic,
    getProfilePic
  } = useGetProfilePic() // small hook to get the user's profile picture.
/* 
  React.useEffect(() => {
    if (!isLoggedIn) return
    getProfilePic(accessToken, setProfilePic)
  }, [profilePic, isLoggedIn, accessToken])
 */
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
            element={<ProfileList />}
          />

          <Route
            path='/profiles/:id'
            element={<Profile />}
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
            path='/settings'
            element={<Settings setProfilePic={setProfilePic} />}
          />

          <Route
            path='/forgot'
            element={<RequestPassword />}
          />
          <Route path='reset/:email/:token' element={<ResetPassword />} />

          {/* To Request an email with an  account confirmation link */}
          <Route path='confirm' element={<Confirm />} />

          {/* To Confirm the account by clicking on the aforementioned link */}
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
