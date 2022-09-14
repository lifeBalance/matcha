import React from 'react'
import {EnvelopeIcon} from './assets/icons'

// components
import Layout from './components/UI/Layout'
import Navbar from './components/UI/Navbar/Navbar'

function App() {

  return (
    <>
      <Navbar />

      <Layout>
        <h1><EnvelopeIcon styles='w-6' /> hi yall!!</h1>
      </Layout>
    </>
  )
}

export default App
