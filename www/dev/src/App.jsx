import React from 'react'

// router
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Test from './pages/Test'
import Profile from './pages/Profile'
import Users from './pages/Users'
import User from './pages/User'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import EmailForm from './pages/EmailForm'
import PageNotFound from './pages/PageNotFound'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { loginAfterReload } from './store/authSlice'
import Layout from './components/UI/Layout'

function App() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((slices) => slices.auth.isLoggedIn)

  /* Retrieve the Access Token from Local Storage and set the proper isLoggedIn
    state in the UI. Useful for when the user refreshes the page, or closes
    the browser/tab without loggin out (hence, there's a token in local 
    storage). */
  React.useEffect(() => {
    if (localStorage.getItem('accessToken')) dispatch(loginAfterReload())
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='test'
            element={<Test />}
          />
          <Route
            path='users'
            element={<Users />}
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
            element={<Profile />}
          />
          <Route
            path='/forgot'
            element={<EmailForm title='password recovery' />}
          />
          <Route
            path='/confirm'
            element={<EmailForm title='confirmation email' />}
          />
          <Route
            path='/users/:id'
            element={<User />}
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
