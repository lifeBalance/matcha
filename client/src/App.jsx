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
import NotifList from './pages/NotifList'
import ChatList from './pages/ChatList'
import Chat from './pages/Chat'

// components
import Layout from './components/UI/Layout'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { loginAfterReload, setLiveLocation } from './store/authSlice'
import {
  increaseNewMsgs,
  increaseNewNotifs,
  refetchConvos,
  updateConvo
} from './store/notifSlice'

// socket.io
import socketIO from 'socket.io-client'

function App() {
  // redux
  const dispatch = useDispatch()

  const {
    isLoggingIn,
    isLoggedIn,
    profilePic,
    uid
  } = useSelector(slices => slices.auth)

  const [socket, setSocket] = React.useState(null)

  /* Let's set the LIVE LOCATION global state as soon as the APP 
    component loads, so that we'll have it available to be sent when the 
    user logs in (It will contain the initial state if the user didn't 
    authorize the geolocation of the navigator browser API). */
  React.useEffect(() => {
    if (!navigator.geolocation) return

    function handleSuccess(pos) {
      dispatch(setLiveLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }))
    }

    function handleError(err) { /* console.log(err) */ }

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

    // Only if the user is logged in, we connect to the socket!
    if (isLoggedIn) {
      const tmp = socketIO.connect('http://localhost')
      setSocket(tmp)

      // Clean up connection when component unmounts.
      return () => tmp.disconnect('kuku')
    }
  }, [isLoggingIn, isLoggedIn])

  React.useEffect(() => {
    if (!socket || !isLoggedIn) return   // bail if socket is not ready yet!

    socket.on('connected', () => {
      socket.emit('join-room', uid)
    })

    // When we receive notification, we add it to global state
    socket.on('notify', n => {
      // console.log(n) // testing
      if (n.type === 'match' || n.type === 'unmatch') {
        dispatch(increaseNewNotifs())
        dispatch(refetchConvos())
      } else if (n.type === 'message') {
        dispatch(increaseNewMsgs())
        dispatch(updateConvo(n.chatId))
      } else {
        dispatch(increaseNewNotifs())
      }
    })
  }, [socket])

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

          <Route
            path='/notifs'
            element={<NotifList />}
          />

          <Route
            path='/chats'
            element={<ChatList />}
          />

          <Route
            path='/chats/:id'
            element={<Chat />}
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
