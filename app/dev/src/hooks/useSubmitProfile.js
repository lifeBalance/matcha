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

  const submitProfile = React.useCallback(async function (accessToken, data = null, callback = null) {
    setIsSubmitting(true)
    // console.log(data) // testing

    const formData = new FormData()
    formData.append('firstname', data.firstName)
    formData.append('lastname', data.lastName)
    formData.append('age', data.age)
    formData.append('email', data.email)
    formData.append('gender', data.genderValue)
    formData.append('prefers', data.preferencesValue)
    formData.append('bio', data.bioValue)
    data.files.forEach((pic, idx) => {
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
            'Authorization': `Bearer ${accessToken}`
          },
          refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
        })
      // console.log(resp.data) // testing
      // return

      setSubmitError(false) // we use this just to choose the proper Icon :-)
      callback(resp.data)
      // return resp.data
    } catch (error) {
      console.log(error.response.data) // testing
      setSubmitError(true)
      callback(error.response.data)
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