import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Notification from '../components/Notification'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getNotifs } from '../store/notifSlice'

/**
 * REACT COMPONENT
 */
function NotifList() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const { notifications, isLoadingNotifs, newNotifs } = useSelector(slices => slices.notif)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) return navigate('/', { replace: true })

    dispatch(getNotifs({ accessToken }))
  }, [])

  if (!isLoadingNotifs && notifications.length === 0)
    return (
      <p className='text-white text-4xl pt-20'>No notifications :(</p>
    )

  return (
    <div className="px-4 py-10">
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Notifications</h1>
      {isLoadingNotifs ? 'loading...' :
      (<ul className='space-y-2'>
        {notifications?.length > 0 && notifications.map(n => (
          <Notification
            notif={n}
            key={n.id}
          />
      ))}
      </ul>)}
    </div>
  )
}

export default NotifList
