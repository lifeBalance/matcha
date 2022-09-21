import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {

  return (
    <div className='bg-travolta w-screen h-screen bg-center bg-cover flex flex-col space-y-4 items-center justify-center'>
      <h1 className='text-8xl font-bold text-center font-logo'>404</h1>
      <p className='text-6xl'>🙈</p>
      <Link to='/' className='text-xl underline underline-offset-4 hover:text-blue-500'>Please Take me home</Link>
    </div>
  )
}

export default PageNotFound