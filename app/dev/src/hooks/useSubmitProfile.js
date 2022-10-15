import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create()

sendRequest.interceptors.response.use(
  response => response, // Returning the response is ESSENTIAL!!

  error => {
    if (error.response.status === 401) {
      // console.log('JWTs were Silently Refreshed!');
      return error.response.config.refreshTokens()
        .then(resp => {
          error.response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }

          return axios.request(error.response.config)
        })
        .catch(e => console.log(e))
    }
    return Promise.reject(error)
  }
)

function useSubmitProfile() {
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const dispatch = useDispatch()

  const submitProfile = React.useCallback(async function (args) {
    setIsSubmitting(true)
    // console.log(data) // testing

    const formData = new FormData()
    formData.append('firstname', args.firstName)
    formData.append('lastname', args.lastName)
    formData.append('age', args.age ?? '')
    formData.append('email', args.email)
    formData.append('gender', args.genderValue)
    formData.append('prefers', args.preferencesValue)
    formData.append('bio', args.bioValue ?? '')
    args.files.forEach((pic, idx) => {
      formData.append(`pic${idx}`, pic)
    })
    /* for(let pair of formData.entries()) {
      console.log(`${pair[0]} ${pair[1].name}`) 
    } // testing */
    try {
      const resp = await sendRequest.put(
        '/api/settings',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${args.accessToken}`
          },
          refreshTokens: () => dispatch(refresh({
            accessToken: args.accessToken
          }))
        })
      // console.log(resp.data) // testing

      setSubmitError(false) // we use this just to choose the proper Icon :-)
      args.callback(resp.data)
      // return resp.data
    } catch (error) {
      console.log(error.response) // testing
      // console.log(error.response?.data) // testing
      setSubmitError(true)
      args.callback(error.response?.data)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    isSubmitting,
    submitError,
    submitProfile
  }
}

export default useSubmitProfile