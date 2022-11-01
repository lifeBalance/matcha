import React from 'react'

import { Tooltip } from 'flowbite-react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { addNotif } from '../store/notifSlice' 

//icons
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  HandThumbDownIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/solid'

import useLikes from '../hooks/useLikes'

function UserProfileControls(props) {
  const {
    youLikeUser,
    userLikesYou,
  } = props

  // redux
  const dispatch = useDispatch()
  const {
    accessToken
  } = useSelector((slices) => slices.auth)

  const {
    isSubmitting,
    submitError,
    submitLike
  } = useLikes()

  function notify(data) {
    props.notify({
      from: data.fromUser,
      room: data.toUser,
      type: data.like
    })
    dispatch(addNotif(data))
  }

  function handleLikes(likeVal) {
    if (!props.fromUser || !props.toUser) {
      console.log('Woops, no ids bro');
      return
    }
    submitLike({
      accessToken,
      method: likeVal ? 'post' : 'delete',
      data: {
        liker:  props.fromUser,
        liked:  props.toUser,
      },
      callback: notify
    })
  }

  return (
    <div className='flex space-x-5 justify-center items-center mt-3' data-uid={props.toUser}>
      {!youLikeUser && !userLikesYou && (<>
        <Tooltip content='Like' placement='top-end'>
          <HeartIcon
            className='w-10 text-gray-400 cursor-pointer hover:scale-125'
            onClick={() => handleLikes(true)}
          />
        </Tooltip>
      </>)}

      {youLikeUser && !userLikesYou && (<>
        <Tooltip content='Unmatch' placement='top-end'>
          <HandThumbDownIcon
            className='w-10 text-gray-400 hover:text-black cursor-pointer hover:scale-125'
            onClick={() => handleLikes(false)}
          />
        </Tooltip>

        <Tooltip content='You like each other' placement='top-center'>
          <HeartIcon
            className='w-10 text-red-600 hover:scale-90'
            onClick={() => handleLikes(true)}
          />
        </Tooltip>
      </>)}

      {!youLikeUser && userLikesYou && (<>
        <Tooltip content='Like Back!' placement='top-end'>
          <HeartIcon
            className='w-10 text-green-500 animate-pulse cursor-pointer hover:scale-125'
            onClick={() => handleLikes(true)}
          />
        </Tooltip>
      </>)}

      {youLikeUser && userLikesYou && (<>
        <Tooltip content='Chat' placement='top-end'>
          <ChatBubbleLeftRightIcon className='w-10 text-blue-400 hover:text-blue-500 hover:scale-125'/>
        </Tooltip>

        <Tooltip content='Unlike' placement='top-center'>
          <HandThumbDownIcon
            className='w-10 text-gray-400 hover:scale-125 hover:text-red-600'
            onClick={() => handleLikes(false)}
          />
        </Tooltip>
      </>)}

      <Tooltip content='Block' placement='top-start'>
        <NoSymbolIcon data-tooltip-target="tooltip-light" className='w-9 text-gray-400 cursor-pointer hover:scale-125 hover:text-black' />
      </Tooltip>
    </div>
  )
}

export default UserProfileControls