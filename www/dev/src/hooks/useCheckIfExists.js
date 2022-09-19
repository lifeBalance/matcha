import React from 'react'
import axios from 'axios'

function useCheckIfExists() {
  const [exists, setExists] = React.useState(false)
  const [error, setError] = React.useState(false)

  async function checkIfExists(url, data) {
    return axios
    .post(url, data)
    .then(function (response) {
      if (response.data) {
        setExists(true)
      } else {
        setExists(false)
      }
      // console.log(response.status, response.statusText)
      console.log(response.data)

      // return response.data // No need to return
    })
    .catch(function (error) {
      console.log(error)
      setError(error)
      // return error
    })
  }

  return {
    exists,
    setExists,
    checkIfExists,
    error
  }
}

export default useCheckIfExists