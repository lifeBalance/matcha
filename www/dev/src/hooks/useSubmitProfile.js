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

  const submitProfile = React.useCallback(async function (method, accessToken, data = null, callback = null) {
    setIsSubmitting(true)
    console.log(data)

    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('genderValue', data.genderValue)
    formData.append('preferencesValue', data.preferencesValue)
    formData.append('bioValue', data.bioValue)
    data.files.forEach((pic, idx) => {
      formData.append(`pic${idx}`, pic)
    })
    // for(let pair of formData.entries()) {
    //   console.log(`${pair[0]} ${pair[1].name}`) 
    // } // testing

    try {
      const resp = await sendRequest.post(
        '/api/profiles',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`},
          refreshTokens: () => dispatch(refresh()),
        })
      if (callback)
        callback(resp.data)
      console.log(resp.data) // testing
      // return resp.data
    } catch (error) {
      console.log(error)
      setSubmitError(true)
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