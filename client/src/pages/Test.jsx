import React from 'react'

import socketIO from 'socket.io-client'

function Test() {
  const [socket, setSocket] = React.useState(null)
  const [roomInput, setRoomInput] = React.useState(null)
  const [room, setRoom] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [messageList, setMessageList] = React.useState([])
  const [socketId, setSocketId] = React.useState(null)

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
  /* We don't set the room until we don't receive 
    the 'room-joined' event from the server. */
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
  }, [socket, room, messageList])

  return (
    <div className='flex flex-col space-y-3'>
      <h1 className='text-white text-2xl'>Chat</h1>
      <div className="flex">
        <input
          id='room'
          type="text"
          value={roomInput}
          onChange={e => setRoomInput(e.target.value)}
        />

        <button
          htmlFor="room"
          className='text-white rounded-md border border-white p-4'
          onClick={joinRoom}
        >Choose Room</button>
      </div>

      <h1 className='text-white text-2xl'>Socket ID: {socketId}</h1>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button
        className='text-white rounded-md border border-white p-4'
        onClick={sendMessage}
      >
        Send message
      </button>

      <h2 className='text-white text-xl text-center font-bold'>
        Room {room}
      </h2>

      <ul className='grid space-y-2 bg-white p-2 rounded-lg'>
        {messageList.map(msg => {
          const classes = msg.own ?
            'text-left place-self-start bg-pink-400'
            :
            'text-right place-self-end bg-orange-300'

          return (<li
            className={`text-white font-bold p-2 rounded-xl drop-shadow-md ${classes}`}
            key={Math.random()}
          >
            <span>{msg.message}</span>
          </li>)
        })}
      </ul>
    </div>
  )
}

export default Test
