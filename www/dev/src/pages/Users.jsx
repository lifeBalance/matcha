import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useUsers from '../hooks/useUsers'

// components
import UserMiniCard from '../components/UserMiniCard'

// redux
import { useSelector } from 'react-redux'

function Users() {
  const navigate = useNavigate()
  const [counter, setCounter] = React.useState(1)
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const {
    users,
    getUsers,
    isLoadingUsers,
    errorLoadingUsers
  } = useUsers()

  /* When the page loads (or when the user logs out), we run the hook */
  React.useEffect(() => {
    if (isLoggedIn) getUsers({ accessToken })
    else navigate('/', {replace: true})
  }, [isLoggedIn])

  let content // a variable to take logic out from the JSX

  if (isLoadingUsers)
    content = (<p>Loading...</p>)
  else if (users && !errorLoadingUsers && !isLoadingUsers)
    content =
      (<ul className='space-y-2'>
        {users.map(user => (
          <UserMiniCard user={user} key={user.id} />
        ))}
      </ul>)
  else if (!users && errorLoadingUsers)
    content = <p>{errorLoadingUsers}</p>

  return (
    <div className=''>
    <h1 className='text-2xl font-bold text-center'>Users</h1>
      {content}
      {/* mb a button here to load more users (setting a page state; counter) */}
    </div>
  )
}

export default Users