import React from 'react'

function useTextArea(maxLength) {
  const [areaValue, setAreaValue] = React.useState('')
  const [areaWasChanged, setAreaWasChanged] = React.useState(false)
  const [charactersLeft, setCharactersLeft] = React.useState(maxLength)

  function areaChangeHandler(e) {
    setAreaValue(e.target.value)
    setCharactersLeft(maxLength - e.target.value.length)
    setAreaWasChanged(true)
  }

  return {
    areaValue,
    setAreaValue,
    charactersLeft,
    areaWasChanged,
    areaChangeHandler,
  }
}

export default useTextArea