import React from 'react'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { resetNewMsgs, setConvoAsSeen } from '../store/notifSlice'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import useChat from '../hooks/useChat'

function Chat() {
  // react-router
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  // Scroll to bottom trick.
  const bottomRef = React.useRef(null)
  
  // redux
  const dispatch = useDispatch()
  const {
    isLoggedIn,
    accessToken,
    uid: clientUid
  } = useSelector(slices => slices.auth)
  const {
    updatedConvos
  } = useSelector(slices => slices.notif)

  const {
    id,
    uid,
    url, // the pic url
    username
  } = location.state

  const chatId = params.id

  const {
    messageList,
    getMessageList,
    sendMessage
  } = useChat()

  const [messageInput, setMessageInput] = React.useState('')

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })

    // check if newMessages has item with same id as chat
    if (updatedConvos.includes(chatId)) {
      getMessageList({
        accessToken,
        interlocutor: id,
        url:          location.pathname
      })
    }
  }, [updatedConvos])

  React.useEffect(() => {
    getMessageList({
      accessToken,
      interlocutor: id,
      url:          location.pathname
    })
  }, [])
  
  React.useEffect(() => {
    dispatch(resetNewMsgs())
    dispatch(setConvoAsSeen(id.toString()))
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messageList])
  
  React.useEffect(() => {
    dispatch(setConvoAsSeen(id.toString()))
  }, [])

  function handleSendMessage() {
    sendMessage({
      url: location.pathname,
      to:  uid,
      msg: messageInput,
      cb:  () => setMessageInput(''),
      accessToken
    })
  }

  return (
    <div className='flex flex-col space-y-3 mx-2'>
      <div className='flex mt-4 p-2 border border-white rounded-lg'>
        {/* Placeholder user profile pic (later dynamic) */}
        <img src={url} className='w-14 rounded-full mr-4' />

        <div className='flex flex-col'>
          {/* Placeholder username (later dynamic) */}
          <h1 className='text-white text-lg font-bold ml-1'>{username}</h1>

          <div className='flex'>
            <span className='bg-green-500 rounded-full w-4 h-4 block mt-1 mr-1'></span>
            <p className='text-white'> Online</p>
          </div>
        </div>
      </div>

      <ul className='flex flex-col space-y-2 bg-gray-100 p-2 rounded-lg overflow-y-scroll overscroll-contain h-96 scroll-auto'>
        {messageList.map(m => {
          const classes = m.line.to ===  clientUid ?
          'text-left place-self-start bg-orange-300'
          :
          'text-right place-self-end bg-pink-400'

          return (<li
            className={`text-white font-bold p-2 rounded-xl drop-shadow-md max-w-60 break-all ${classes}`}
            key={Math.random()}
          >{m.line.content}</li>)
        })}
          {/* Extra list item to force automatic scroll */}
          <li ref={bottomRef}></li>
      </ul>

      <div className="flex pb-4">
        <textarea
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          className='outline-none border-none rounded-l-xl w-[70%] text-gray-700 bg-gray-100 text-lg'
        />

        <button
          className='text-white rounded-r-xl border border-l-0 border-white p-4 w-[30%] hover:bg-white hover:bg-opacity-20'
          onClick={handleSendMessage}
        >Send <PaperAirplaneIcon className='w-6 inline -mt-1'/></button>
      </div>
    </div>
  )
}

export default Chat
