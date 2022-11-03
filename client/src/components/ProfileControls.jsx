import React from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'

// hooks
import useLikes from '../hooks/useLikes'

// components
import { Tooltip } from 'flowbite-react'

//icons
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  HandThumbDownIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/solid'

function UserProfileControls(props) {
  const {
    youLikeUser,
    userLikesYou,
  } = props

  // redux
  const {
    accessToken
  } = useSelector((slices) => slices.auth)

  const {
    isSubmitting,
    submitError,
    submitLike
  } = useLikes()

  function notify(data) {
    if (data.type === 'match') {
      return props.notify({
        id:               data.id,
        type:             data.type,
        from:             data.from,
        to:               data.to,
        from_username:    data.from_username,
        from_profilePic:  data.from_profilePic,
        to_username:      data.to_username,
        to_profilePic:    data.to_profilePic
      })
    }

    props.notify({
      id:         data.id,
      to:         data.to,
      content: {
        type:       data.content.type,
        from:       data.content.from,
        username:   data.content.username,
        profilePic: data.content.profilePic
      }
    })
  }

  function handleLikes(likeVal) {
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