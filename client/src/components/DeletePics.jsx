import React from 'react'

import { XCircleIcon } from '@heroicons/react/24/outline'

function DeletePics(props) {
  return (
    <div className=''>
      <h1 className='text-2xl font-medium text-white pb-2 capitalize align-left pl-2'>Remove Pics</h1>
      <div className='flex flex-wrap justify-evenly'>
        {props.pics.map(pic => (
          <div className='relative group m-2' key={pic}>
            <img src={`${pic}`} className='object-cover w-40 h-40' />
            <XCircleIcon className='w-12 text-white group-hover:text-red-500 absolute top-0 left-0 hover:cursor-pointer' onClick={props.handleRemovePic}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeletePics
