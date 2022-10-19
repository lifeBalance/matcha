import React from 'react'
import { Link } from 'react-router-dom'

function UserMiniCard(props) {
  const {
    id,
    username,
    age,
    gender,
    prefers,
    profilePic
  } = props.profile
  // console.log(JSON.stringify(props.profile)) // testing

  let genderElem = '🙅 (Non-binary)'
  if (gender === 1) genderElem = '🍆 (Male)'
  else if (gender === 0) genderElem = '🍑 (Female)'

  let prefersElem = '🍆 and 🍑 (Males and Females 😏)'
  if (prefers === 0) prefersElem = '🍑 (Females)'
  else if (prefers === 1) prefersElem = '🍆 (Males)'

  return (
    <li className='bg-white rounded-lg'>
      <Link to={`profiles/${id}`}>
        <div className='flex'>
          <img src={profilePic} className='rounded-l-lg h-40 w-40 object-cover' alt={`${username} profile picture`} />
          <div className="flex flex-col p-4">
            {/* Gotta work on RANKING and LOCATION */}
            <p className='text-center font-bold'>{username} ⭐ <span className='font-normal'>69</span></p>
            <p>Age: {age}</p>
            <p>Gender: {genderElem}</p>
            <p>Prefers: {prefersElem}</p>
            <p>Distance: 69 km. away</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default UserMiniCard