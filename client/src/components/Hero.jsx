import React from 'react'
import coupleImg from '../assets/pancakes.png'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div class="grid md:grid-cols-2 place-items-center max-w-4xl">
      <div className='flex flex-col p-6'>
        <h1 class="text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white mt-10 text-center md:text-left">Looking for someone to share breakfast with?</h1>

        <div className="flex mx-auto pt-10">
          <Link to="/login" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 hover:underline hover:scale-110">
            Log in
          </Link>

          <Link to="/signup" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-lg hover:bg-white hover:bg-opacity-20 focus:ring-4 focus:ring-gray-100">
            Sign up
          </Link> 
        </div>
      </div>

      <div class='hidden md:block md:w-full'>
        <img src={coupleImg} alt="mockup" className='w-62'/>
      </div>                
    </div>
  )
}

export default Hero
