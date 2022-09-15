import React from 'react'
import Layout from '../components/UI/Layout'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, test } from '../store/usersSlice'

function Test() {
  const { users, error, isLoading } = useSelector(slices => slices.users)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getUsers())
  }, [])

  let contentElem 

  if (isLoading)
    contentElem = (<p>Loading...</p>)
  else if (users && !error)
    contentElem = (<ul>{users.map(user => (<p key={user.id}>{user.id} {user.username} {user.email}</p>))}</ul>)
  else if (!users && error)
    contentElem = <p>{error}</p>

  return (
    <Layout>
      <h1 className='text-2xl font-bold text-center'>Users</h1>
      {contentElem}
    </Layout>
  )
}

export default Test