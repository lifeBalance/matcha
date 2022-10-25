import React from 'react'

function useDeletePics() {
  const [deletePics, setDeletePics] = React.useState([])

  function handleRemovePic(e) {
    const picName = e.target?.previousSibling?.getAttribute('src')

    if (picName) console.log(picName) // testing

    setDeletePics(prevState => {
      return prevState.filter(pic => pic !== picName)
    })
  }

  return {
    deletePics,
    setDeletePics,
    handleRemovePic
  }
}

export default useDeletePics