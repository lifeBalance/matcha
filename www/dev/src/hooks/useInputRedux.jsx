import React from 'react'

function useInputRedux(sliceValue, setSliceValue, validate, setSliceInputError) {
  function InputRedux(props) {
    const [inputWasChanged, setInputWasChanged] = React.useState(false)

    function inputChangeHandler(e) {
      setSliceValue(e.target.value)
      setInputWasChanged(true)
      setSliceInputError(!validate(sliceValue))
    }

    function inputBlurHandler(e) {
      setSliceInputError(!validate(sliceValue))
      setInputWasChanged(true)
    }

    // Debounce user input
    React.useEffect(() => {
      if (!inputWasChanged) return

      const timerId = setTimeout(() => {
        setSliceInputError(!validate(sliceValue))
      }, 500);

      return () => {
        clearTimeout(timerId);
      }
    }, [sliceValue, inputWasChanged])

    return (
      <div className='relative flex flex-col pb-20 w-full '>
        <div className='flex flex-col w-full'>
          <label className='text-2xl font-medium text-white pb-2 capitalize align-left'>{props.label}</label>

          <input
            type={props.type}
            value={sliceValue}
            onChange={inputChangeHandler}
            onBlur={inputBlurHandler}
            className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 text-2xl max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full placeholder:capitalize'
            placeholder={props.placeholder}
          />
        </div>
  
        <p className='absolute top-24 left-2 text-white'>{props.errorContent}</p>
      </div>
    )
  }

  return {
    InputRedux,
  }
}

export default useInputRedux