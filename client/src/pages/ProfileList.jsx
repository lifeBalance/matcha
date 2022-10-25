import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useGetProfileList from '../hooks/useGetProfileList'

// components
import Hero from '../components/Hero'
import UserMiniCard from '../components/UserMiniCard'

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

  // For paginated results
  const [page, setPage] = React.useState(1)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

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


  // Profile list state
  const {
    profiles,
    getProfileList,
    isLoadingProfiles,
    errorLoadingProfiles
  } = useGetProfileList()

  // If the user is not logged in, we just return the Hero content
  if (!isLoggedIn) return (<Hero />)

  let content // a variable to take logic out from the JSX

  if (isLoadingProfiles) content = <p>Loading...</p>
  else if (profiles && profiles.length > 0 && !errorLoadingProfiles && !isLoadingProfiles)
    content = (
    <ul className='space-y-3 mb-3'>
      {/* console.log(JSON.stringify(profiles)) */}
      {profiles.map(profile => (
        <UserMiniCard
          key={profile.id}
          profile={profile}
        />
      ))}
    </ul>)
  else if (!profiles && errorLoadingProfiles)
    content = <p>{errorLoadingProfiles}</p>

  return (
    <div className='flex flex-col pt-6'>
      {content}

      <button
        className='justify-center bg-transparent border-white border-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white px-4 py-2'
        onClick={() => setPage((prevState) => prevState + 1)}
      >
        Load More...
      </button>
    </div>
  )
}

export default ProfileList
