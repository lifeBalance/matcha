import React from 'react'
import axios from 'axios'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

const fetchProfiles = axios.create({
  baseURL: '/api',
})

fetchProfiles.interceptors.response.use(
  response => {
    if (response.data.type === 'ERROR' &&
        response.data.message === 'jwt expired')
    {
      // console.log('JWTs were Silently Refreshed!') // testing
      // console.log(response) // testing
      return response.config.refreshTokens()
        .then(resp => {
          response.config.headers = {
            'Authorization': `Bearer ${resp.payload.access_token}`
          }
          return axios.request(response.config)
        })
        .catch(e => console.log(e))
    }
    // If all goes smooth, the interceptor just returns the response.
    return response
  },
  error => Promise.reject(error)
)

function useGetProfileList(params) {
  const [page, setPage] = React.useState(1)   // For paginated results
  const [profiles, setProfiles] = React.useState([])
  const [isLoadingProfiles, setIsLoadingProfiles] = React.useState(false)
  const [errorLoadingProfiles, setErrorLoadingProfiles] = React.useState(false)
  const [newSearch, setNewSearch] = React.useState(true)

  const dispatch = useDispatch()

  async function getProfileList(args) {
    setIsLoadingProfiles(true)

    try {
      /*  Next line is crucial to protect the App from 
        errors caused by the user Reloading the Browser. */
      if (!args.accessToken) return
// console.log(args) // testing
      const response = await fetchProfiles({
        url: '/profiles',
        method: 'get',
        params: {
          page:       args.page,
          ageRange:   args?.ageRange  || null,
          fameRange:  args?.fameRange || null,
          distRange:  args?.distRange || null,
          tags:       args?.tags      || null
        },
        headers: {
          'Authorization': `Bearer ${args.accessToken}`
        },
        /*  Hang the following function in the 'config' object in
           order to make it available in the interceptor. */
        refreshTokens: () => dispatch(refresh({ accessToken: args.accessToken })),
      })
      // console.log('profiled? ' + JSON.stringify(response.data.profiled)) // testing
      // console.log('typeof ' + typeof(response.data.profiled)) // testing
      // console.log('tags ' + JSON.stringify(response.data.tags)) // testing
      // console.log(response.data) // testing

      if (response.data.profiled) {
        if (newSearch) {
          // console.log('new search');
          setProfiles(response.data.profiles)
          setNewSearch(false)
        } else {
          // console.log('not new search');
          setProfiles(prevState => [...prevState, ...response.data.profiles].filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i))
        }
        args.setAllTags(response.data.tags)
      }
    } catch (error) {
      return setErrorLoadingProfiles(error.response?.data)
      // return setErrorLoadingProfiles(error.response.data.error.message)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  return {
    page,
    setPage,
    profiles,
    setProfiles,
    getProfileList,
    isLoadingProfiles,
    errorLoadingProfiles,
    newSearch,
    setNewSearch
  }
}

export default useGetProfileList