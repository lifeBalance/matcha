import React from 'react'

// components

//icons
import { EnvelopeIcon } from '../assets/icons'

function Profile() {
  return (
    <>
      <h1 className='text-4xl'>Profile</h1>
      <p><EnvelopeIcon styles='w-6' /> Email</p>
    </>
  )
}

export default Profile