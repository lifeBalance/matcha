import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Notification from '../components/Notification'
// hooks
import useNotifs from '../hooks/useNotifs'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { resetNewNotifs } from '../store/notifSlice'
import { refresh } from '../store/authSlice'

/**
 * REACT COMPONENT
 */
function NotifList() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const { newNotifs } = useSelector(slices => slices.notif)

  // hooks
  const {
    notifs,
    isLoadingNotifList,
    getNotifList,
    deleteNotif
  } = useNotifs()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) return navigate('/', { replace: true })

    getNotifList({ accessToken, refresh })
  }, [newNotifs])

  if (!isLoadingNotifList && notifs.length === 0)
    return (
      <p className='text-white text-4xl pt-20'>No notifications :(</p>
    )

  return (
    <div className="px-4 py-10">
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Notifications</h1>
      {isLoadingNotifList ? 'loading...' :
      (<ul className='space-y-2'>
        {notifs?.length > 0 && notifs.map(n => (
          <Notification
            notif={n}
            key={n.id}
            deleteNotif={() => deleteNotif({
              id: n.id,
              accessToken,
              refresh,
              resetNewNotifs: () => dispatch(resetNewNotifs())
            })}
          />
      ))}
      </ul>)}
    </div>
  )
}

export default NotifList
