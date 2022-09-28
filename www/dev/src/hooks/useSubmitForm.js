import React from 'react'
import axios from 'axios'

function useSubmitForm() {
  const [submitError, setSubmitError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const submitForm = React.useCallback(async function (url, formRawData) {
    setIsSubmitting(true)

    try {
      const resp = await axios.post(url, formRawData)

      // console.log(resp.data) // testing
    } catch (error) {
      setSubmitError(true)
      console.log(error)
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

export default useSubmitForm