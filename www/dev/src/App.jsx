import React from 'react'
import Peach from './assets/peach.png'
import {EnvelopeIcon} from './assets/icons'

function App() {

  return (
    <>
      <h1 className='text-6xl font-bold font-logo'>m<img src={Peach} alt="" className='inline w-9' />tch<img src={Peach} alt="" className='inline w-9' /></h1>
      <EnvelopeIcon />
    </>
  )
}

export default App
