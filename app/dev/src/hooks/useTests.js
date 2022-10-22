import React from 'react'
import axios from 'axios'

const useTests = (args) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [content, setContent] = React.useState(null)

  const getTests = async (args) => {
    try {
      setIsLoading(true)
      const url = '/api/tests'

      const response = await axios({
        url: url,
        method: 'get',
        headers: {'Content-Type': 'application/json'},
      })
      console.log(response.data)

      setError(null)
      setContent(response.data)
      args.feedback(response.data.message)
      // return response.data
    } catch (error) {
      setError(error)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    content,
    getTests,
    error,
    isLoading
  }
}

export default useTests