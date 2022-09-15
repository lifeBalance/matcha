import React from 'react'

function useInput(validate) {
  const [value, setValue] = React.useState('')
  const [inputHasError, setInputHasError] = React.useState(false)
  const [inputWasTouched, setInputWasTouched] = React.useState(false)

  // Debounce user input
  React.useEffect(() => {
    if (!inputWasTouched) return

    const timerId = setTimeout(() => {
      setInputHasError(!validate(value))
    }, 500);

    return () => {
      clearTimeout(timerId);
    }
    }, [value, inputWasTouched]
  )

  function inputChangeHandler(e) {
    setValue(e.target.value)
    setInputHasError(false)
  }

  function inputBlurHandler(e) {
    setInputHasError(!validate(value))
    setInputWasTouched(true)
  }

  function resetInput() {
    setValue('')
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