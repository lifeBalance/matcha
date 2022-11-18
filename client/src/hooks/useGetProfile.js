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
    return response
  },
  error => Promise.reject(error)
)

function useGetProfile() {
  const [error, setError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useDispatch()

  const getProfile = async function (args) {
    setIsLoading(true)
    // console.log(args) // testing

    try {
      const resp = await sendRequest({
        url:            args.url,
        method:         'get',
        headers:        { 'Authorization': `Bearer ${args.accessToken}` },
        refreshTokens:  () => dispatch(refresh({ accessToken: args.accessToken }))
      })

      // console.log(resp.data) // testing
      if (resp.data.type === 'ERROR') {
        setError(resp.data.message)
      } else {
        args.setUserState(resp.data)
        args.submitView({
          accessToken:  args.accessToken,
          data:         { to: parseInt(args.to.id)}
        })
      }
      // return resp.data // no need to return anything.
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    getProfile
  }
}

export default useGetProfile