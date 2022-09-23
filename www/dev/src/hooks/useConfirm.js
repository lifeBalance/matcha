import React from 'react'
import axios from 'axios'

function useConfirm() {
  const [confirmError, setConfirmError] = React.useState(false)
  const [isConfirming, setIsConfirming] = React.useState(false)

  const confirm = React.useCallback(async function (url, method, data) {
    setIsConfirming(true)

    try {
      const resp = await axios({
        method: method,
        url: url,
        data: data
      })
      console.log(resp.data) // testing
    } catch (error) {
      console.log(error.response.data)
      setConfirmError(error.response.data)
    } finally {
      setIsConfirming(false)
    }
  }, [])

  return {
    isConfirming,
    confirmError,
    confirm
  }
}

export default useConfirm