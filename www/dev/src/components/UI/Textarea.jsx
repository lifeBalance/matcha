import React from 'react'

function Textarea(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full '>
      <label
        htmlFor={props.for}
        className='block mb-2 text-2xl font-medium text-white capitalize'
      >
        {props.label}
      </label>

      <textarea
        id={props.id}
        rows={props.rows}
        className='bg-white text-black border border-gray-300 text-2xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1'
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      ></textarea>
    </div>
  )
}

export default Textarea
