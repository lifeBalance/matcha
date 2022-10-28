import React from 'react'

import socketIO from 'socket.io-client'

function Test() {
  const [socket, setSocket] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [messageList, setMessageList] = React.useState([])
  const [socketId, setSocketId] = React.useState(null)

  React.useEffect(() => {
    const tmp = socketIO.connect('http://localhost')
    setSocket(tmp)
    return () => tmp.disconnect()
  }, [])

  React.useEffect(() => {
    if (!socket) return

    socket.on('connected', () => {
      setSocketId(socket.id)
    })
  }, [socket])
  
  React.useEffect(() => {
    if (!socket) return

    socket.on('msg', msg => {
      setMessageList([...messageList, msg])
    })
  }, [socket, messageList])

  function sendMessage() {
    if (!socket) return

    socket.emit('msg', message)   // send the message to the server
    setMessage('')                // clear the input text
  }

  return (
    <div className='flex flex-col space-y-3'>
      <h1 className='text-white text-2xl'>Chat {socketId}</h1>

      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button
        className='text-white rounded-md border border-white p-4'
        onClick={sendMessage}>
        Send message
      </button>

      <ul>
        {messageList.map(msg => (
          <li
            className='text-white'
            key={Math.random()}
          >{msg}</li>
        ))}
      </ul>
    </div>
  )
}

export default Test
