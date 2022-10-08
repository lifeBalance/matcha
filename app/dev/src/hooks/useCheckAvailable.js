import React from 'react'
import axios from 'axios'

function useCheckAvailable() {
  const [available, setAvailable] = React.useState(null)

  async function checkIfAvailable(url, data) {
    return axios
    .get(url, { params: data })
    .then(function (response) {
      // console.log('username available? ' + response.data.available) // testing
      if (response.data) setAvailable(response.data.available)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  return {
    available,
    checkIfAvailable
  }
}

export default useCheckAvailable