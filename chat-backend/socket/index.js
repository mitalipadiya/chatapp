const socketIo = require('socket.io');
const Message = require('../models').Message

const users = new Map()
const userSockets = new Map()

const SocketServer = (server) => {
    const io = socketIo(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        socket.on('join', async (user) => {

            let sockets = []

            if (users.has(user.id)) {
                const existingUser = users.get(user.id)
                existingUser.sockets = [...existingUser.sockets, ...[socket.id]]
                users.set(user.id, existingUser)
                sockets = [...existingUser.sockets, ...[socket.id]]
                userSockets.set(socket.id, user.id)
            } else {
                users.set(user.id, { id: user.id, sockets: [socket.id] })
                sockets.push(socket.id)
                userSockets.set(socket.id, user.id)
            }
        })
        socket.on('disconnect', async () => {

            if (userSockets.has(socket.id)) {

                const user = users.get(userSockets.get(socket.id))

                if (user.sockets.length > 1) {

                    user.sockets = user.sockets.filter(sock => {
                        if (sock !== socket.id) return true

                        userSockets.delete(sock)
                        return false
                    })

                    users.set(user.id, user)

                } else {
                    userSockets.delete(socket.id)
                    users.delete(user.id)
                }
            }

        })
        socket.on('message', async (message) => {
            let sockets = []

            if (users.has(message.fromUser.id)) {
                sockets = users.get(message.fromUser.id).sockets
            }

            message.toUserId.forEach(id => {
                if (users.has(id)) {
                    sockets = [...sockets, ...users.get(id).sockets]
                }
            })

            try {
                const msg = {
                    type: message.type,
                    fromUserId: message.fromUser.id,
                    chatId: message.chatId,
                    message: message.message
                }

                const savedMessage = await Message.create(msg)

                message.User = message.fromUser
                message.fromUserId = message.fromUser.id
                message.id = savedMessage.id
                message.message = savedMessage.message
                delete message.fromUser

                sockets.forEach(socket => {
                    io.to(socket).emit('received', message)
                })

            } catch (e) { }

        })

        socket.on('add-friend', (chats) => {

            try {
                if (users.has(chats[1].Users[0].id)) {
                    users.get(chats[1].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new-chat', chats[0])
                    })
                }

                if (users.has(chats[0].Users[0].id)) {
                    users.get(chats[0].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new-chat', chats[1])
                    })
                }

            } catch (e) { }

        })
    })

}

module.exports = SocketServer