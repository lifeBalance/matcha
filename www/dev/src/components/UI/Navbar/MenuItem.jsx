import React from 'react'

function MenuItem(props) {
  return (
    <div className='group'>
      <a href='#'>{props.title}</a>
      <div className='mx-2 group-hover:border-b group-hover:border-blue-50'></div>
    </div>
  )
}

export default MenuItem