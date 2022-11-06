import React from 'react'
import { Link } from 'react-router-dom'

//icons
import { XCircleIcon } from '@heroicons/react/24/outline'

function Chat(props) {
  const {
    uid,
    id,
    url,
    username
  } = props.chat

  return (
    <Link to={`/chats/${id}`} state={{
      id,
      uid,
      url,
      username
    }}>
      <li
        className='rounded-lg flex bg-white p-4 pr-12 relative items-center'
        data-id={id}
      >
        <img
          className='rounded-full w-20 h-20'
          src={url}
          alt={`${username} profile pic`}
        />

        <p className='pl-4 text-slate-700 text-lg'>
          <span className='font-bold'>{username} </span>
        </p>
      </li>
    </Link>)
}

export default Chat