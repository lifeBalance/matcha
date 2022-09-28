import React from 'react'

function useSelect() {
  const [selectValue, setSelectValue] = React.useState('2')
  const [selectWasChanged, setSelectWasChanged] = React.useState(false)

  function selectChangeHandler(e) {
    setSelectValue(e.target.value)
    setSelectWasChanged(true)
  }

  return {
    selectValue,
    setSelectValue,
    selectWasChanged,
    selectChangeHandler,
  }
}

export default useSelect