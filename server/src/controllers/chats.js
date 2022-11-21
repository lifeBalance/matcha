const ChatModel = require('../models/Chat')
const MatchModel = require('../models/Match')
const NotifModel = require('../models/Notif')
const ProfileModel = require('../models/Profile')

const io = require('../../index')

exports.getChats = async (req, res, next) => {
  try {
    if (!req.uid) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no uid in token'
      })
    }
    // console.log(`chats controller - uid: ${req.uid}`) // testing

    const chatList = await ChatModel.readChatList({
      uid: req.uid
    })
    // console.log(`chats controller - readChatList: ${JSON.stringify(chatList)}`) // testing

    return res.status(200).json({
      type:     'SUCCESS',
      message:  'your matches/chats',
      chats:   chatList
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.getMessageList = async (req, res, next) => {
  try {
    // console.log(`chats contr. - req.query: ${JSON.stringify(req.query)}`);
    if (!req.uid) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no uid in token'
      })
    }

    // console.log(`chats controller - chat id: ${req.params.id}`) // testing
    const msgList = await ChatModel.readMessageList({
      chat_id: req.params.id
    })
    // console.log(`chats controller - msgList: ${JSON.stringify(msgList)}`) // testing

    const isOnline = await ProfileModel.isOnline({ id: parseInt(req.query.interlocutor) })
  
    return res.status(200).json({
      type:         'SUCCESS',
      message:      'your messages',
      messageList:  msgList,
      online:       isOnline
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.writeMessage = async (req, res, next) => {
  try {
    // console.log(`req.uid: ${req.uid}, req.body.to: ${req.body.to}`)
    if (!req.uid || !req.body.to) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no uid in token'
      })
    }
    const matchId = await MatchModel.readMatchId({
      liker:  req.uid,
      liked:  req.body.to
    })
    // console.log(`matchId: ${matchId}`)

    if (!matchId) {
      // sent response so that client redirects to main page
      return res.status(200).json({
        type:     'ERROR',
        message:  'no such chat'
      })
    }

    // console.log(`chats controller - chat id: ${req.params.id}`) // testing

    // Let's compose what we want to write to DB.
    const msg = {
      from:     req.uid,
      to:       req.body.to,
      content:  req.body.msg.substring(0, 255)
    }
    // console.log(`chats controller - msg: ${JSON.stringify(msg)}`) // testing
    // The query returns the id of the row written
    const msgId = await ChatModel.writeMessage({
      chatId:   req.params.id,
      msg:      msg
    })
    // console.log(`chats controller - msgId: ${msgId}`) // testing
    
    // Let's pull data from the sender to write notification intel to DB
    const sender = await ProfileModel.readOne({
      id: req.uid
    })
    const senderProfilePic = sender.pics.find(pic => pic.profile === 1)

    // Emit notification to interlocutor
    io.io.to(req.body.to).emit('notify', {
      type:   'message',
      chatId: req.params.id,
      msgId:  msgId,
      msg:    msg,
      to:     req.body.to
    })

    return res.status(200).json({
      type:         'SUCCESS',
      message:      'message sent',
      msg:          {
        id:       msgId,
        chat_id:  req.params.id,
        line:     msg
      }
    })
  } catch(error) {
    console.log(error)
    next(error)
  }
}

exports.deleteChat = async (req, res, next) => {
  try {
    // console.log('NOTIF ID: '+req.body.chat_id) // testing
    if (!req.body.chat_id) {
      return res.status(200).json({
        type:     'ERROR',
        message:  'no chat id supplied in the request'
      })
    }

    const success = await ChatModel.deleteChat({
      chat_id: req.body.chat_id
    })

    if (success) {
      res.status(200).json({
        type: 'SUCCESS',
        message: 'chat successfully deleted',
        chat_id: req.body.chat_id
      })
      // console.log('CHAT ID: '+req.body.chat_id) // testing
    } else {
      res.status(200).json({
        type: 'ERROR',
        message: 'we could not delete the chat'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
