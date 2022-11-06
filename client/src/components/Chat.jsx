import React from 'react'
import { Link } from 'react-router-dom'

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
        className='rounded-lg flex bg-white p-4 pr-12 items-center relative'
        data-id={id}
      >
        {props.updated && <div className="absolute bg-blue-600 w-3 h-3 top-2 right-2 rounded-full animate-pulse"></div>}

        <img
          className='rounded-full w-20 h-20'
          src={url}
          alt={`${username} profile pic`}
        />

        <p className='pl-4 text-slate-700 text-lg'>
          Chat with <span className='font-bold'>{username}</span>
        </p>
      </li>
    </Link>)
}

export default Chat