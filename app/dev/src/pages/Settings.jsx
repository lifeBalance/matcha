import React from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'

// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { unescape } from 'lodash'

// components
import { Carousel } from 'flowbite-react'

//icons
import {
  UserCircleIcon,
} from '@heroicons/react/24/solid'

// hooks
import useGetProfile from '../hooks/useGetProfile'

// redux
import { useSelector } from 'react-redux'

function Settings() {
  const [user, setUser] = React.useState(null)
  const { isLoggedIn, accessToken, uid } = useSelector((slices) => slices.auth)
  const navigate = useNavigate()
  const {
    error,
    isLoading,
    getProfile
  } = useGetProfile()

  // console.log('idParams: '+ idParams);
  function setSettings(data) {
    setUser({
      userName:     data.username,
      firstName:    data.firstname,
      lastName:     data.lastname,
      email:        data.email,
      age:          data.age,
      rated:        69, // hardcode for now
      gender:       data.gender,
      preferences:  data.prefers,
      bio:          unescape(data.bio),
      pics:         data.pics,
    })
  }

  // Redirect if the user is NOT logged in
  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })
    else getProfile({
      url: '/settings',
      // The backend will extract the UID from the accessToken
      accessToken,
      setUserState: setSettings
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
          <span className='font-semibold'>Email: </span>
          {user.email}
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

        <Link
          to='/edit'
          className='block w-full px-3 py-2 rounded-md bg-black text-white text-center hover:opacity-80 mx-auto'
        >
          Edit Profile Settings
        </Link>
      </div>
    </div>
  )
}

export default Settings
