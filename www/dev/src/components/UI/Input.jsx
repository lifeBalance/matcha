import React from 'react'

function Input(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full '>
      <div className='flex flex-col w-full'>
        <label className='text-2xl font-medium text-white pb-2 capitalize align-left'>{props.label}</label>

        <input
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 text-2xl max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full'
          placeholder={props.placeholder}
        />
      </div>

      <p className='absolute top-24 left-2'>{props.errorContent}</p>
    </div>
  )
}

export default Input