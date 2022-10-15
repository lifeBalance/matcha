import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchProfiles = axios.create({
  baseURL: '/api',
})

fetchProfiles.interceptors.response.use(
  // If all goes smooth, the interceptor just returns the response.
  response => response, // Returning the response is ESSENTIAL!!

  /*   If the ininital request errors with a 401, the interceptor sends
    a new request to the /api/refresh endpoint to get a new pair of tokens.
    Then it resends the original request for user profiles with the
    new refreshed tokens. */
  error => {
    if (error.response.status === 401) {
      // console.log('JWTs were Silently Refreshed!')  // testing
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

function useGetProfileList(params) {
  const [profiles, setProfiles] = React.useState([])
  const [isLoadingProfiles, setIsLoadingProfiles] = React.useState(false)
  const [errorLoadingProfiles, setErrorLoadingProfiles] = React.useState(false)
  const dispatch = useDispatch()

  async function getProfileList(args) {
    setIsLoadingProfiles(true)

    try {
      const response = await fetchProfiles({
        url: '/profiles',
        method: 'get',
        params: { page: args.page },
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        /*  Hang the following function in the 'config' object in
           order to make it available in the interceptor. */
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })
      // console.log('profiled? ' + JSON.stringify(response.data.profiled)); // testing
      // console.log('typeof ' + typeof(response.data.profiled)); // testing
      // console.log('data ' + JSON.stringify(response.data)); // testing
      args.setProfiledState(response.data.profiled)
      // setUsers(prevState => [...prevState, ...response.data])
      if (response.data.profiled)
        setProfiles(prevState => [...prevState, ...response.data.profiles].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i))
    } catch (error) {
      return setErrorLoadingProfiles(error.response.data)
      // return setErrorLoadingProfiles(error.response.data.error.message)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  return {
    profiles,
    getProfileList,
    isLoadingProfiles,
    errorLoadingProfiles,
  }
}

export default useGetProfileList