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
  const [getError, setGetError] = React.useState(false)
  const [isGetting, setIsGetting] = React.useState(false)
  const dispatch = useDispatch()

  const getProfile = React.useCallback(async function (args) {
    setIsGetting(true)

    try {
      const resp = await sendRequest({
        url: args.url,
        method: 'get',
        params: { id: args.id }, // will be null when getting SETTINGS (id is in token)
        headers: { 'Authorization': `Bearer ${args.accessToken}` },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })
      // console.log(resp.data) // testing
      args.setUserState(resp.data)
      // return resp.data
    } catch (error) {
      console.log(error)
      setGetError(true)
    } finally {
      setIsGetting(false)
    }
  }, [])

  return {
    isGetting,
    getError,
    getProfile
  }
}

export default useGetProfile