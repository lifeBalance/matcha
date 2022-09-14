import React from 'react'

function MobileMenu() {
  return (
    <div id="menu" className="absolute top-20 botton-0 left-0 flex flex-col self-end w-full min-h-screen py-1 px-12 pt-8 space-y-9 divide-y-2 divide-pink-500 text-white uppercase bg-black bg-opacity-75">
      <a href="#" className='hover:text-pink-500 pt-6 pl-4'>go match</a>
      <a href="#" className='hover:text-pink-500 pt-6 pl-4'>likes</a>
      <a href="#" className='hover:text-pink-500 pt-6 pl-4'>chat</a>
      <a href="#" className='hover:text-pink-500 pt-6 pl-4'>profile</a>
      <a href="#" className='hover:text-pink-500 pt-6 pl-4'>log out</a>
    </div>
  )
}

export default MobileMenu