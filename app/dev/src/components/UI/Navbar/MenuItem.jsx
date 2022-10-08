import React from 'react'
import { NavLink } from 'react-router-dom'

function MenuItem(props) {
  return (
    <div className='group' onClick={props.onClickHandler}>
      <NavLink to={props.route}>{props.title}</NavLink>
      <div className='mx-2 group-hover:border-b group-hover:border-blue-50'></div>
    </div>
  )
}

export default MenuItem