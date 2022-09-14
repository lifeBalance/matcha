import React from 'react'

// components
import Burger from './Burger'
import Logo from './Logo'
import MenuItem from './MenuItem'
import MobileMenu from './MobileMenu'

// Redux
import { useSelector } from 'react-redux'

function Navbar() {
  const isOpen = useSelector(slices => slices.burger.burgerIsOpen)

  return (
    <nav className='flex justify-between items-center bg-black py-3 px-8'>
      <Logo styles='text-6xl font-bold font-logo text-white' />

      <div className='hidden md:flex md:space-x-8 text-white'>
        <MenuItem title='users' route='users' />
        <MenuItem title='test' route='test' />
      </div>

      <Burger />

      {isOpen && <MobileMenu />}
    </nav>
  )
}

export default Navbar
