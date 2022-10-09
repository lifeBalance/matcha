import React from 'react'
import axios from 'axios'

function useConfirm() {
  const [confirmError, setConfirmError] = React.useState(false)
  const [isConfirming, setIsConfirming] = React.useState(false)

  async function confirm(url, method, data, callback) {
    setIsConfirming(true)

    try {
      const resp = await axios({
        method: method,
        url: url,
        data: data
      })

      // console.log(resp.data.message) // testing
      setConfirmError(false)
      callback(resp.data.message)
    } catch (error) {
      setConfirmError(true)
      if (error.response.data.message) {
        // console.log(error.response.data.message) // testing
        callback(error.response.data.message)
      }
    } finally {
      setIsConfirming(false)
    }
  }

  return {
    isConfirming,
    confirmError,
    confirm
  }
}

export default useConfirm