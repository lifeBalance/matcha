import React from 'react'

function useFilePicker() {
  const [files, setFiles] = React.useState([])
  const [filePickerWasChanged, setFilePickerWasChanged] = React.useState(false)
  const [filesLeft, setFilesLeft] = React.useState(5)
  const [filePickerError, setFilePickerError] = React.useState(false)

  function uniqueBy(filesArray, key = `name`) {
    return [ ...new Map(filesArray.map(file => [file[key], file])).values() ]
  }

  function filePickerChangeHandler(e) {
    const addedFiles = [...e.target.files]

    if (addedFiles.length > filesLeft) {
      setFilePickerError(`Sorry, maximum is 5 pictures (only ${filesLeft} left)`)
      // console.log(`Sorry, maximum is 5 pictures (only ${filesLeft} left)`) // testing
      return
    }

    const cleanFiles = []
    const regex = /^(image\/)(png|jpe?g|gif)$/  // regex to match image filetypes
    // Check if the size of any file is greater than 2MB and it's an image
    addedFiles.forEach(element => {
      if (element.size > 2000000) {
        setFilePickerError(`Sorry, maximum file size is 2MB!`)
        // console.log(`Sorry, maximum file size is 2MB!(${element.size})`) // testing
      } else if (!element.type.match(regex)) {
        setFilePickerError(`Sorry, only jpg, png, and gif files allowed!`)
        // console.log(`Sorry, only jpg, png, and gif files allowed (${element.type} found)`) // testing
      } else {
        cleanFiles.push(element)
        setFilePickerWasChanged(true)
      }
    })

    setFiles(prevState => uniqueBy(prevState.concat(cleanFiles)))
    setFilesLeft(prev => prev - addedFiles.length)
    // setFiles(prevState => uniqueBy(prevState.concat(...e.target.files)))
    // setFilePickerError(false) // Do that from the UI (Closing the Modal)
  }

  function deletePic(toDelete) {
    setFiles((prevState) => prevState.filter(file =>file.name !== toDelete))
    setFilesLeft(prev => prev + 1)
  }

  return {
    files,
    setFiles,
    filesLeft,
    setFilesLeft,
    filePickerError,
    setFilePickerError,
    deletePic,
    filePickerWasChanged,
    filePickerChangeHandler,
  }
}

export default useFilePicker