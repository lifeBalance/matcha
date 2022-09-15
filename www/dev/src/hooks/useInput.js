import React from 'react'

function useInput(validate) {
  const [value, setValue] = React.useState('')
  const [inputHasError, setInputHasError] = React.useState(false)
  const [inputWasChanged, setInputWasChanged] = React.useState(false)

  // Debounce user input
  React.useEffect(() => {
      if (!inputWasChanged) return

      const timerId = setTimeout(() => {
        setInputHasError(!validate(value))
      }, 500);

      return () => {
        clearTimeout(timerId);
      }
    }, [value, inputWasChanged]
  )

  function inputChangeHandler(e) {
    setValue(e.target.value)
    setInputHasError(false)
    setInputWasChanged(true)
  }

  function inputBlurHandler(e) {
    setInputHasError(!validate(value))
    setInputWasChanged(true)
  }

  function resetInput() {
    setValue('')
    setInputWasChanged(false)
  }

  return {
    value,
    inputHasError,
    inputChangeHandler,
    inputBlurHandler,
    resetInput
  }
}

export default useInput