import ChatService from '../../services/chatService'
export const FETCH_CHATS = 'FETCH_CHATS'
export const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT'
export const SET_SOCKET = 'SET_SOCKET'
export const RECEIVED_MESSAGE = 'RECEIVED_MESSAGE'
export const INCREMENT_SCROLL = 'INCREMENT_SCROLL'
export const CREATE_CHAT = 'CREATE_CHAT'

export const fetchChats = (currentUser) => dispatch => {
    return ChatService.fetchChats()
        .then(data => {
            data.forEach(chat => {
                chat.Users = chat.Users.filter(user => user.id != currentUser.id )
                chat.Users.forEach(user => {
                    user.status = 'offline'
                })
            })

            dispatch({ type: FETCH_CHATS, payload: data })
            return data
        })
        .catch(err => {
            throw err
        })
}

export const setCurrentChat = (chat) => dispatch => {
    dispatch({ type: SET_CURRENT_CHAT, payload: chat })
}

export const setSocket = (socket) => dispatch => {
    dispatch({ type: SET_SOCKET, payload: socket })
}

export const receivedMessage = (message, userId) => dispatch => {
    dispatch({ type: RECEIVED_MESSAGE, payload: { message, userId } })
}
export const incrementScroll = () => dispatch => {
    dispatch({ type: INCREMENT_SCROLL })
}
export const createChat = (chat) => dispatch => {
    dispatch({ type: CREATE_CHAT, payload: chat })
}