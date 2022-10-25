import React from 'react'

import { XCircleIcon } from '@heroicons/react/24/outline'

function FilePicker(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full px-2'>
      <label
        className='block mb-2 text-2xl font-medium text-white capitalize'
        htmlFor='file_input'
      >
        {props.label} <span className='text-lg'>({props.filesLeft} files left)</span>
      </label>

      <input
        className='block w-full text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none'
        aria-describedby='file_input_help'
        id='file_input'
        type='file'
        name={props.name}
        multiple
        onChange={props.onChangeFilePicker}
      />
      <ul className='bg-white mx-2 divide-y rounded-b-md'>
        {props.files &&
          props.files.map((file) => (
            <li key={Math.random()} className='group'>
              <span onClick={() => props.onClickHandler(file.name)} className='p-2'>
                <XCircleIcon
                  className='inline w-9 text-orange-300 hover:text-red-500'
                />
              </span>
              {file.name}
            </li>
          ))}
      </ul>

      <p
        className='mt-1 ml-4 text-sm text-gray-100'
        id='file_input_help'
      >
        PNG, JPG or GIF (MAX. 2MB)
      </p>
    </div>
  )
}

export default FilePicker
