import React from 'react'

// components
import Burger from './Burger'
import Logo from './Logo'
import MenuItem from './MenuItem'
import MobileMenu from './MobileMenu'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../store/authSlice'


function Navbar() {
  const dispatch = useDispatch()
  const isOpen = useSelector(slices => slices.burger.burgerIsOpen)
  const isLoggedIn = useSelector(slices => slices.auth.isLoggedIn)

  return (
    <nav className='flex justify-between items-center bg-black py-3 px-8'>
      <Logo styles='text-6xl font-bold font-logo text-white' />

      <div className='hidden md:flex md:space-x-8 text-white'>
        <MenuItem title='test' route='test' />
        {isLoggedIn ? 
          (<>
            <MenuItem title='users' route='users' />
            <MenuItem title='profile' route='profile' />

            <div className='group'>
              <a href="#" onClick={() => dispatch(logout())} className='text-red-500'>log out</a>

              <div className='mx-2 group-hover:border-b group-hover:border-red-500'></div>
            </div>
          </>)
          :
          (<>
            <MenuItem title='login' route='login' />
          </>)
        }
      </div>

      <Burger />

      {isOpen && <MobileMenu />}
    </nav>
  )
}

export default Navbar
