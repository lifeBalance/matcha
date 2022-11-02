import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchNotifs = axios.create({
  baseURL: '/api',
})

fetchNotifs.interceptors.response.use(
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

function useGetNotifList() {
  const [notifs, setNotifs] = React.useState([])
  const [isLoadingNotifs, setIsLoadingNotifs] = React.useState(false)
  const [errorLoadingNotifs, setErrorLoadingNotifs] = React.useState(false)
  const dispatch = useDispatch()

  async function getNotifList(args) {
    setIsLoadingNotifs(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await fetchNotifs({
        url: '/notifs',
        method: 'get',
        // params: { page: args.page },
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        /*  Hang the following function in the 'config' object in
           order to make it available in the interceptor. */
        refreshTokens: () => dispatch(refresh({
          accessToken: args.accessToken
        })),
      })

      if (response.data.notifs) {
        console.log(response.data.notifs);
        setNotifs(response.data.notifs)
        // args.callback(response.data.notifs)
      }
    } catch (error) {
      return setErrorLoadingNotifs(error.response?.data)
      // return setErrorLoadingProfiles(error.response.data.error.message)
    } finally {
      setIsLoadingNotifs(false)
    }
  }

  return {
    notifs,
    setNotifs,
    getNotifList,
    isLoadingNotifs,
    errorLoadingNotifs,
  }
}

export default useGetNotifList