import React from 'react'

function TextArea(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full px-2'>
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
        onChange={props.onChangeHandler}
        value={props.value}
      ></textarea>
      <p className='text-white ml-2'>You have {props.charactersLeft} characters left.</p>
    </div>
  )
}

export default TextArea
