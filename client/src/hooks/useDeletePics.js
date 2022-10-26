import React from 'react'

function useDeletePics() {
  const [existingPics, setExistingPics] = React.useState([])
  const [deletePics, setDeletePics] = React.useState([])
  const [deletePicsWasChanged, setDeletePicsWasChanged] = React.useState(false)

  function handleRemovePic(e) {
    e.preventDefault()
    // console.log(e.currentTarget?.parentElement.firstElementChild.getAttribute('src'))
    const picName = e.currentTarget?.parentElement.firstElementChild.getAttribute('src')

    if (picName) {
      console.log(picName) // testing

      // The array of pics that should be deleted in the backend.
      setDeletePics(prevState => {
        return [...prevState, picName]
      })

      // The array of pics in the backend.
      setExistingPics(prevState => {
        return prevState.filter(pic => pic !== picName)
      })
      console.log(deletePics) // testing
      setDeletePicsWasChanged(true)
    }
  }

  return {
    existingPics,
    setExistingPics,
    deletePics,
    setDeletePics,
    handleRemovePic,
    deletePicsWasChanged
  }
}

export default useDeletePics