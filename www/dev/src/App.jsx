import React from 'react'

// router
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Test from './pages/Test'
import Profile from './pages/Profile'
import Users from './pages/Users'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'

// components
import Navbar from './components/UI/Navbar/Navbar'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { loginAfterReload } from './store/authSlice'

function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(slices => slices.auth.isLoggedIn)

  // Retrieve the Access Token from Local Storage and set the proper isLoggedIn
  // state in the UI. Useful for when the user refreshes the page, or closes
  // the browser/tab without loggin out (hence, there's a token in local 
  // storage.
  React.useEffect(() => {
    if (localStorage.getItem('accessToken'))
      dispatch(loginAfterReload())
  }, [])

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='test' element={<Test />} />
        <Route path='users' element={<Users />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
