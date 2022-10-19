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
      <Link to={`profiles/${id}`}>
        <div className="flex">
          {/* <img src="" alt="" /> */}
          {id} {username} {email}
        </div>
      </Link>
    </li>
  )
}

export default UserMiniCard