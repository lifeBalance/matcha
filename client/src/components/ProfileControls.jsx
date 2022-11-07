import React from 'react'
import { useParams } from 'react-router-dom'

// redux
import { useSelector } from 'react-redux'

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
  // const { youLikeUser } = props
  const {
    like,
    setLike,
    isSubmitting,
    submitError,
    submitLike
  } = useLikes(props.youLikeUser)

  // Extract the id of the 'liked/unliked' user from the url params
  const params = useParams()

  // redux
  const {
    uid,
    accessToken
  } = useSelector((slices) => slices.auth)

  React.useEffect(() => {
    setLike(props.youLikeUser)
  }, [])

  function handleLikes(likeVal) {
    submitLike({
      accessToken,
      method: likeVal ? 'post' : 'delete',
      data: { profileId:  props.profileId }
    })
  }
// console.log('likey: '+like);
  return (
    <div className='flex space-x-5 justify-center items-center mt-3' data-uid={props.toUser}>
      <Tooltip content={`${like ? 'unlike' : 'like'}`} placement='top-end'>
        <HeartIcon
          className={`w-10 ${like ? 'text-red-500' : 'text-gray-400'} ${isSubmitting && 'animate-spin'} cursor-pointer hover:scale-125`}
          onClick={() => handleLikes(!like)}
        />
      </Tooltip>

      <Tooltip content='Block' placement='top-start'>
        <NoSymbolIcon data-tooltip-target="tooltip-light" className='w-9 text-gray-400 cursor-pointer hover:scale-125 hover:text-black' />
      </Tooltip>
    </div>
  )
}

export default UserProfileControls