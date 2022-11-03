import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Notification from '../components/Notification'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { resetNewNotifs } from '../store/notifSlice'

/**
 * REACT COMPONENT
 */
function NotifList() {
  // Redux
  const dispatch = useDispatch()
  const {
    isLoggedIn,
    isLoggingIn,
    isProfiled,
    errorLoggingIn,
    accessToken
  } = useSelector(slices => slices.auth)

  const {
    notifications
  } = useSelector(slices => slices.notif)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      return navigate('/', { replace: true })
    }

    // reset NEW notifications counter
    dispatch(resetNewNotifs())
  }, [])

  return (
      <div className="px-4 py-10">
        <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Notifications</h1>

        <ul className='space-y-2'>
          {notifications?.length > 0 && notifications.map(n => (
            <Notification notif={n} />
          ))}
        </ul>
      </div>
  )
}

export default NotifList
