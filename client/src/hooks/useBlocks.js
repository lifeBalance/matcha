import React from 'react'
import axios from 'axios'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { refresh } from '../store/authSlice'

const sendRequest = axios.create({
  baseURL: '/api',
})

sendRequest.interceptors.response.use(
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

function useBlocks() {
  const [submitBlockError, setSubmitBlockError] = React.useState(false)
  const [isSubmittingBlock, setIsSubmittingBlock] = React.useState(false)
  // redux
  const dispatch = useDispatch()
  const { accessToken } = useSelector(slices => slices.auth)

  const blockUser = React.useCallback(async function (args) {
    setIsSubmittingBlock(true)

    try {
      const resp = await sendRequest({
        url: '/blocks',
        method: 'post',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        data: {
          profileId: args.profileId
        },
        refreshTokens: () => dispatch(refresh({ accessToken }))
      })

      if (resp.data.type === 'ERROR') {
        submitBlockError(true)
        // console.log(resp.data.message) // testing
      } else {
        // console.log(resp.data) // testing
        setSubmitBlockError(false)
        // args.callback(resp.data)
      }
    } catch (error) {
      setSubmitBlockError(true)
    } finally {
      setIsSubmittingBlock(false)
    }
  }, [])

  return {
    blockUser,
    isSubmittingBlock,
    submitBlockError
  }
}

export default useBlocks