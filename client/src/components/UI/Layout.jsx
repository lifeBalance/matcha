import React from 'react'

// // components
import Navbar from './Navbar/Navbar'
import Footer from './Footer'

function Layout(props) {
  return (
    <div className='bg-gradient-to-br from-pink-400 via-red-400 to-yellow-400 min-h-screen flex flex-col'>
      <Navbar profilePic={props.profilePic} />
        <div className="mx-auto flex">
          {props.children}
        </div>
      <Footer />
    </div>
  )
}

export default Layout