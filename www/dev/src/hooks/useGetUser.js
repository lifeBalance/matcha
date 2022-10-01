import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create({
  baseURL: '/api',
})

sendRequest.interceptors.response.use(
  response => response, // If all goes smooth

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

function useGetUser() {
  const [userIsLoading, setUserIsLoading] = React.useState(false)
  const [errorGettingUser, setErrorGettingUser] = React.useState(false)
  const dispatch = useDispatch()

  const getUser = React.useCallback(async function (uid, accessToken, callback = null) {
    setUserIsLoading(true)

    try {
      const resp = await sendRequest({
        url: '/users',
        method: 'get',
        params: { id: uid },
        headers: { 'Authorization': `Bearer ${accessToken}` },
        refreshTokens: () => dispatch(refresh())
      })

      if (callback)
        callback(resp.data) // used to set state in the component
      console.log(resp.data) // testing
      // return resp.data
    } catch (error) {
      console.log(error)
      setErrorGettingUser(true)
    } finally {
      setUserIsLoading(false)
    }
  }, [])

  return {
    userIsLoading,
    errorGettingUser,
    getUser
  }
}

export default useGetUser