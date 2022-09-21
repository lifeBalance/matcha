import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getUser } from '../store/userSlice'

function User() {
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  // redux
  const {
    user,
    errorFetchingUser,
    userIsLoading } = useSelector(slices => slices.user)

  // Redirect if the user is NOT authorized to check other users
  React.useEffect(() => {
    if (isLoggedIn)
      dispatch(getUser({ accessToken, id }))
    else
      navigate('/', {replace: true})
  }, [isLoggedIn])

  return (
    <>
      {!errorFetchingUser && !userIsLoading && user && (<div className=''>
          <h1 className='text-2xl font-bold text-center'>{user.username}</h1>
          <p>{user.email}</p>
      </div>)}

      {userIsLoading && !errorFetchingUser && !user && <p>Loading...</p>}
      {!userIsLoading && errorFetchingUser && !user && <p>{errorFetchingUser}</p>}
    </>
  )
}

export default User