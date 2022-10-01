import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// components
import {Carousel, Tooltip} from 'flowbite-react'

//icons
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  HandThumbDownIcon,
  NoSymbolIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid'

// hooks
import useGetUser from '../hooks/useGetUser'

// redux
import { useSelector } from 'react-redux'

const initialState = {
  userName: '',
  firstName: '',
  lastName: '',
  bio: '',
  gender: '',
  preferences: '',
  pics: []
}

function User() {
  const [user, setUser] = React.useState(false)
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const navigate = useNavigate()
  const { id } = useParams()

  function setUserState(data) {
    setUser({
      id: data.id,
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      gender: data.gender,
      preferences: data.prefers,
      pics: data.pics
    })
  }

  const {
    userIsLoading,
    errorGettingUser,
    getUser
  } = useGetUser()

  // Redirect if the user is NOT logged in
  React.useEffect(() => {
    if (!isLoggedIn)
      navigate('/', {replace: true})
  }, [isLoggedIn])

  React.useEffect(() => {
    if (isLoggedIn) {
      getUser(id, accessToken, setUserState)
    } else {
      navigate('/', {replace: true})
    }
  }, [isLoggedIn])

  let gender
  if (user.gender === 0)
    gender = '🍑 Female'
  else if (user.gender === 1)
    gender = '🍆 Male'
  else
    gender = '🙅 Non-binary'
    
  let preferences
  if (user.preferences === 0)
    preferences = '🍑 Females'
  else if (user.gender === 1)
    preferences = '🍆 Males'
  else
    preferences = '🍆 Males and 🍑 Females (😏)'

  let youLikeUser = true
  let userLikesYou = true
  return (
    <>
      {!errorGettingUser && !userIsLoading && user && (<div className='bg-white p-4 rounded-lg my-8 mx-4' id={user.userName}>
          <h1 className='text-gray-700 text-2xl font-bold text-center my-3'>{user.userName}</h1>

          <div className="h-96 lg:h-[700px] xl:h-[800px] bg-gray-800 rounded-lg mx-auto">
            {user.pics.length > 0 ?
            (<Carousel slide={false}>
              {user.pics && user.pics.length > 0 && user.pics.map((pic, idx) => (
                <img key={Math.random()} src={`/uploads/${user.id}/${pic}`} />
              ))}
            </Carousel>) :
            <UserCircleIcon className='text-white w-1/2 mx-auto'/>}
          </div>

          <div className="p-8 text-xl text-gray-700 space-y-3">
            <p><span className='font-semibold'>Full name:</span> {user.firstName} {user.lastName}</p>
            <p><span className='font-semibold'>Gender:</span>{gender}</p>
            <p><span className='font-semibold'>Prefers: </span>{preferences}</p>
            <p><span className='font-semibold'>Age: </span>44</p>
            <p><span className='font-semibold'>Bio: </span>{user.bio}</p>
          </div>

          <div className='flex space-x-5 justify-center mb-4'>
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
      </div>)}

      {userIsLoading && !errorGettingUser && !user && <p>Loading...</p>}
      {!userIsLoading && errorGettingUser && !user && <p>{errorGettingUser}</p>}
    </>
  )
}

export default User