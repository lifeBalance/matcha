import React from 'react'

function Input(props) {
  return (
    <div className='relative pb-20'>
      <label className='flex flex-col'>
        <span className='text-2xl font-bold text-white pb-2 capitalize'>
          {props.children}
        </span>

        <input
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 text-2xl max-w-xs md:max-w-md placeholder:text-gray-300'
          placeholder={props.placeholder}
        />
      </label>

      <p className='absolute top-24 left-2'>{props.errorContent}</p>
    </div>
  )
}

export default Input