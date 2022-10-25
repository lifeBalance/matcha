import React from 'react'

import { NavLink, useLocation } from 'react-router-dom'

// components
import Burger from './Burger'
import Logo from './Logo'
import MenuItem from './MenuItem'
import MobileMenu from './MobileMenu'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../store/authSlice'

//icons
import { UserCircleIcon } from '@heroicons/react/24/solid'
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

function Navbar(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  const isOpen = useSelector(slices => slices.burger.burgerIsOpen)
  const { isLoggedIn, profilePic } = useSelector(slices => slices.auth)

  // console.log('Navbar: '+profilePic)  // testing
  let imgElem = !profilePic ?
    <UserCircleIcon className='w-12 hover:text-blue-400' />
    :
    <img src={profilePic} alt="" className='rounded-full h-12 w-12 object-cover' />

  return (
    <nav className='bg-black'>
      <div className="max-w-6xl flex justify-between items-center mx-auto py-3 xl:px-0 md:px-8 px-4">
        <Logo styles='text-6xl font-bold font-logo text-white min-w-fit' />

        <div className='hidden md:flex md:space-x-8 text-white items-center'>
          <MenuItem title='test' route='test' />
          {isLoggedIn ? 
            (<>
              <NavLink to='/settings'>
                {imgElem}
              </NavLink>

              <ArrowRightOnRectangleIcon onClick={() => dispatch(logout())} className='text-gray-400 hover:text-red-500 hover:cursor-pointer w-10' />
            </>)
            :
            (<>
              {location.pathname !== '/login' && <NavLink to='login'>
                <ArrowLeftOnRectangleIcon className='text-gray-400 hover:text-green-400 hover:cursor-pointer w-10' />
              </NavLink>}
            </>)
          }
        </div>

        <Burger />

        {isOpen && <MobileMenu />}
      </div>
    </nav>
  )
}

export default Navbar
