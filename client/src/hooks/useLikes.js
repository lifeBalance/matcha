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
      // console.log('JWTs were Silently Refreshed!') // testing
      // console.log(response) // testing
      return response.config.refreshTokens()
        .then(resp => {
          response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }
          return axios.request(response.config)
        })
        .catch(e => console.log(e))
    }
    // If all goes smooth, the interceptor just returns the response.
    return response
  },
  error => Promise.reject(error)
)

function useLikes() {
  const [like, setLike] = React.useState(null)
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const dispatch = useDispatch()

  const submitLike = React.useCallback(async function (args) {
    setIsSubmitting(true)

    try {
      const resp = await sendRequest({
        url: '/likes',
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
      } else {
        // console.log(resp.data) // testing
        setSubmitError(false)
        setLike(resp.data.like)
        // args.callback(resp.data.notif)
        // args.callback(resp.data)
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
    like,
    setLike,
    isSubmitting,
    submitError,
    submitLike
  }
}

export default useLikes