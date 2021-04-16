import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useSocket from './hooks/socketConnect'
import { fetchChats } from '../../store/actions/chat'
import Navbar from './components/Navbar/Navbar'
import FriendList from './components/FriendList/FriendList'
import Messenger from './components/Messenger/Messenger'
import './Chat.scss'

const Chat = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.authReducer.user)

    useSocket(user, dispatch);

    useEffect(() => {
        dispatch(fetchChats(user))
    }, [dispatch])
    return (
        <div id='chat-container'>
            <Navbar />
            <div id='chat-wrap'>
                <FriendList />
                <Messenger />
            </div>
        </div>
    );
}

export default Chat