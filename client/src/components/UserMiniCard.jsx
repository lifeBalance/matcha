import React from 'react'

// redux
import { useSelector } from 'react-redux'

// hooks
import useViews from '../hooks/useViews'

// components
import { Collapse } from 'react-collapse'
import { Carousel } from 'flowbite-react'
import ProfileControls from './ProfileControls'

//icons
import {
  UserCircleIcon,
} from '@heroicons/react/24/solid'

import {
  EyeIcon,
} from '@heroicons/react/24/outline'

function UserMiniCard(props) {
  const {
    id,
    username,
    firstname,
    lastname,
    online,
    last_seen,
    rated,
    age,
    gender,
    prefers,
    pics,
    tags,
    bio,
    you_like_user,
    location
  } = props.profile
  // console.log(JSON.stringify(props.profile)) // testing
  const [isCollapsed, setIsCollapsed] = React.useState(true)

  // redux
  const { accessToken } = useSelector(slices => slices.auth)

  const {
    isSubmitting,
    submitError,
    submitView
  } = useViews()

  /*  Only in case of successful Response,
  a notification is sent. */
  function handleViewProfile() {
    if (isCollapsed) {
      submitView({
        accessToken,
        data: { to: id },
        callback: setIsCollapsed(false)
      })
    } else
      setIsCollapsed(true)
  }

  let genderElem = 'Non-binary'
  if (gender === 1) genderElem = 'Male'
  else if (gender === 0) genderElem = 'Female'

  let prefersElem = 'Males and Females'
  if (prefers === 0) prefersElem = 'Females'
  else if (prefers === 1) prefersElem = 'Males'

  return (
    <li className='md:rounded-lg flex flex-col w-[360px] md:w-96 bg-black'>
        {pics && pics.length > 0 ?
        (<div className='h-96' >
          <Carousel slide={false}>
            {pics.map((pic) => (
              <img
                key={Math.random()}
                src={pic.url}
                className='object-cover h-96'
              />
            ))}
          </Carousel>
        </div>)
        :
        (
          <div className='flex items-center justify-center h-96 bg-slate-700 md:rounded-t-lg'>
            <UserCircleIcon
              className='w-[80%] text-white'
            />
          </div>
        )}

      <div className={`flex justify-between bg-black ${isCollapsed && 'md:rounded-b-lg'}`}>
        <p className='text-white text-center font-bold p-4 flex items-center'>
          <span className={`w-4 h-4 inline-block rounded-full mr-1 ${online ? 'bg-green-500' : 'bg-slate-500'}`}></span>{username}
        </p>

        <EyeIcon
          className='text-white w-8 inline mr-4 hover:text-blue-400 hover:scale-110 hover:animate-pulse active:text-fuchsia-400'
          onClick={handleViewProfile}
        />
      </div>

      <Collapse isOpened={!isCollapsed} >
        <div className="flex flex-col p-4 bg-white md:rounded-b-lg border border-3 border-black space-y-2">
          <p>
            <span className='text-slate-700 font-semibold'>Full Name:</span> 
            {` ${firstname} ${lastname}`}
          </p>

          <p>
            <span className='text-slate-700 font-semibold'>Age:</span> {age}
            <span className='text-slate-700 font-semibold ml-6'>Gender:</span> {genderElem}
            <span className='text-slate-700 font-semibold ml-6'>Rate:</span> {rated}%
          </p>

          <p>
            <span className='text-slate-700 font-semibold'>Prefers:</span> {prefersElem}
          </p>

          <p>
            <span className='text-slate-700 font-semibold'>Location:</span> {location} km away from you
          </p>

          <p className='flex flex-wrap'>
            <span className='text-slate-700 font-semibold'>Tags:</span>
            {tags.map(t => (
              <span key={Math.random()} className='mx-1 px-2 bg-slate-300 rounded-lg shadow-md break-keep'>{t}</span>
            ))}
          </p>

          {!online && (<p>
            <span className='text-slate-700 font-semibold'>Last Seen: </span>
            {last_seen}</p>
          )}

          <p>
            <span className='text-slate-700 font-semibold'>Bio: </span>{bio}
          </p>

          <p className='-mt-4'>report</p>
          <ProfileControls
            youLikeUser={you_like_user}
            profileId={id}
            setProfiles={props.setProfiles}
          />
        </div>
      </Collapse>
    </li>
  )
}

export default UserMiniCard