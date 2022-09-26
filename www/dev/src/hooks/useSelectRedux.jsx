import React from 'react'

function useSelectRedux(sliceValue, setSliceValue) {
  function Select(props) {
    const options = props.options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        className='capitalize'
      >
        {option.label}
      </option>
    ))

    function onChangeHandler(e) {
      setSliceValue(e.target.value)
    }

    return (
      <div className='relative flex flex-col pb-20 w-full '>
        <label
          htmlFor={props.for}
          className='block mb-2 text-2xl font-medium text-white'
        >
          {props.label}
        </label>

        <select
          id={props.id}
          name={props.id}
          value={sliceValue}
          onChange={onChangeHandler}
          className='bg-white text-black border border-gray-300 text-2xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-1 capitalize'
        >
          {options}
        </select>
      </div>
    )
  }
  return {
    Select
  }
}

export default useSelectRedux