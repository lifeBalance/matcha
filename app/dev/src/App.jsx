import React from 'react'

// router
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// pages
import Test from './pages/Test' // for testing!

import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Settings from './pages/Settings'
import SettingsForm from './pages/SettingsForm'
import RequestPassword from './pages/RequestPassword'
import ResetPassword from './pages/ResetPassword'
import Confirm from './pages/Confirm'
import ProfileList from './pages/ProfileList'
import Profile from './pages/Profile'
import PageNotFound from './pages/PageNotFound'

// redux
import { useDispatch, useSelector } from 'react-redux'
import {
  loginAfterReload,
  setCoords,
  setManualLocation,
  setCurrentLocation
} from './store/authSlice'
import Layout from './components/UI/Layout'

function App() {
  // redux
  const dispatch = useDispatch()
  const gps = useSelector(slices => slices.auth.gps)

  const {
    isLoggingIn,
    isLoggedIn,
    profilePic,
  } = useSelector(slices => slices.auth)

  /* Let's set the CURRENT LOCATION global state as soon as the APP 
    component loads (this is the geolocation of the navigator browser 
    API). This way we'll have it available to be sent when the 
    user logs in. */
  React.useEffect(() => {
    if (!navigator.geolocation ||
        (gps.coords.lat !== 0 && gps.coords.lng !== 0)) return

    console.log('navigator is ON!') // testing

    function handleSuccess(pos) {
      dispatch(setCurrentLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }))
    }

    function handleError(err) { console.log(err) }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [])

  /* Retrieve the Access Token from Local Storage and set the proper isLoggedIn
    state in the UI. Useful for when the user refreshes the page, or closes
    the browser/tab without loggin out (hence, there's a token in local 
    storage). */
  React.useEffect(() => {
    if (isLoggingIn) return
    const matcha = localStorage.getItem('matcha')
    if (!isLoggedIn && matcha) dispatch(loginAfterReload(matcha))
  }, [isLoggingIn, isLoggedIn])

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
            path='/settings'
            element={<Settings />}
          />

          <Route
            path='/edit'
            element={<SettingsForm />}
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
            path='/forgot'
            element={<RequestPassword />}
          />

          <Route path='reset/:email/:token' element={<ResetPassword />} />

          {/* To Request an email with an  account confirmation link */}
          <Route path='confirm' element={<Confirm />} />

          {/* To Confirm the account by clicking on the aforementioned link */}
          <Route path='confirm/:useremail/:usertoken' element={<Confirm />} />

          <Route
            path='test'
            element={<Test />}
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
