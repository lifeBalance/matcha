import React from 'react'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleMobileMenu } from '../../../store/burgerSlice'

function Burger() {
  const dispatch = useDispatch()
  const isOpen = useSelector(slices => slices.burger.burgerIsOpen)

  return (
    <div className={`md:hidden${isOpen ? ' open' : ''}`}>
      <button
        id='menu-btn'
        type='button'
        className='z-40 block hamburger focus:outline-none'
        onClick={() => dispatch(toggleMobileMenu())}
      >
        <span className='hamburger-top'></span>
        <span className='hamburger-middle'></span>
        <span className='hamburger-bottom'></span>
      </button>
    </div>
  )
}

export default Burger