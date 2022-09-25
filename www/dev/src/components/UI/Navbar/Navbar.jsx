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
    <nav className='bg-black'>
      <div className="max-w-6xl flex justify-between items-center mx-auto py-3 xl:px-0 md:px-8 px-4">
        <Logo styles='text-6xl font-bold font-logo text-white min-w-fit' />

        <div className='hidden md:flex md:space-x-8 text-white'>
          <MenuItem title='test' route='test' />
          {isLoggedIn ? 
            (<>
              <MenuItem title='users' route='users' />
              <MenuItem title='profile' route='profile' />

              <div className='group'>
                <p onClick={() => dispatch(logout())} className='text-red-500 hover:cursor-pointer'>log out</p>

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
      </div>
    </nav>
  )
}

export default Navbar
