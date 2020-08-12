const express = require('express');
const router = express.Router();
const { validate, Chat } = require('../models/Chat');
const { User } = require('../models/User');

router.get('/', async (req, res, next) => {
  const chats = await Chat.find()
  return res.send(chats);
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const chat = await Chat.findById(id)
    return res.status(200).send(chat)
  } catch{
    return res.send("Something went wrong")
  }
})


router.post('/', async (req, res, next) => {
  const { members } = req.body;
  try {
    console.log(members)
    const chat = new Chat({ members })
    await chat.save()
    return res.send(chat)
  } catch (e) {
    console.log(e.message)
    return res.status(400).send(e.message)
  }
})


router.get('/:id/chatlist', async (req, res, next) => {
  const { id } = req.params;

  try {
    const list = await Chat.find({ 'members.member': id, flag: true })
    if (list.length === 0) return res.status(200).send(list)
    let _list = []

    for (let i = 0; i < list.length; i++){
      sender = list[i].members.find(x => (x.member).toString() !== (id).toString()).member
      _list.push({...list[i]._doc, sender: (await User.findById(sender)).name})
    }
  
    return res.status(200).send(_list)
  } catch {
    return res.status(400).send(e.message)
  }
})

router.get('/:id/:user_id/messages', async (req, res, next) => {
  const { id, user_id } = req.params;
  console.log(user_id)
  try {
    let chat = await Chat.findById(id)
    if (!chat) return res.status(404).send("Not Chat Found")
    let _chat = []
    chat.messages.map((message, key) => {
      console.log(message)
      let _message = {
        id: key,
        type: 'text',
        content: message.body,
        targetId: ((message.user_id).toString() === (user_id).toString()) ? "88886666" : "12345678",
        chatInfo: {
          id: "12345678"
        },
        renderTime: true,
        sendStatus: 1,
        time: new Date(message.time).getTime()
      }
      _chat.push(_message)
    })

    return res.status(200).send(_chat)
  } catch {
    return res.status(400).send("Something went wrong")
  }
})


router.put('/:id/:user_id', async (req, res, next) => {
  const { message } = req.body;
  const { id, user_id } = req.params;

  try {
    const chat = await Chat.findByIdAndUpdate({ _id: id }, { $push: { messages: message } })
    if (!chat) return res.status(404).send("Not Chat Found")
    chat.messages.push(message)
    let _chat = []
    chat.messages.map((message, key) => {
      console.log(message)
      let _message = {
        id: key,
        type: 'text',
        content: message.body,
        targetId: ((message.user_id).toString() === (user_id).toString()) ? "88886666" : "12345678",
        chatInfo: {
          id: "12345678"
        },
        renderTime: true,
        sendStatus: 1,
        time: new Date(message.time).getTime()
      }
      _chat.push(_message)
    })
    return res.status(200).send(_chat)
  } catch {
    return res.status(400).send("something went wrong")
  }
})

module.exports = router; 
