import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { unescape } from 'lodash'

// components
import { Carousel, Tooltip } from 'flowbite-react'

//icons
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  HandThumbDownIcon,
  NoSymbolIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid'

// hooks
import useGetProfile from '../hooks/useGetProfile'

// redux
import { useSelector } from 'react-redux'

function Profile() {
  const [user, setUser] = React.useState(false)
  const { isLoggedIn, accessToken } = useSelector((slices) => slices.auth)
  const navigate = useNavigate()

  const { gettingProfile, errorGettingProfile, getProfile } = useGetProfile()

  function setUserState(data) {
    setUser({
      id: data.id,
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      age: parseInt(data.age),
      gender: parseInt(data.genderValue),
      preferences: parseInt(data.preferencesValue),
      bio: unescape(data.bioValue),
      pics: data.pics,
    })
  }

  // Redirect if the user is NOT logged in
  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })
    else getProfile('get', accessToken, null, (data) => setUserState(data))
  }, [isLoggedIn])

  let gender
  if (user.gender === 0) gender = '🍑 (Female)'
  else if (user.gender === 1) gender = '🍆 (Male)'
  else gender = ' 🙅 (Non-binary)'

  let preferences
  if (user.preferences === 0) preferences = '🍑 (Females)'
  else if (user.gender === 1) preferences = '🍆 (Males)'
  else preferences = '🍆 and 🍑 (Males and Females 😏)'

  return (
    <>
      {gettingProfile && !errorGettingProfile && !user && <p>Loading...</p>}

      {!gettingProfile && errorGettingProfile && !user && (
        <p>{errorGettingProfile}</p>
      )}
      {!errorGettingProfile && !gettingProfile && user && (
        <div
          className='bg-white p-4 rounded-lg my-8 mx-4 max-w-2xl'
          id={user.userName}
        >
          <h1 className='text-gray-700 text-2xl font-bold text-center pt-6 pb-8'>
            {user.userName}
          </h1>

          <div className='h-96 bg-gray-800 rounded-lg mx-auto'>
            {user.pics.length > 0 ? (
              <Carousel slide={false}>
                {user.pics &&
                  user.pics.length > 0 &&
                  user.pics.map((pic, idx) => (
                    <img
                      key={Math.random()}
                      src={`/uploads/${user.id}/${pic}`}
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
              <span className='font-semibold'>Rated: </span>12 ⭐
            </p>
            <p className='pb-8'>
              <span className='font-semibold'>Bio: </span>
              {user.bio}
            </p>
            <Link
              to='/settings'
              className='block w-full px-3 py-2 rounded-md bg-black text-white text-center hover:opacity-80 mx-auto'
            >
              Profile Settings
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
