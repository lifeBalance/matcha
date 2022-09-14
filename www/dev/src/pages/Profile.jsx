import React from 'react'

// components
import Layout from '../components/UI/Layout'

//icons
import { EnvelopeIcon } from '../assets/icons'

function Profile() {
  return (
    <Layout>
      <h1 className='text-4xl'>Profile</h1>
      <p><EnvelopeIcon styles='w-6' /> Email</p>
    </Layout>
  )
}

export default Profile