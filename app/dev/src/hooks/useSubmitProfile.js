import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create()

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

function useSubmitProfile() {
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const dispatch = useDispatch()

  const submitProfile = React.useCallback(async function (args) {
    setIsSubmitting(true)
    // console.log(args) // testing

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
    // for(const pair of formData.entries()) {
    //   console.log(`${pair[0]} ${pair[1]}`) 
    // } // testing
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
      if (resp.data.type === 'ERROR') {
        setSubmitError(true)
        args.callback(resp.data)
      } else {
        setSubmitError(false)
        args.callback(resp.data)
      }
    } catch (error) {
      // console.log(error) // testing
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