import React from 'react'

function Layout(props) {
  return (
    <div className='container mx-auto'>
      {props.children}
    </div>
  )
}

export default Layout