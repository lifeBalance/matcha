import React from 'react'

// components
import { Collapse } from 'react-collapse'
import { Carousel } from 'flowbite-react'
import UserProfileControls from '../components/UserProfileControls'

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
    rated,
    age,
    gender,
    prefers,
    pics
  } = props.profile
  // console.log(JSON.stringify(props.profile)) // testing
  const [isCollapsed, setIsCollapsed] = React.useState(true)

  let genderElem = 'Non-binary'
  if (gender === 1) genderElem = 'Male'
  else if (gender === 0) genderElem = 'Female'

  let prefersElem = 'Males and Females'
  if (prefers === 0) prefersElem = 'Females'
  else if (prefers === 1) prefersElem = 'Males'

const isOnline = 0 // PLACEHOLDER
  return (
    <li className='md:rounded-lg flex flex-col w-[360px] bg-black'>
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
            <UserCircleIcon className='w-[80%] text-white'/>
          </div>
        )}

      <div className={`flex justify-between bg-black ${isCollapsed && 'md:rounded-b-lg'}`}>
        <p className='text-white text-center font-bold p-4 flex items-center'>
          <span className={`w-4 h-4 inline-block rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>{username}
        </p>

        <EyeIcon
          className='text-white w-8 inline mr-4 hover:text-blue-400 hover:scale-110 hover:animate-pulse active:text-fuchsia-400'
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <Collapse isOpened={!isCollapsed} >
        <div className="flex flex-col p-4 bg-white md:rounded-b-lg border border-3 border-black">
        {/* Gotta work on RANKING and LOCATION */}
          <p><span className='text-slate-700 font-semibold'>Rated:</span> {rated}</p>
          <p><span className='text-slate-700 font-semibold'>Age:</span> {age}</p>
          <p><span className='text-slate-700 font-semibold'>Gender:</span> {genderElem}</p>
          <p><span className='text-slate-700 font-semibold'>Prefers:</span> {prefersElem}</p>
          <p><span className='text-slate-700 font-semibold'>Distance:</span> 69 km. away</p>
          <p><span className='text-slate-700 font-semibold'>Tags:</span> 69 km. away</p>
          <UserProfileControls 
              youLikeUser={true}
              userLikesYou={true}
            />
        </div>
      </Collapse>
    </li>
  )
}

export default UserMiniCard