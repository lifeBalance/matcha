import React from 'react'
import { useNavigate } from 'react-router-dom'
// lodash is available thanks to the 'vite-plugin-imp' (a Vite's plugin)
import { intersection } from 'lodash'

// hooks
import useGetProfileList from '../hooks/useGetProfileList'
import useSearchBox from '../hooks/useSearchBox'

// components
import Hero from '../components/Hero'
import UserMiniCard from '../components/UserMiniCard'
import SearchBox from '../components/SearchBox'

// icons
import { ArrowPathIcon } from '@heroicons/react/24/outline'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logout, loginAfterReload } from '../store/authSlice'

function ProfileList() {
  const {
    isProfiled,
    isConfirmed,
    isLoggedIn,
    isLoggingIn,
    accessToken
  } = useSelector((slices) => slices.auth)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Profile list state
  const {
    page,
    setPage,
    profiles,
    setProfiles,
    getProfileList,
    isLoadingProfiles,
    errorLoadingProfiles,
    newSearch,
    setNewSearch
  } = useGetProfileList()

  const searchBoxHook = useSearchBox()
  // console.log(searchBoxHook) // testing

  React.useEffect(() => {
    setNewSearch(true)
  }, [searchBoxHook.ageRange, searchBoxHook.fameRange, searchBoxHook.locationRange])

  function sortProfiles() {
    const filters = ['age', 'fame', 'location', 'tags']
    const orderBy = filters[searchBoxHook.orderBy] // ascending: true or false
    // console.log(`criteria ${orderBy} - Asc. order ${searchBoxHook.ascendingOrder}`) // testing

    // We need special logic to sort profiles by tags in common!!
    if (orderBy === 'tags') {
      console.log(`tags: ${JSON.stringify(searchBoxHook.tags)}`) // testing
      if (searchBoxHook.tags.length === 0) return
      
      // Map the array of {label: 'blondes', value: 1} objects to just labels
      const searchTags = searchBoxHook.tags.map(i => i.label)
      console.log(`tags: ${JSON.stringify(searchTags)}`) // testing
      
      if (searchBoxHook.ascendingOrder == false) {
        setProfiles(profiles.slice().sort((a, b) => {
          return intersection(a[orderBy], searchTags).length - intersection(b[orderBy], searchTags).length
        }))
      } else {
        setProfiles(profiles.slice().sort((a, b) => {
          return intersection(b[orderBy], searchTags).length - intersection(a[orderBy], searchTags).length
        }))
      }
    } else {
      // console.log(`sorting by ${orderBy} in ascending order? ${searchBoxHook.ascendingOrder}`) // testing
      if (searchBoxHook.ascendingOrder == true) {
        setProfiles(profiles.slice().sort((a, b) => {
          return Number(a[orderBy]) - Number(b[orderBy])
        }))
      } else if (searchBoxHook.ascendingOrder == false) {
        setProfiles(profiles.slice().sort((a, b) => {
          return Number(b[orderBy]) - Number(a[orderBy])
        }))
      }
    }
  }
  
  function requestProfiles() {
    getProfileList({
      accessToken,
      page,
      ageRange:   searchBoxHook.ageRange,
      fameRange:  searchBoxHook.fameRange,
      distRange:  searchBoxHook.locationRange,
      setAllTags: searchBoxHook.setAllTags,
      tags:       searchBoxHook.tags
    })
  }

  /* If the user is logged in but not profiled, we redirect to Settings form */
  React.useEffect(() => {
    if (isLoggingIn) return
    else {
      if (isLoggedIn) {
        if (isProfiled === 0) navigate('/edit', { replace: true })
        if (!isConfirmed) dispatch(logout())
        else if (accessToken) {
          requestProfiles()
        } else {
          const matcha = localStorage.getItem('matcha')
          dispatch(loginAfterReload(matcha))
        }
      }
    }
  }, [isLoggingIn, isLoggedIn, isProfiled, isConfirmed, accessToken, page])

  React.useEffect(() => {
    // console.log(`new search? ${newSearch}`)
    setNewSearch(true)
    setPage(1)
  }, [searchBoxHook.locationRange, searchBoxHook.ageRange, searchBoxHook.tags, searchBoxHook.fameRange])

  // If the user is not logged in, we just return the Hero content
  if (!isLoggedIn) return (<Hero />)

  let content // a variable to take logic out from the JSX

  if (profiles && profiles.length > 0 && !errorLoadingProfiles)
    content = (
    <ul className='mb-3 space-y-3'>
      {/* console.log(JSON.stringify(profiles)) */}
      {profiles.map(profile => (
        <div key={profile.id}>{profile.id} (age: {profile.age}) - {(profile.location / 1000).toFixed(1)} {profile.labels}</div>
        // <li key={profile.id}>
        //   <UserMiniCard
        //     profile={profile}
        //     setProfiles={setProfiles}
        //   />
        // </li>
      ))}

      {/* Spinner */}
      {isLoadingProfiles &&
      (<div className='flex justify-center items-center py-20'>
        <ArrowPathIcon className='inline w-10 text-white animate-spin' />
      </div>)}
    </ul>)
  else if (!profiles && errorLoadingProfiles)
    content = <p>{errorLoadingProfiles}</p>

  return (
    <div className='flex flex-col pt-6 space-y-3'>
      <SearchBox
        searchBoxProps={searchBoxHook}
        profiles={profiles}
        setProfiles={setProfiles}
        requestProfiles={requestProfiles}
        sortProfiles={sortProfiles}
      />
      {content}
      <div className="px-2">
        <button
          className='justify-center bg-transparent border-white border-2 
          rounded-lg hover:bg-white hover:bg-opacity-20 text-white 
          px-4 py-2 mb-2 w-full'
          onClick={() => {
            setPage(prevState => prevState + 1)
          }}
        >
          Load More...
        </button>
      </div>
    </div>
  )
}

export default ProfileList
