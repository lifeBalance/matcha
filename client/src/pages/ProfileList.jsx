import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useGetProfileList from '../hooks/useGetProfileList'

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
    errorLoadingProfiles
  } = useGetProfileList()
  
  /* If the user is logged in but not profiled, we redirect to Settings form */
  React.useEffect(() => {
    if (isLoggingIn) return
    else {
      if (isLoggedIn) {
        if (isProfiled === 0) navigate('/edit', { replace: true })
        if (!isConfirmed) dispatch(logout())
        else if (accessToken) {
          getProfileList({ accessToken, page })
        } else {
          const matcha = localStorage.getItem('matcha')
          dispatch(loginAfterReload(matcha))
        }
      }
    }
  }, [isLoggingIn, isLoggedIn, isProfiled, isConfirmed, accessToken, page])

  // console.log(profiles)  // testing
  // console.log(props)  // testing

  // If the user is not logged in, we just return the Hero content
  if (!isLoggedIn) return (<Hero />)

  let content // a variable to take logic out from the JSX

  // Spinner
  if (isLoadingProfiles) content = 
  (<div className='flex justify-center items-center py-20'>
    <ArrowPathIcon className='inline w-30 text-white animate-spin' />
  </div>)

  else if (profiles && profiles.length > 0 && !errorLoadingProfiles)
    content = (
    <ul className='mb-3 space-y-3'>
      {/* console.log(JSON.stringify(profiles)) */}
      {profiles.map(profile => (
        <li key={profile.id}>
          <UserMiniCard
            profile={profile}
            setProfiles={setProfiles}
          />
        </li>
      ))}
    </ul>)
  else if (!profiles && errorLoadingProfiles)
    content = <p>{errorLoadingProfiles}</p>

  return (
    <div className='flex flex-col pt-6 space-y-3'>
      <SearchBox />
      {content}
      <div className="px-2">
        <button
          className='justify-center bg-transparent border-white border-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white px-4 py-2 mb-2 w-full'
          onClick={(e) => {
            e.stopPropagation()
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
