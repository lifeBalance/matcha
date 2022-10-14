import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
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

function useGetProfile() {
  const [error, setError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dispatch = useDispatch()

  const getProfile = async function (args) {
    setIsLoading(true)

    try {
      const resp = await sendRequest({
        url: args.url,
        method: 'get',
        headers: { 'Authorization': `Bearer ${args.accessToken}` },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken }))
      })
      // console.log(resp.data) // testing
      if (resp.data.error) {
        // console.log(resp.data.error) // testing
        setError(resp.data.error)
      } else
        args.setUserState(resp.data)
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