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

function useGetProfilePic() {
  const [picIsLoading, setPicIsLoading] = React.useState(false)
  const [errorGettingPic, setErrorGettingPic] = React.useState(false)
  const dispatch = useDispatch()

  const getProfilePic = React.useCallback(async function (accessToken, callback = null) {
    setPicIsLoading(true)

    try {
      const resp = await sendRequest({
        url: '/profile-pics',
        method: 'get',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        refreshTokens: () => dispatch(refresh())
      })

      // console.log(resp.data.profilePic); return // testing
      if (callback)
        callback(resp.data.profilePic) // used to set state in the component
      // return resp.data
    } catch (error) {
      console.log(error)
      setErrorGettingPic(true)
    } finally {
      setPicIsLoading(false)
    }
  }, [])

  return {
    picIsLoading,
    errorGettingPic,
    getProfilePic
  }
}

export default useGetProfilePic