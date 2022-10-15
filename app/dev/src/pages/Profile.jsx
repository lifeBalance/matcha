import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { unescape } from 'lodash'

// components
import UserProfileControls from '../components/UserProfileControls'
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
  const { isLoggedIn, accessToken, uid } = useSelector((slices) => slices.auth)
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
      pics:         data.profile.pics,
    })
  }

  // Redirect if the user is NOT logged in
  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })
    else getProfile({
      /*  The URL of the request will depend on 'location.pathname', meaning the
        URL in the browser's address bar, something like '/profiles/69' */
      url: location.pathname,
      accessToken,
      setUserState: setProfile
    })
  }, [isLoggedIn])

  let gender
  if (user?.gender === 0) gender = '🍑 (Female)'
  else if (user?.gender === 1) gender = '🍆 (Male)'
  else gender = ' 🙅 (Non-binary)'

  let preferences
  if (user?.preferences === 0) preferences = '🍑 (Females)'
  else if (user?.preferences === 1) preferences = '🍆 (Males)'
  else preferences = '🍆 and 🍑 (Males and Females 😏)'

  // CONTENT
  if (isLoading && !error)
    return (<p>Loading...</p>)
  else if (!isLoading && error)
    return (<p className='text-4xl text-white pt-20'>{error}</p>)
  else if (user)
  return (
    <div
      className='bg-white p-4 rounded-lg my-8 mx-4 max-w-2xl'
      id={user.userName}
    >
      <h1 className='text-gray-700 text-2xl font-bold text-center pt-6 pb-8'>
        {user.userName}
      </h1>

      <div className='h-96 bg-gray-800 rounded-lg mx-auto'>
        {user.pics && user.pics.length > 0 ? (
          <Carousel slide={false}>
            {user.pics &&
              user.pics.length > 0 &&
              user.pics.map((pic, idx) => (
                <img
                  key={Math.random()}
                  src={pic}
                  className=' object-cover h-96 sm:object-contain'
                />
              ))}
          </Carousel>
        ) : (
          <UserCircleIcon className='text-white w-[50%] justify-center mx-auto' />
        )}
      </div>

      <div className='p-8 text-xl text-gray-700 space-y-3 flex flex-col'>
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
          youLikeUser={true}
          userLikesYou={true}
        />
      </div>
    </div>
  )
}

export default Profile
