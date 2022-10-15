import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useGetProfileList from '../hooks/useGetProfileList'

// components
import Hero from '../components/Hero'
import UserMiniCard from '../components/UserMiniCard'

// redux
import { useSelector } from 'react-redux'

function ProfileList() {
  // return (<p> user profiles will go here</p>) // MAINTENANCE WORK BEING DONE!!
  const navigate = useNavigate()
  const [isProfiled, setIsProfiled] = React.useState(null)

  const {
    isLoggedIn,
    accessToken
  } = useSelector((slices) => slices.auth)

  React.useEffect(() => {
    if (isProfiled === 0) navigate('/settings', { replace: true })
    // getProfilePic(accessToken, setProfilePic) // why are we getting profile pic here???
    // }, [profilePic, isLoggedIn, accessToken])
  }, [isProfiled])

  // For paginated results
  const [page, setPage] = React.useState(1)

  // Profile list state
  const {
    profiles,
    getProfileList,
    isLoadingProfiles,
    errorLoadingProfiles
  } = useGetProfileList()

  function setProfiledState(data) {
    setIsProfiled(data)
  }

  /* When the page loads (or when the user logs out), we run the hook */
  React.useEffect(() => {
    if (isLoggedIn) getProfileList({ accessToken, page, setProfiledState })
  }, [isLoggedIn, page])

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
