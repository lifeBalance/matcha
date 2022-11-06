import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Notification from '../components/Notification'

//icons
import { TrashIcon } from '@heroicons/react/24/outline'

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
      <button
        className='justify-center bg-transparent border-white border-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white px-4 py-2 mb-2 w-full'
        onClick={() => deleteNotif({
          id: 'all',
          accessToken,
          refresh,
          resetNewNotifs: () => dispatch(resetNewNotifs())
        })}
      >
        <TrashIcon className='inline w-6 -mt-1 mr-1'/>
        Clear All Notifications
      </button>
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
