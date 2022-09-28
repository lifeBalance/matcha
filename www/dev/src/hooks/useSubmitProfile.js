import React from 'react'
import axios from 'axios'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create({
  baseURL: '/api',
})

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
  // const { uid, accessToken } = useSelector(slices => slices.auth.accessToken)
  const dispatch = useDispatch()

  const submitProfile = React.useCallback(async function (method, accessToken, formRawData = null, callback = null) {
    setIsSubmitting(true)

    try {
      const resp = await sendRequest({
        url: '/profiles',
        method: method,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        refreshTokens: () => dispatch(refresh()),
        data: formRawData
      })
      if (callback)
        callback(resp.data)
      // console.log(resp.data) // testing
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