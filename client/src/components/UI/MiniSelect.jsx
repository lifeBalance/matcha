import React from 'react'

function Select(props) {
  return (
    <div className='relative flex flex-col w-full px-2'>
      <label
        htmlFor={props.for}
        className='block mb-2 text-lg font-medium text-white capitalize'
      >
        {props.label}
      </label>

      <select
        id={props.id}
        value={props.value}
        className='bg-white text-black border border-gray-300 text-2xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1 capitalize'
        onChange={props.onChangeHandler}
      >
        {props.options.map(option => (
          <option
            key={option.value}
            value={option.value}
            className='capitalize'
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
