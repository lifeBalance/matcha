import React from 'react'
import { Link } from 'react-router-dom'

function UserMiniCard(props) {
  const {
    username,
    email,
    id
  } = props.user

  return (
    <li className='bg-white p-8 rounded-lg'>
      <Link to={`users/${id}`}>{id} {username} {email}</Link>
    </li>
  )
}

export default UserMiniCard