import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useGetProfileList from '../hooks/useGetProfileList'

// components
import Hero from '../components/Hero'
import UserMiniCard from '../components/UserMiniCard'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

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

  /* If the user is logged in but not profiled, we redirect to Settings form */
  React.useEffect(() => {
    if (isLoggedIn && isProfiled === 0) navigate('/edit', { replace: true })
  }, [isProfiled, isLoggedIn])

  /* If the user modified her email settings and as a result has to
  confirm her Account, we log her out. */
  // React.useEffect(() => {
  //   if (!isConfirmed) dispatch(logout())
  // }, [isConfirmed])

  
  /* When the page loads (or when the user logs out), we run the hook */
  React.useEffect(() => {
    if (isLoggingIn) return
    if (isLoggedIn && accessToken) getProfileList({ accessToken, page })
  }, [isLoggingIn, isLoggedIn, accessToken, page])
  
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
    <ul className='space-y-6'>
      {profiles.map((user) => (
        <UserMiniCard
          user={user}
          key={user.id}
        />
      ))}
    </ul>)
  else if (!profiles && errorLoadingProfiles)
    content = <p>{errorLoadingProfiles}</p>

  return (
    <div className='flex flex-col pt-6'>
      {content}

      <button
        className='justify-center bg-slate-500 px-4 py-2'
        onClick={() => setPage((prevState) => prevState + 1)}
      >
        Load More...
      </button>
    </div>
  )
}

export default ProfileList
