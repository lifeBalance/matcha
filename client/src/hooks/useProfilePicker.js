import React from 'react'

function useProfilePicker() {
  const [file, setFile] = React.useState(null)
  const [profilePickerWasChanged, setProfilePickerWasChanged] = React.useState(false)
  const [profilePickerError, setProfilePickerError] = React.useState(false)

  function profilePickerChangeHandler(e) {
    const addedFile = e.target.files[0]

    // regex to match image filetypes
    const regex = /^(image\/)(png|jpe?g|gif)$/

    if (addedFile.size > 2000000) {
      setProfilePickerError(`Sorry, maximum file size is 2MB!`)
    } else if (!addedFile.type.match(regex)) {
      setProfilePickerError(`Sorry, only jpg, png, and gif files allowed!`)
    } else {
      setFile(addedFile)
      setProfilePickerWasChanged(true)
    }
  }

  function deleteProfilePic(toDelete) {
    setFile(null)
  }

  return {
    file,
    setFile,
    profilePickerError,
    setProfilePickerError,
    deleteProfilePic,
    profilePickerWasChanged,
    profilePickerChangeHandler,
  }
}

export default useProfilePicker