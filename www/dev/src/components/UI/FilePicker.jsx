import React from 'react'

function FilePicker(props) {
  return (
    <div className='relative flex flex-col pb-20 w-full '>
      <label className="block mb-2 text-2xl font-medium text-white capitalize"
      htmlFor="file_input">{props.label}</label>

      <input className="block w-full text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none" aria-describedby="file_input_help" id="file_input" type="file" />

      <p className="mt-1 text-sm text-gray-100" id="file_input_help">PNG, JPG or GIF (MAX. 800 x 400px)</p>
    </div>
  )
}

export default FilePicker