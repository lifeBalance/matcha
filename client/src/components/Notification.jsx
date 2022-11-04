import React from 'react'

//icons
import { XCircleIcon } from '@heroicons/react/24/outline'

function Notification(props) {
  const {
    id,
    content
  } = props.notif
  console.log(props);

  let msg
  switch (content.type) {
    case 'unlike':
      msg = `unliked you!`
      break;
    case 'view':
      msg = `checked your profile!`
      break;
    case 'like':
      msg = `liked you!`
      break;
    case 'match':
      msg = `liked you back!`
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
        <span className='font-bold'>{content.username} </span>
        {msg}
      </p>
    </li>
  )
}

export default Notification