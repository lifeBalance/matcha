import React from 'react'

// router
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Test from './pages/Test'
import Profile from './pages/Profile'
import Users from './pages/Users'

// components
import Navbar from './components/UI/Navbar/Navbar'


function App() {

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='test' element={<Test />} />
        <Route path='users' element={<Users />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
