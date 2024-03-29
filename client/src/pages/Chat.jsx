import React from 'react'

// components
import Modal from '../components/UI/Modal'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { resetNewMsgs, setConvoAsSeen } from '../store/notifSlice'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import {
  PaperAirplaneIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

import useChat from '../hooks/useChat'

function Chat() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

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
    id,   // the chat/match id
    uid,  // the profile id
    url,  // the profile pic url
    username
  } = location.state

  const chatId = params.id

  const {
    messageList,
    getMessageList,
    sendMessage,
    isOnline
  } = useChat()

  const [messageInput, setMessageInput] = React.useState('')

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })

    // check if newMessages has item with same id as chat
    if (updatedConvos.includes(chatId)) {
      getMessageList({
        accessToken,
        interlocutor: uid,
        url:          location.pathname
      })
    }
  }, [updatedConvos, isLoggedIn])

  React.useEffect(() => {
    getMessageList({
      accessToken,
      interlocutor: uid,
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
    // If the text area is empty (or just whitespace) clear it and return.
    if (messageInput.trim() === '') {
      setMessageInput('')
      return
    }

    sendMessage({
      url: location.pathname,
      to:  uid,
      msg: messageInput,
      cb:  () => setMessageInput(''),
      accessToken,
      setModalIsOpen
    })
  }

  function handleInput(e) {
    if (e.target.value.length >= 256) return

    setMessageInput(e.target.value)
  }

  function closeModalHandler() {
    setModalIsOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className='flex flex-col space-y-3 mx-2 max-w-4xl'>
      {modalIsOpen &&
        (<Modal closeModal={closeModalHandler}>
          <RocketLaunchIcon className='inline w-6 text-green-500 -mt-2'/>That match is gone dawg!
        </Modal>)
      }
      <div className='flex mt-4 p-2 border border-white rounded-lg'>
        <img src={url} className='w-14 rounded-full mr-4' crossOrigin='anonymous' />

        <div className='flex flex-col'>
          <h1
            className='text-white hover:underline hover:underline-offset-2 hover:text-blue-600 text-lg font-bold ml-1 hover:cursor-pointer'
            onClick={() => navigate(`/profiles/${uid}`, {replace: true})}
          >{username}</h1>

          <div className='flex'>
            <span className={`rounded-full w-3 h-3 block mt-[6px] mr-1 ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></span>
            <p className='text-white'> Online</p>
          </div>
        </div>
      </div>

      <ul className='flex flex-col space-y-2 bg-gray-100 p-2 rounded-lg overflow-y-scroll overscroll-contain h-96 scroll-auto'>
        {messageList.map(m => {
          const classes = m.line.to ===  clientUid ?
          'text-left place-self-start bg-orange-300 rounded-bl-none mr-8'
          :
          'text-right place-self-end bg-pink-400 rounded-br-none ml-8'

          return (<li
            className={`text-white font-bold p-2 rounded-xl drop-shadow-md max-w-60 break-all ${classes}`}
            key={Math.random()}
          >{m.line.content}</li>)
        })}
          {/* Extra list item to force automatic scroll */}
          <li ref={bottomRef}></li>
      </ul>

      <div className="flex flex-col pb-4">
        <div className="flex ">
          <textarea
            type="text"
            value={messageInput}
            onChange={e => handleInput(e)}
            className='outline-none border-none rounded-l-xl w-[70%] text-gray-700 bg-gray-100 text-lg'
          />

          <button
            className='text-white rounded-r-xl border border-l-0 border-white p-4 w-[30%] hover:bg-white hover:bg-opacity-20'
            onClick={handleSendMessage}
            >Send <PaperAirplaneIcon className='w-6 inline -mt-1'/>
          </button>
        </div>
        <p className='text-white pl-4'>{255 - messageInput.length} characters left.</p>
      </div>
    </div>
  )
}

export default Chat
