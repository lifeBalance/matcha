import React from 'react'
import axios from 'axios'

function useSignupForm() {
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const submitForm = React.useCallback(async function (url, formRawData, callbackModal) {
    setIsSubmitting(true)

    try {
      const resp = await axios.post(url, formRawData)

      setSubmitError(false)
      if (resp.data.type === 'ERROR') {
        setSubmitError(true)
        // console.log(resp.data) // testing
        callbackModal(resp.data.message)
      } else {
        setSubmitError(false)
        // console.log(resp.data) // testing
        callbackModal(resp.data.message)
      }
    } catch (error) {
      setSubmitError(true)
      if (error.response && error.response.data) {
        // console.log(error.response.data.message) // testing
        callbackModal(error.response.data.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    isSubmitting,
    submitError,
    submitForm
  }
}

export default useSignupForm