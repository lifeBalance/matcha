import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchNotifs = axios.create({
  baseURL: '/api',
})
const reqDeleteNotif = axios.create({
  baseURL: '/api',
})
const reqDeleteAllNotifs = axios.create({
  baseURL: '/api',
})

fetchNotifs.interceptors.response.use(
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

reqDeleteNotif.interceptors.response.use(
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

function useNotifs(params) {
  const [notifs, setNotifs] = React.useState([])
  const [isLoadingNotifList, setIsLoadingNotifList] = React.useState(false)
  const [errorLoadingNotifList, setErrorLoadingNotifList] = React.useState(false)
  const dispatch = useDispatch()

  async function getNotifList(args) {
    setIsLoadingNotifList(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await fetchNotifs({
        url: '/notifs',
        method: 'get',
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })

      if (response.data.notifs)
        setNotifs(response.data.notifs)
    } catch (error) {
      return setErrorLoadingNotifList(error.response?.data)
    } finally {
      setIsLoadingNotifList(false)
    }
  }

  async function deleteNotif(args) {
    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await reqDeleteNotif({
        url: '/notifs',
        method: 'delete',
        data: { notif_id: args.id },
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })

      if (response.data.type === 'SUCCESS') {
        setNotifs(prev => prev.filter(n => n.id != args.id))
        args.resetNewNotifs()
      }
    } catch (error) {
      return setErrorLoadingNotifList(error.response?.data)
    }
  }

  return {
    notifs,
    getNotifList,
    deleteNotif,
    isLoadingNotifList,
    errorLoadingNotifList,
  }
}

export default useNotifs