import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Chat from '../components/Chat'

// hooks
import useChats from '../hooks/useChats'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

/**
 * REACT COMPONENT
 */
function ChatList() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, accessToken } = useSelector(slices => slices.auth)
  const {
    newConvos,
  } = useSelector(slices => slices.notif)

  // hooks
  const {
    chatList,
    getChatList,
    isLoadingChatList,
    errorLoadingChatList
  } = useChats()
  const navigate = useNavigate()

  /* The useEffect below should re-fetch the chat list if 
  there's a new 'match' notification. */
  React.useEffect(() => {
    if (!isLoggedIn) return navigate('/', { replace: true })

    // if ()
    getChatList({ accessToken, refresh })
  }, [])

  // Create 

  if (!isLoadingChatList && chatList.length === 0)
    return (
      <p className='text-white text-4xl pt-20'>No chats :(</p>
    )

  return (
    <div className="px-4 py-10">
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Conversations</h1>
      {isLoadingChatList ? 'loading...' :
      (<ul className='space-y-2'>
        {chatList?.length > 0 && chatList.map(ch => (
          <Chat
            chat={ch}
            key={ch.id}
          />
      ))}
      </ul>)}
    </div>
  )
}

export default ChatList
