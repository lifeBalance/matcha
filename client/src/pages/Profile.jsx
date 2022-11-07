import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { unescape } from 'lodash'

// components
import UserProfileControls from '../components/ProfileControls'
import { Carousel } from 'flowbite-react'

//icons
import {
  UserCircleIcon,
} from '@heroicons/react/24/solid'

// hooks
import useGetProfile from '../hooks/useGetProfile'

// redux
import { useSelector } from 'react-redux'

function Profile() {
  const [user, setUser] = React.useState(null)
  const {
    isLoggedIn,
    isLoggingIn,
    accessToken,
    uid
  } = useSelector((slices) => slices.auth)
  const navigate = useNavigate()
  const {
    error,
    isLoading,
    getProfile
  } = useGetProfile()

  let location = useLocation()

  function setProfile(data) {
    setUser({
      userName:     data.profile.username,
      firstName:    data.profile.firstname,
      lastName:     data.profile.lastname,
      age:          data.profile.age,
      rated:        69, // hardcode for now
      gender:       data.profile.gender,
      preferences:  data.profile.prefers,
      bio:          unescape(data.profile.bio),
      youLikeUser:  data.profile.you_like_user,
      pics:         data.profile.pics
    })
  }

  /* When the page loads (or when the user logs out), we run the hook */
  React.useEffect(() => {
    if (isLoggingIn) return
    if (!isLoggingIn && !isLoggedIn) navigate('/', { replace: true })
    if (!isLoggingIn && isLoggedIn && accessToken) getProfile({
      url: location.pathname,
      accessToken,
      setUserState: setProfile
    })
  }, [isLoggingIn, isLoggedIn, accessToken])

  let gender = ' 🙅 (Non-binary)'
  if (user?.gender === 0) gender = '🍑 (Female)'
  else if (user?.gender === 1) gender = '🍆 (Male)'

  let preferences = '🍆 and 🍑 (Males and Females 😏)'
  if (user?.preferences === 0) preferences = '🍑 (Females)'
  else if (user?.preferences === 1) preferences = '🍆 (Males)'

  // CONTENT
  if (isLoading && !error)
    return (<p>Loading...</p>)
  else if (!isLoading && error)
    return (<p className='text-4xl text-white pt-20'>{error}</p>)
  else if (user)
  return (
    <div
      className='bg-white sm:rounded-lg sm:my-8 max-w-screen-sm'
      id={user.userName}
    >
      <div className='h-96 w-auto bg-gray-800 sm:rounded-t-lg flex'>
        {user.pics && user.pics.length > 0 ? (
          <Carousel slide={false}>
            {user.pics &&
              user.pics.length > 0 &&
              user.pics.map((pic, idx) => (
                <img
                  key={Math.random()}
                  src={pic}
                  className='object-cover h-96 w-96'
                />
              ))}
          </Carousel>
        ) : (
          <UserCircleIcon className='text-white w-[80%] justify-center mx-auto' />
        )}
      </div>

      <div className='p-8 text-xl text-gray-700 space-y-3 flex flex-col max-w-sm'>
        <h1 className='text-gray-700 text-2xl font-bold text-center'>
          {user.userName}
        </h1>

        <p>
          <span className='font-semibold'>Full name:</span> {user.firstName}{' '}
          {user.lastName}
        </p>

        <p>
          <span className='font-semibold'>Gender:</span>
          {gender}
        </p>

        <p>
          <span className='font-semibold'>Prefers: </span>
          {preferences}
        </p>

        <p>
          <span className='font-semibold'>Age: </span>
          {user.age}
        </p>

        <p>
          <span className='font-semibold'>Rated: </span>{user.rated} ⭐
        </p>

        <p className='pb-8'>
          <span className='font-semibold'>Bio: </span>
          {user.bio}
        </p>

        <UserProfileControls 
          youLikeUser={user.youLikeUser}
        />
      </div>
    </div>
  )
}

export default Profile
