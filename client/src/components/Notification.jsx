import React from 'react'
import { Link } from 'react-router-dom'

//icons
import { XCircleIcon } from '@heroicons/react/24/outline'

function Notification(props) {
  const {
    id,
    type,
    content
  } = props.notif

  let msg
  switch (type) {
    case 'unlike':
      msg = `unliked you!`
      break;
    case 'view':
      msg = `checked your profile!`
      break;
    case 'like':
      msg = `likes you!`
      break;
    case 'match':
      msg = `is a match!`
      break;
    case 'unmatch':
      msg = `unmatched your ass!`
      break;
  }

  return (
    <li
      className='rounded-lg flex bg-white p-4 pr-12 relative items-center'
      data-id={id}
    >
        <XCircleIcon
          className='absolute top-2 right-2 w-8 h-8 text-slate-400 hover:text-red-600 hover:scale-110' 
          onClick={props.deleteNotif}
        />

        <img
          className='rounded-full w-20 h-20'
          src={content.profilePic}
          alt={`${content.username} profile pic`}
        />

        <p className='pl-4 text-slate-700 text-lg'>
          <Link to={`/profiles/${content.from}`}>
            <span className='font-bold hover:text-blue-600'>{content.username} </span>
          </Link>
          {msg}
        </p>
    </li>
  )
}

export default Notification