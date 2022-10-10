import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useUsers from '../hooks/useUsers'

// components
import Hero from '../components/Hero'
import UserMiniCard from '../components/UserMiniCard'

// redux
import { useSelector } from 'react-redux'

function ProfileList() {
  // return (<p> user profiles will go here</p>) // MAINTENANCE WORK BEING DONE!!
  const navigate = useNavigate()

  const {
    isLoggedIn,
    isProfiled,
    accessToken
  } = useSelector((slices) => slices.auth)

  React.useEffect(() => {
    if (!isLoggedIn) return
    if (!isProfiled) navigate('/settings', { replace: true })
    // getProfilePic(accessToken, setProfilePic) // why are we getting profile pic here???
    // }, [profilePic, isLoggedIn, accessToken])
  }, [isProfiled, isLoggedIn, accessToken])

  // For paginated results
  const [page, setPage] = React.useState(1)

  // Users in the list state
  const {
    users,
    getUsers,
    isLoadingUsers,
    errorLoadingUsers
  } = useUsers()

  /* When the page loads (or when the user logs out), we run the hook */
  React.useEffect(() => {
    if (isLoggedIn) getUsers({ accessToken, page })
  }, [isLoggedIn, page])

  // If the user is not logged in, we just return the Hero content
  if (!isLoggedIn) return (<Hero />)

  let content // a variable to take logic out from the JSX

  if (isLoadingUsers) content = <p>Loading...</p>
  else if (users && users.length > 0 && !errorLoadingUsers && !isLoadingUsers)
    content = (
      <ul className='space-y-2'>
        {users.map((user) => (
          <UserMiniCard
            user={user}
            key={user.id}
          />
        ))}
      </ul>
    )
  else if (!users && errorLoadingUsers) content = <p>{errorLoadingUsers}</p>

  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl font-bold text-center'>Users</h1>
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
