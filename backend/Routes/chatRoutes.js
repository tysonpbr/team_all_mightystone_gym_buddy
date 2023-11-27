const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../MongoDB/Connect.js');

const router = express.Router();

// ALL REST OPERATIONS
// - Get all chats by user id 
// - Get chat by chat id 
// - Get chat by user ids

// HELPER FUNCTIONS
// - create new chat 
// - add chat to user
// - check for chat 


//ChatGPT use: NO
const createNewChat = async (db, senderId, recieverId) => {
  try {
    const newChat = {
      members: [
        senderId,
        recieverId
      ],
      messages: []
    }

    const result = await db.collection('chat').insertOne(newChat);

    if (!result || !result.insertedId) {
      return 0;
    }

    const resSender = await addChatToUser(db, senderId, result.insertedId.toString());
    if (!resSender) {
      return 0;
    }

    const resReciever = await addChatToUser(db, recieverId, result.insertedId.toString());
    if (!resReciever) {
      return 0;
    }

    return result.insertedId.toString();
  } catch (error) {
    return 0;
  }
}

//ChatGPT use: NO
const addChatToUser = async (db, userId, chatId) => {
  try {
    const id = new ObjectId(userId);

    const user = await db.collection('users').findOne({ _id: id });

    if (!user) {
      return 0;
    }

    const chatsList = user.chats;

    if (!chatsList) {
      return 0;
    }

    chatsList.push({
      chatId: chatId,
      notification: 0
    });

    const result = await db.collection('users').updateOne(
      { _id: id },
      { 
        $set: {
          chats: chatsList
        } 
      }
    );

    if (result.matchedCount === 0) {
      return 0;
    } else {
      return 1;
    }
  } catch (error) {
    return 0;
  }
}

//ChatGPT use: NO
const checkForChat = async (db, user1, user2) => {
  try {
    return db.collection('chat').findOne({ 
      $and: [
        {
          members: {
            $elemMatch: {
              $eq: user1
            }
          }
        },
        {
          members: {
            $elemMatch: {
              $eq: user2
            }
          }
        }
      ]
    });
  } catch (error) {
    return 0;
  }
}

//ChatGPT use: NO
// Get all chats by user ID
router.get('/allChats/:userId', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.userId);

    const user = await db.collection('users').findOne({ _id: id });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    if (!result) {
      res.status(404).send('User not found');
      return;
    }

    const allChats = user.chats;
    const chats = [];

    for (const _chat of allChats) {
      const cid = new ObjectId(_chat.chatId);
      const chat = await db.collection('chat').findOne({ _id: cid });

      if (chat) {
        let otherId = chat.members[0];

        if (otherId == req.params.userId) {
          otherId = chat.members[1];
        }

        const _id = new ObjectId(otherId);
        const otherUser = await db.collection('users').findOne({ _id: _id });

        if (!otherUser) {
          res.status(404).send('User not found');
          return;
        }

        const i = chat.messages.length;

        chats.push({
          chatId: _chat.chatId,
          notification: _chat.notification,
          name: otherUser.name
        });
      }
    }

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).send('Chats not retrieved');
  }
});

//ChatGPT use: NO
// Get a chat by chat id
router.get('/chatId/:chatId', async (req, res) => {
  try {
    const db = getDB();
    const id = new ObjectId(req.params.chatId);

    const chat = await db.collection('chat').findOne({ _id: id });

    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(404).send("No chat found");
    }
  } catch (error) {
    res.status(404).send("No chat found");
  }
});

//ChatGPT use: NO
// Get a chat by user ids
router.get('/userId/:user1/:user2', async (req, res) => {
  try {
    const db = getDB();
    const user1 = req.params.user1;
    const user2 = req.params.user2;

    const chat = await checkForChat(db, user1, user2);

    if (chat) {
      res.status(200).json(chat);
    } else {
      const newChatId = await createNewChat(db, user1, user2);
      const newChat = await db.collection('chat').findOne({ _id: newChatId });

      if (newChat) {
        res.status(200).json(newChat);
      } else {
        res.status(500).send("Failed to create chat");
      }
    }
  } catch (error) {
    res.status(404).send("No chat found");
  }
});
module.exports = router;