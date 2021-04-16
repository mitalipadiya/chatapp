import { useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import { setSocket, receivedMessage, createChat } from '../../../store/actions/chat'


function useSocket(user, dispatch) {

    useEffect(() => {
        const socket = socketIOClient.connect('http://127.0.0.1:3000')
        dispatch(setSocket(socket))
        socket.emit('join', user)

        socket.on('received', (message) => {
            dispatch(receivedMessage(message, user.id))
        })
        socket.on('new-chat', (chat) => {
            dispatch(createChat(chat))
        })
        
    }, [dispatch]);
}

export default useSocket