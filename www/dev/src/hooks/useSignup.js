import React from 'react'
import axios from 'axios'

function useSignup() {
  const [isSignedUp, setIsSignedUp] = React.useState(false)
  const [signupError, setSignupError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  async function sendRequest(formData) {
    return axios
    .post('/api/users', formData)
    .then(function (response) {
      if (response.ok) {
        setIsSignedUp(true)
        setSignupError(false)
        setIsLoading(false)
      } else {
        setIsSignedUp(false)
        setSignupError(true)
        setIsLoading(false)
      }
      // console.log(response.status, response.statusText)
      // console.log(response.data)

      // return response.data // No need to return
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
  }

  return {
    isSignedUp,
    isLoading,
    signupError,
    sendRequest
  }
}

export default useSignup