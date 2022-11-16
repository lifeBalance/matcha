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
    const filters = ['age', 'rated', 'location', 'tags']
    const orderBy = filters[searchBoxHook.orderBy]
    // console.log('criteria '+orderBy) // testing

    // We need special logic to sort profiles by tags in common!!
    if (orderBy === 'tags') {
      // const searchTags = searchBoxProps.tags.map(i => i.label)
      if (searchBoxHook.ascendingOrder == 0) {
        setProfiles(prev => prev.sort((a, b) => {
          return intersection(a[orderBy], searchTags).length - intersection(b[orderBy], searchTags).length
        }))
      } else {
        setProfiles(prev => prev.sort((a, b) => {
          return intersection(b[orderBy], searchTags).length - intersection(a[orderBy], searchTags).length
        }))
      }
    } else {
      if (searchBoxHook.ascendingOrder == 0) {
        setProfiles(prev => prev.sort((a, b) => {
          return Number(a[orderBy]) - Number(b[orderBy])
        }))
      } else if (searchBoxHook.ascendingOrder == 1) {
        setProfiles(prev => prev.sort((a, b) => {
          return Number(b[orderBy]) - Number(a[orderBy])
        }))
      }
    }
    // console.log(profiles)
  }, [searchBoxHook.orderBy, searchBoxHook.ascendingOrder])
  
  function requestProfiles() {
    console.log(searchBoxHook.locationRange);
    getProfileList({
      accessToken,
      page,
      distRange:  searchBoxHook.locationRange,
      ageRange:   searchBoxHook.ageRange,
      setAllTags: searchBoxHook.setAllTags
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
          getProfileList({
            accessToken,
            page,
            distRange:  searchBoxHook.locationRange,
            ageRange:   searchBoxHook.ageRange,
            setAllTags: searchBoxHook.setAllTags
          })
        } else {
          const matcha = localStorage.getItem('matcha')
          dispatch(loginAfterReload(matcha))
        }
      }
    }
  }, [isLoggingIn, isLoggedIn, isProfiled, isConfirmed, accessToken, page])

  React.useEffect(() => {
    console.log(`new search? ${newSearch}`);
    setNewSearch(true)
    setPage(1)
  }, [searchBoxHook.locationRange, searchBoxHook.ageRange])

  // If the user is not logged in, we just return the Hero content
  if (!isLoggedIn) return (<Hero />)

  let content // a variable to take logic out from the JSX

  if (profiles && profiles.length > 0 && !errorLoadingProfiles)
    content = (
    <ul className='mb-3 space-y-3'>
      {/* console.log(JSON.stringify(profiles)) */}
      {profiles.map(profile => (
        <div>{profile.id} (age: {profile.age}) - {(profile.location / 1000).toFixed(1)}</div>
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
