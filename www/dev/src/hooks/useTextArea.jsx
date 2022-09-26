import React from 'react'

function useTextArea(maxLength, sliceValue, setSliceValue) {
  function TextArea(props) {
    const [charactersLeft, setCharactersLeft] = React.useState(maxLength)
    // const [value, setValue] = React.useState('')

    function areaChangeHandler(e) {
      // setValue(e.target.value)
      setCharactersLeft(maxLength - e.target.value.length)
      setSliceValue(e.target.value)
    }

    return (
      <div className='relative flex flex-col pb-20 w-full '>
        <label
          htmlFor={props.id}
          className='block mb-2 text-2xl font-medium text-white capitalize'
        >
          {props.label}
        </label>
  
        <textarea
          id={props.id}
          rows={props.rows}
          className='bg-white text-black border border-gray-300 text-2xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1'
          value={sliceValue}
          placeholder={props.placeholder}
          maxLength={maxLength}
          onChange={areaChangeHandler}
        ></textarea>
        <p className='text-white ml-2'>You have {charactersLeft} characters left.</p>
      </div>
    )
  }

  return {
    TextArea
  }
}

export default useTextArea