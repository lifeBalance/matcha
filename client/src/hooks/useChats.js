import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchChatList = axios.create({
  baseURL: '/api',
})
// const reqDeleteNotif = axios.create({
//   baseURL: '/api',
// })

fetchChatList.interceptors.response.use(
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

// reqDeleteNotif.interceptors.response.use(
//   response => {
//     if (response.data.type === 'ERROR' &&
//         response.data.message === 'jwt expired')
//     {
//       return response.config.refreshTokens()
//         .then(resp => {
//           response.config.headers = {
//             'Authorization': `Bearer ${resp.payload.access_token}`
//           }
//           return axios.request(response.config)
//         })
//         .catch(e => console.log(e))
//     }
//     return response
//   },
//   error => Promise.reject(error)
// )

function useChats(params) {
  const [chatList, setChatList] = React.useState([])
  const [isLoadingChatList, setIsLoadingChatList] = React.useState(false)
  const [errorLoadingChatList, setErrorLoadingChatList] = React.useState(false)
  const dispatch = useDispatch()

  async function getChatList(args) {
    setIsLoadingChatList(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await fetchChatList({
        url: '/chats',
        method: 'get',
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })

      if (response.data.chats)
        setChatList(response.data.chats)
    } catch (error) {
      return setErrorLoadingChatList(error.response?.data)
    } finally {
      setIsLoadingChatList(false)
    }
  }

  // async function deleteNotif(args) {
  //   try {
  //     /*  Next line is crucial to protect the App from 
  //       errors caused by the user Reloading the Browser. */
  //     if (!args.accessToken) return

  //     const response = await reqDeleteNotif({
  //       url: '/notifs',
  //       method: 'delete',
  //       data: { notif_id: args.id },
  //       headers: {
  //         'Authorization': `Bearer ${args.accessToken}`
  //       },
  //       refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
  //     })

  //     if (response.data.type === 'SUCCESS') {
  //       setChatList(prev => prev.filter(n => n.id != args.id))
  //       args.resetNewNotifs()
  //     }
  //   } catch (error) {
  //     return setErrorLoadingChatList(error.response?.data)
  //   }
  // }

  return {
    chatList,
    getChatList,
    isLoadingChatList,
    errorLoadingChatList,
  }
}

export default useChats