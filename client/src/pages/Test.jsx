import React from 'react'

import socketIO from 'socket.io-client'

import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import terry from '../assets/terry.jpg' // placeholder image

function Test() {
  const [socket, setSocket] = React.useState(null)
  const [roomInput, setRoomInput] = React.useState('')
  const [room, setRoom] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [messageList, setMessageList] = React.useState([])
  const [socketId, setSocketId] = React.useState(null)
  // Scroll to bottom trick.
  const bottomRef = React.useRef(null)

  React.useEffect(() => {
    const tmp = socketIO.connect('http://localhost')
    setSocket(tmp)

    // Clean up connection when component unmounts.
    return () => tmp.disconnect()
  }, [])

  /*  Not necessary; just wanted to set the socket id, 
    in local state, in case I need it later. */
  React.useEffect(() => {
    if (!socket) return   // bail if socket is not ready yet!

    socket.on('connected', () => {
      setSocketId(socket.id)
    })
  }, [socket])

  function joinRoom() {
    if (!socket) return

    socket.emit('join-room', roomInput)
  }
  /* We don't set the 'room' local state until we don't 
    receive the 'room-joined' event from the server. */
  React.useEffect(() => {
    if (!socket) return

    socket.on('room-joined', num => {
      // console.log(`Room ${num} joined`) // testing
      setRoom(num)
    })
  }, [socket, room])

  function sendMessage() {
    if (!socket || !room || message.trim() === '') return

    // console.log(`sending msg to room ${room} from ${socketId}: ${message}`) // testing

    socket.emit('msg', {
      socketId: socket.id,
      message,
      room
    })   // Send the 'msg' event (and message) to the server.

    // Add our OWN MESSAGE to local state.
    setMessageList([...messageList, {
      message,
      own: true
    }])
    setMessage('')                // Clear the input text.
  }

  React.useEffect(() => {
    if (!socket || !room) return

    // Update 'messageList' when a 'msg' is received.
    socket.on('msg', data => {
      setMessageList([...messageList, data])
    })
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [socket, room, messageList])

  console.log(`Room: ${room} - Socket ID: ${socketId}`) // testing

  return (
    <div className='flex flex-col space-y-3 mx-2'>
      <div className='flex mt-4 p-2 border border-white rounded-lg'>
        {/* Placeholder user profile pic (later dynamic) */}
        <img src={terry} className='w-14 rounded-full mr-4' />

        <div className='flex flex-col'>
          {/* Placeholder username (later dynamic) */}
          <h1 className='text-white text-lg font-bold ml-1'>Terry</h1>

          <div className='flex'>
            <span className='bg-green-500 rounded-full w-4 h-4 block mt-1 mr-1'></span>
            <p className='text-white'> Online</p>
          </div>
        </div>
      </div>

      <ul className='flex flex-col space-y-2 bg-gray-100 p-2 rounded-lg overflow-y-scroll overscroll-contain h-96 scroll-auto'>
        {messageList.map(msg => {
          const classes = msg.own ?
            'text-right place-self-end bg-pink-400'
            :
            'text-left place-self-start bg-orange-300'

          return (<li
            className={`text-white font-bold p-2 rounded-xl drop-shadow-md max-w-60 break-all ${classes}`}
            key={Math.random()}
          >{msg.message}</li>)
        })}
          {/* Extra list item to force automatic scroll */}
          <li ref={bottomRef}></li>
      </ul>

      <div className="flex pb-4">
        <textarea
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className='outline-none border-none rounded-l-xl w-[70%] text-gray-700 bg-gray-100 text-lg'
        />

        <button
          className='text-white rounded-r-xl border border-l-0 border-white p-4 w-[30%] hover:bg-white hover:bg-opacity-20'
          onClick={sendMessage}
        >Send <PaperAirplaneIcon className='w-6 inline -mt-1'/></button>
      </div>

      {/* Join Room button for Testing purposes; later on, rooms will 
        be join automatically according to their route parameter. */}
      <div className="flex">
        <input
          id='room'
          type="text"
          value={roomInput}
          onChange={e => setRoomInput(e.target.value)}
          className='outline-none border-none rounded-l-md'
        />

        <button
          htmlFor="room"
          className='text-white rounded-r-md border border-l-0 border-white p-4'
          onClick={joinRoom}
        >Join Room</button>
      </div>
    </div>
  )
}

export default Test
