import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchUsers = axios.create({
  baseURL: '/api',
})

fetchUsers.interceptors.response.use(
  // If all goes smooth:
  response => response, // Returning the response is ESSENTIAL!!

  /* If the interceptor fails, we check for a 401 (unauthorized) status,
    in that case, we invoke the refresh reducer from the auth slice to
    refresh our JWTs */
  error => {
    if (error.response.status === 401) {
      // console.log('JWTs were Silently Refreshed!');
      return error.response.config.refreshTokens()
        .then(resp => {
          error.response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }

          return axios.request(error.response.config)
        })
        .catch(e => console.log(e))
    }
    return Promise.reject(error)
  }
)

function useUsers(params) {
  const [users, setUsers] = React.useState([])
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false)
  const [errorLoadingUsers, setErrorLoadingUsers] = React.useState(false)
  const dispatch = useDispatch()

  async function getUsers(args) {
    setIsLoadingUsers(true)

    try {
      const response = await fetchUsers({
        url: '/users',
        method: 'get',
        params: { page: args.page },
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        refreshTokens: () => dispatch(refresh()),
      })
      // console.log(response.data); // testing
      // setUsers(prevState => [...prevState, ...response.data])
      setUsers(prevState => [...prevState, ...response.data].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i))
    } catch (error) {
      return setErrorLoadingUsers(error.response.data.error.message)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  return {
    users,
    getUsers,
    isLoadingUsers,
    errorLoadingUsers,
  }
}

export default useUsers