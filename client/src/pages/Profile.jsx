import React from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { unescape } from 'lodash'

// components
import UserProfileControls from '../components/ProfileControls'
import { Carousel } from 'flowbite-react'

//icons
import {
  UserCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid'

// hooks
import useGetProfile from '../hooks/useGetProfile'
import useViews from '../hooks/useViews'

// redux
import { useSelector } from 'react-redux'

function Profile() {
  const [user, setUser] = React.useState(null)
  const {
    isLoggedIn,
    isLoggingIn,
    accessToken
  } = useSelector((slices) => slices.auth)
  const navigate = useNavigate()
  const {
    error,
    isLoading,
    getProfile
  } = useGetProfile()

  let location = useLocation()
  const params = useParams()
  
  const {
    isSubmitting,
    submitError,
    submitView
  } = useViews()
  
  React.useEffect(() => {
    console.log(`visiting profile ${params.id} (${typeof params.id})`);
    submitView({
      accessToken,
      // backend expects the 'to' property to be a number...
      data: { to: parseInt(params.id) }
    })
  }, [])

  function setProfile(data) {
    setUser({
      profileId:    data.profile.id,
      userName:     data.profile.username,
      firstName:    data.profile.firstname,
      lastName:     data.profile.lastname,
      online:       data.profile.online,
      lastSeen:     data.profile.last_seen,
      rated:        data.profile.rated,
      age:          data.profile.age,
      gender:       data.profile.gender,
      preferences:  data.profile.prefers,
      bio:          unescape(data.profile.bio),
      youLikeUser:  data.profile.you_like_user,
      tags:         data.profile.tags,
      pics:         data.profile.pics,
      location:     data.profile.location
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

  let gender = 'Non-binary'
  if (user?.gender === 0) gender = 'Female'
  else if (user?.gender === 1) gender = 'Male'

  let preferences = 'Males and Females'
  if (user?.preferences === 0) preferences = 'Females'
  else if (user?.preferences === 1) preferences = 'Males'

  // CONTENT
  if (isLoading && !error) {
    // Spinner
    return (
      <div className='flex justify-center items-center py-20'>
        <ArrowPathIcon className='inline w-30 text-white animate-spin' />
      </div>)
  } else if (!isLoading && error) {
    return (<p className='text-4xl text-white pt-20'>{error}</p>)
  } else if (user) {
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
                user.pics.map(pic => (
                  <img
                    key={Math.random()}
                    src={pic}
                    className='object-cover h-96 w-96'
                  />
                ))}
            </Carousel>
          ) : (
            <div className='flex items-center justify-center h-96 bg-slate-700 md:rounded-t-lg'>
              <UserCircleIcon className='w-[80%] text-white' />
            </div>
          )}
        </div>

        <div className='flex justify-between bg-black items-center'>
          <p className='text-white text-center font-bold text-xl p-4 flex items-center'>
            <span className={`w-4 h-4 inline-block rounded-full mt-1 mr-1 ${user.online ? 'bg-green-500' : 'bg-slate-500'}`}></span>{user.userName}
          </p>
        </div>

        <div className='bg-white rounded-lg p-4 text-xl text-gray-700 space-y-3 flex flex-col max-w-sm md:border md:border-3 md:border-black border-none'>
          <p>
            <span className='font-semibold'>Full name:</span> {user.firstName}{' '}
            {user.lastName}
          </p>

          <p>
            <span className='font-semibold'>Age: </span>
            {user.age}
          </p>

          <p>
            <span className='font-semibold'>Gender: </span>
            {gender}
          </p>

          <p>
            <span className='font-semibold'>Rate: </span>{user.rated}%
          </p>

          <p>
            <span className='font-semibold'>Prefers: </span>
            {preferences}
          </p>

          <p>
            <span className='font-semibold'>Location: </span>
            {user.location} km away from you
          </p>

          <p className='flex flex-wrap'>
            <span className='text-slate-700 font-semibold'>Tags:</span>
            {user.tags.map(t => (
              <span key={Math.random()} className='mx-1 px-2 bg-slate-300 rounded-lg shadow-md break-keep'>{t}</span>
            ))}
          </p>

          {!user.online && <p className=''>
            <span className='font-semibold'>Last seen: </span>
            {user.lastSeen}
          </p>}

          <p className=''>
            <span className='font-semibold'>Bio: </span>
            {user.bio}
          </p>

          <UserProfileControls
            profileId={user.profileId}
            youLikeUser={user.youLikeUser}
          />
        </div>
      </div>
    )
  }
}

export default Profile
