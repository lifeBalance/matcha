import React from 'react'
import axios from 'axios'

function useConfirm() {
  const [confirmError, setConfirmError] = React.useState(false)
  const [isConfirming, setIsConfirming] = React.useState(false)

  const confirm = React.useCallback(async function (url, method, data, callback) {
    setIsConfirming(true)

    try {
      const resp = await axios({
        method: method,
        url: url,
        data: data
      })
      console.log(resp.data) // testing
      setConfirmError(false)
      setIsConfirming(false)
      callback()
    } catch (error) {
      console.log(error.response.data) // testing
      setConfirmError(error.response.data)
      setIsConfirming(false)
      callback()
    }
  }, [])

  return {
    isConfirming,
    confirmError,
    confirm
  }
}

export default useConfirm