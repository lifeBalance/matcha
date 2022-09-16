import React from 'react'

import Layout from '../components/UI/Layout'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

function Home() {
  const dispatch = useDispatch()
  return (
    <Layout>
      <h1 className='text-2xl font-bold text-center'>Home</h1>
      <p className='text-xl'>
        Homey, lorem ipsum dolor, sit amet consectetur adipisicing elit,
        optio qui veritatis odio corporis reprehenderit. Inventore quidem 
        iste corrupti, iusto itaqur modi eligendi magni! Numquam.
      </p>
      <button
        onClick={() => dispatch(refresh())}
        className='bg-blue-500 text-white font-bold p-4 rounded-lg active:bg-blue-400 hover:bg-blue-600'
      >
        Refresh token
      </button>
    </Layout>
  )
}

export default Home
