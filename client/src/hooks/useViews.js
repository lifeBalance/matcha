import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create({
  baseURL: '/api',
})

sendRequest.interceptors.response.use(
  response => {
    if (response.data.type === 'ERROR' &&
        response.data.message === 'jwt expired')
    {
      return response.config.refreshTokens()
        .then(resp => {
          response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }
          return axios.request(response.config)
        })
        .catch(e => console.log(e))
    }
    return response
  },
  error => Promise.reject(error)
)

function useLikes() {
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const dispatch = useDispatch()

  const submitView = React.useCallback(async function (args) {
    setIsSubmitting(true)
    // console.log(args) // testing

    try {
      const resp = await sendRequest({
        url: '/views',
        method: args.method,
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        data: args.data,
        refreshTokens: () => dispatch(refresh({
          accessToken: args.accessToken
        }))
      })

      // console.log(resp.data) // testing
      if (resp.data.type === 'ERROR') {
        setSubmitError(true)
        // console.log(resp.data.message) // testing
        // args.callback(resp.data)
      } else {
        // console.log(resp.data.notif) // testing
        setSubmitError(false)
        args.callback() // Close the EYE icon :-)
      }
    } catch (error) {
      // console.log(error) // testing
      setSubmitError(true)
      // args.callback(error.response?.data)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    isSubmitting,
    submitError,
    submitView
  }
}

export default useLikes