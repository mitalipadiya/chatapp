import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementScroll } from '../../../../store/actions/chat'

const MessageInput = ({ chat }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.authReducer.user)
    const socket = useSelector(state => state.chatReducer.socket)
    const newMessage = useSelector(state => state.chatReducer.newMessage)

    const msgInput = useRef()

    const [message, setMessage] = useState('')

    const handleMessage = (e) => {
        const value = e.target.value
        setMessage(value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage()
    }

    const sendMessage = () => {

        if (message.length < 1) return

        const msg = {
            type: 'text',
            fromUser: user,
            toUserId: chat.Users.map(user => user.id),
            chatId: chat.id,
            message: message
        }

        setMessage('')

        // send message with socket
        socket.emit('message', msg)
    }

    useEffect(() => {
        const msgBox = document.getElementById('msg-box')
        if (!newMessage.seen && newMessage.chatId === chat.id && msgBox.scrollHeight !== msgBox.clientHeight) {
            if (msgBox.scrollTop > msgBox.scrollHeight * 0.30) {
                dispatch(incrementScroll())
            }
        }
    }, [newMessage, dispatch])
    return (
        <div id='input-container'>
            <div id='message-input'>
                <input
                    ref={msgInput}
                    value={message}
                    type='text'
                    placeholder='Message...'
                    onChange={e => handleMessage(e)}
                    onKeyDown={e => handleKeyDown(e, false)}
                />
            </div>
        </div>
    )
}

export default MessageInput