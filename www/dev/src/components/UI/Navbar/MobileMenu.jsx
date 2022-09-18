import React from 'react'

// router
import { NavLink } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { toggleMobileMenu } from '../../../store/burgerSlice'

function MobileMenu() {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(slices => slices.auth.isLoggedIn)

  return (
    <div id="menu" className="absolute top-20 botton-0 left-0 flex flex-col self-end w-full min-h-screen py-1 px-12 pt-8 space-y-9 divide-y-2 divide-pink-500 text-white uppercase bg-black bg-opacity-75 z-10">
      <NavLink to='/test' className='hover:text-pink-500 pt-6 pl-4' onClick={() => dispatch(toggleMobileMenu())}>test</NavLink>

      {isLoggedIn ?
        (<>
          <NavLink to='/profile' className='hover:text-pink-500 pt-6 pl-4' onClick={() => dispatch(toggleMobileMenu())}>profile</NavLink>

          <a href="#" className='hover:text-pink-500 pt-6 pl-4'>log out</a>
        </>)
        :
        (<>
          <NavLink to='/login' className='hover:text-pink-500 pt-6 pl-4' onClick={() => dispatch(toggleMobileMenu())}>login</NavLink>

          <NavLink to='/signup' className='hover:text-pink-500 pt-6 pl-4' onClick={() => dispatch(toggleMobileMenu())}>signup</NavLink>
        </>)
      }
    </div>
  )
}

export default MobileMenu