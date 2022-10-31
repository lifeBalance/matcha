import React from 'react'

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

  return (
    <div className='flex space-x-5 justify-center mt-3'>
      {!youLikeUser && !userLikesYou && (<>
        <Tooltip content='Like' placement='top-end'>
          <HeartIcon className='w-10 text-gray-400 cursor-pointer hover:scale-125'/>
        </Tooltip>
      </>)}

      {youLikeUser && !userLikesYou && (<>
        <Tooltip content='Unmatch' placement='top-end'>
          <HandThumbDownIcon className='w-10 text-gray-400 hover:text-black cursor-pointer hover:scale-125'/>
        </Tooltip>

        <Tooltip content='You like each other' placement='top-center'>
          <HeartIcon className='w-10 text-red-600 hover:scale-90'/>
        </Tooltip>
      </>)}

      {!youLikeUser && userLikesYou && (<>
        <Tooltip content='Like Back!' placement='top-end'>
          <HeartIcon className='w-10 text-green-500 animate-pulse cursor-pointer hover:scale-125'/>
        </Tooltip>
      </>)}

      {youLikeUser && userLikesYou && (<>
        <Tooltip content='Chat' placement='top-end'>
          <ChatBubbleLeftRightIcon className='w-10 text-blue-400 hover:text-blue-500 hover:scale-125'/>
        </Tooltip>

        <Tooltip content='Unlike' placement='top-center'>
          <HandThumbDownIcon className='w-10 text-gray-400 hover:scale-125 hover:text-red-600'/>
        </Tooltip>
      </>)}

      <Tooltip content='Block' placement='top-start'>
        <NoSymbolIcon data-tooltip-target="tooltip-light" className='w-9 text-gray-400 cursor-pointer hover:scale-125 hover:text-black' />
      </Tooltip>
    </div>
  )
}

export default UserProfileControls