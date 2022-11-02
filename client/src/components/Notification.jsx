import React from 'react'

//icons
import {
  UserCircleIcon,
} from '@heroicons/react/24/solid'

import {
  EyeIcon,
} from '@heroicons/react/24/outline'

function Notification(props) {
  const {
    id,
    type,
    to_uid,
    from_uid
  } = props.notif
  console.log(props.notif);

  /*  Better pass this fn to a useViews hook, so that only
    in case of successful Response, a notification is sent. */
  function onCloseNotif(e) {
    console.log('closing notif')
  }

  let typeElem
  switch (type) {
    case 0:
      typeElem = `${from_uid} unliked you!`
      break;
    case 1:
      typeElem = `${from_uid} checked your profile!`
      break;
    case 2:
      typeElem = `${from_uid} liked you!`
      break;
    case 3:
      typeElem = `${from_uid} liked you back!`
      break;
  }

  return (
    <li
      className='rounded-lg flex w-full bg-white p-4'
      data-id={id}
    >
      {typeElem}
    </li>
  )
}

export default Notification