import React from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { delNotif } from '../store/notifSlice'

//icons
import { XCircleIcon } from '@heroicons/react/24/outline'

function Notification(props) {
  // Redux
  const dispatch = useDispatch()
  const { accessToken } = useSelector(slices => slices.auth)

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

  function handleDeleteNotif(e) {
    console.log(e.currentTarget.parentElement.getAttribute('data-id'))

    const id = e.currentTarget.parentElement.getAttribute('data-id')
    dispatch(delNotif({
      accessToken,
      notif_id: id
    }))
  }

  return (
    <li
      className='rounded-lg flex bg-white p-4 pr-12 relative items-center'
      data-id={id}
    >
      <XCircleIcon
        className='absolute top-2 right-2 w-8 h-8 text-slate-400 hover:text-red-600 hover:scale-110' 
        onClick={handleDeleteNotif}
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