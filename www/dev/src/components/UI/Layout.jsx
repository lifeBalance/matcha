import React from 'react'

// // components
import Navbar from './Navbar/Navbar'
import Footer from './Footer'

function Layout(props) {
  return (
    <div className='container bg-gradient-to-br from-pink-400 via-red-400 to-yellow-400 min-h-screen min-w-full flex flex-col'>
      <Navbar />
        <div className="max-w-6xl min-w-xs mx-auto text-white flex">
          {props.children}
        </div>
      <Footer />
    </div>
  )
}

export default Layout