import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// redux
import { useSelector } from 'react-redux'

// hooks
import useLikes from '../hooks/useLikes'
import useBlocks from '../hooks/useBlocks'

// components
import { Tooltip } from 'flowbite-react'
import Modal from '../components/UI/Modal'

//icons
import {
  HeartIcon,
  NoSymbolIcon,
  CheckIcon
} from '@heroicons/react/24/solid'

function UserProfileControls(props) {
  const [noUser, setNoUser] = React.useState(false)
  const {
    like,
    setLike,
    isSubmitting,
    submitError,
    submitLike
  } = useLikes(props.youLikeUser)

  const {
    blockUser,
    isSubmittingBlock,
    submitBlockError
  } = useBlocks()

  const navigate = useNavigate()
  const location = useLocation()
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState('')


  // redux
  const { accessToken, profilePic } = useSelector((slices) => slices.auth)

  React.useEffect(() => {
    setLike(props.youLikeUser)
  }, [])

  function handleLikes(likeVal) {
    if (!profilePic) {
      setModalIsOpen(true)
      setModalContent('Please, add a profile picture to like other users.')
      return
    }
    submitLike({
      accessToken,
      method: likeVal ? 'post' : 'delete',
      data: { profileId:  props.profileId }
    })
  }

  React.useEffect(() => {
    if (isSubmitting) return
    if (!isSubmitting && submitError) {
      setNoUser(true)
      setModalIsOpen(true)
      setModalContent(`User doesn't exist anymore`)
    }
  }, [isSubmitting, submitError])

  function handleBlocks(blockVal) {
    blockUser({ profileId:  props.profileId })

    if (location.pathname === '/') {
      props.setProfiles(prev => {
        return prev.filter(u => u.id !== props.profileId)
      })
    } else {
      setModalIsOpen(true)
      setModalContent(`User has been ${blockVal}`)
    }
    // console.log(`user has been ${blockVal}`)
  }

  function closeModalHandler() {
    // console.log(location)
    if (!profilePic) {
      setModalIsOpen(false)
      navigate('/edit', { replace: true })
    } else if (noUser && location.pathname === '/') {
      // When the user that is on the profile list page (/)
      props.setProfiles(prev => {
        return prev.filter(u => u.id !== props.profileId)
      })
      setNoUser(false)
      setModalIsOpen(false)
    } else if (location.pathname != '/') {
      // When the user that is on a given profile page (profiles/3)
      setModalIsOpen(false)
      navigate('/', { replace: true }) // what was this for??
    }
  }

  return (
    <div className='flex space-x-5 justify-center items-center mt-3' data-uid={props.toUser}>
      {modalIsOpen &&
        (<Modal closeModal={closeModalHandler}>
          <CheckIcon className='inline w-6 text-green-500 -mt-2'/>{modalContent}
        </Modal>)
      }
      <Tooltip content={`${like ? 'unlike' : 'like'}`} placement='top-end'>
        <HeartIcon
          className={`w-10 ${like ? 'text-red-500' : 'text-gray-400'} ${isSubmitting && 'animate-spin'} cursor-pointer hover:scale-125`}
          onClick={() => handleLikes(!like)}
        />
      </Tooltip>

      <Tooltip content='Block' placement='top-start'>
        <NoSymbolIcon
          data-tooltip-target="tooltip-light"
          className='w-9 text-gray-400 cursor-pointer hover:scale-125 hover:text-black'
          onClick={() => handleBlocks('blocked')}
        />
      </Tooltip>

      <p
        className='text-sm text-slate-400 underline hover:text-red-600 hover:cursor-pointer hover:scale-110'
        onClick={() => handleBlocks('reported')}
      >report</p>
    </div>
  )
}

export default UserProfileControls