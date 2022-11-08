import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchMsgList = axios.create({
  baseURL: '/api',
})

fetchMsgList.interceptors.response.use(
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
const sendMsgRequest = axios.create({
  baseURL: '/api',
})

sendMsgRequest.interceptors.response.use(
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

function useChat() {
  const [isSendingMsg, setIsSendingMsg] = React.useState(false)
  const [errorSendingMsg, setErrorSendingMsg] = React.useState(false)
  const [messageList, setMessageList] = React.useState([])
  const [isLoadingMsgList, setIsLoadingMsgList] = React.useState(false)
  const [errorLoadingMsgList, setErrorLoadingMsgList] = React.useState(false)
  const dispatch = useDispatch()

  async function getMessageList(args) {
    setIsLoadingMsgList(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await fetchMsgList({
        url: args.url,
        method: 'get',
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })
      console.log(response.data);
      if (response.data.messageList)
        setMessageList(response.data.messageList)
    } catch (error) {
      return setErrorLoadingMsgList(error.response?.data)
    } finally {
      setIsLoadingMsgList(false)
    }
  }

  async function sendMessage(args) {
    setIsSendingMsg(true)
// console.log(args);
    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return

      const response = await sendMsgRequest({
        url: args.url,
        method: 'post',
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        data: {
          to:   args.to,
          msg:  args.msg
        },
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })
      console.log(response.data);
      if (response.data.type === 'SUCCESS') {
        setMessageList(prev => [...prev, response.data.msg])
        args.cb()
      } else {
        if (response.data.message === 'no such chat')
          args.setModalIsOpen(true)
      }
    } catch (error) {
      return setErrorSendingMsg(error.response?.data)
    } finally {
      setIsSendingMsg(false)
    }
  }

  return {
    messageList,
    getMessageList,
    isLoadingMsgList,
    errorLoadingMsgList,
    sendMessage,
    isSendingMsg,
    errorSendingMsg
  }
}

export default useChat