import React from 'react'

// router
import { Link } from 'react-router-dom'

// icons
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'

import { useSelector, useDispatch } from 'react-redux'
import { closeMobileMenu } from '../../../store/burgerSlice'
import { logout } from '../../../store/authSlice'

function MobileMenu() {
  // redux
  const isLoggedIn = useSelector((slices) => slices.auth.isLoggedIn)
  const dispatch = useDispatch()

  function logoutHandler() {
    dispatch(logout())
    dispatch(closeMobileMenu()) 
  }

  return (
    <div
      id='menu'
      className='absolute top-20 botton-0 left-0 flex flex-col self-end w-full min-h-screen py-1 px-12 pt-8 space-y-9 divide-y-2 divide-pink-500 text-white uppercase bg-black bg-opacity-75 z-10 backdrop-blur-sm'
      onClick={() => dispatch(closeMobileMenu())}
    >
      <Link
        to='/test'
        className='hover:text-pink-500 pt-6 pl-4'
        onClick={() => dispatch(closeMobileMenu())}
      >
        test
      </Link>

      {isLoggedIn ? (
        <>
          <Link
            to='/users'
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={() => dispatch(closeMobileMenu())}
          >
            users
          </Link>

          <Link
            to='/profile'
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={() => dispatch(closeMobileMenu())}
          >
            <UserCircleIcon className='inline text-blue-500 w-6 -mt-1 mr-2' />
            profile
          </Link>

          <Link
            to=''
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={logoutHandler}
          >
            <ArrowRightOnRectangleIcon className='inline text-red-500 w-6 -mt-1 mr-2 hover:cursor-pointer' />
            log out
          </Link>
        </>
      ) : (
        <>
          <Link
            to='/login'
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={() => dispatch(closeMobileMenu())}
          >
            <ArrowLeftOnRectangleIcon className='inline text-green-500 w-6 -mt-1 mr-2' />
            login
          </Link>

          <Link
            to='/signup'
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={() => dispatch(closeMobileMenu())}
          >
            <UserPlusIcon className='inline text-orange-500 w-6 -mt-1 mr-2' />
            signup
          </Link>
        </>
      )}
    </div>
  )
}

export default MobileMenu
