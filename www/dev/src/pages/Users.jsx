import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getUsers } from '../store/usersSlice'

function Test() {
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const { users, error, isLoading } = useSelector(slices => slices.users)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  /* When the page loads, or where the user logs out, we run the hook */
  React.useEffect(() => {
    if (isLoggedIn)
      dispatch(getUsers({ accessToken }))
    else
      navigate('/', {replace: true})
  }, [isLoggedIn])

  let contentElem 

  if (isLoading)
    contentElem = (<p>Loading...</p>)
  else if (users && !error && !isLoading)
    contentElem =
      (<ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`${user.id}`}>{user.id} {user.username} {user.email}</Link>
          </li>
        ))}
      </ul>)
  else if (!users && error)
    contentElem = <p>{error}</p>

  return (
    <div className=''>
    <h1 className='text-2xl font-bold text-center'>Users</h1>
      {contentElem}
    </div>
  )
}

export default Test