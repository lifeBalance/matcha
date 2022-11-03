import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'
import {
  deleteNotif
} from '../store/notifSlice'

const requestDelNotif = axios.create({
  baseURL: '/api',
})

requestDelNotif.interceptors.response.use(
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

function useDeleteNotifs() {
  const [isDeletingNotif, setIsDeletingNotif] = React.useState(false)
  const [errorDeletingNotif, setErrorDeletingNotif] = React.useState(false)
  const dispatch = useDispatch()

  async function requestDeleteNotif(args) {
    setIsDeletingNotif(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await requestDelNotif({
        url: '/notifs',
        method: 'delete',
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        data: { notif_id: args.notif_id },
        /*  Hang the following function in the 'config' object in
           order to make it available in the interceptor. */
        refreshTokens: () => dispatch(refresh({
          accessToken: args.accessToken
        })),
      })

      if (response.data.type === 'SUCCESS') {
        console.log(response.data.notif_id);
        // args.callback(response.data.notif_id)
        dispatch(deleteNotif(response.data.notif_id))
      }
    } catch (error) {
      return setErrorDeletingNotif(error.response?.data)
      // return setErrorLoadingProfiles(error.response.data.error.message)
    } finally {
      setIsDeletingNotif(false)
    }
  }

  return {
    requestDeleteNotif,
    isDeletingNotif,
    errorDeletingNotif
  }
}

export default useDeleteNotifs