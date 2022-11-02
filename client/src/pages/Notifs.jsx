import React from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'

// hooks
import useGetNotifs from '../hooks/useGetNotifs'

// components
import Modal from '../components/UI/Modal'
import Notification from '../components/Notification'

//icons
import { HandRaisedIcon, QuestionMarkCircle } from '../components/Icons/icons'

// redux
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteNotif
} from '../store/notifSlice'


/**
 * REACT COMPONENT
 */
function Notifs() {
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
    notifs,
    setNotifs,
    getNotifList,
    isLoadingNotifs,
    errorLoadingNotifs,
  } = useGetNotifs()

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) {
      return navigate('/', { replace: true })
    }
    getNotifList({
      accessToken,
      // callback: setNotifsState
    })
    console.log(notifs);
  }, [])

  return (
      <div className="px-4 py-10">
        <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Notifications</h1>

        <ul className='space-y-2'>
          {notifs?.length && notifs.map(n => (
            <Notification notif={n} />
          ))}
        </ul>
      </div>
  )
}

export default Notifs
