import {
    FETCH_CHATS, 
    SET_CURRENT_CHAT,
    SET_SOCKET,
    RECEIVED_MESSAGE,
    INCREMENT_SCROLL,
    CREATE_CHAT
} from '../actions/chat'

const initialState = {
    chats: [],
    currentChat: {},
    socket: {},
    newMessage: { chatId: null, seen: null },
    scrollBottom: 0
}

const chatReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case FETCH_CHATS:
            return {
                ...state,
                chats: payload
            }

        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: payload,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatId: null, seen: null }
            }
        
        case SET_SOCKET: {
            return {
                ...state,
                socket: payload
            }
        }

        case RECEIVED_MESSAGE: {
            const { userId, message } = payload
            let currentChatCopy = { ...state.currentChat }
            let newMessage = { ...state.newMessage }
            let scrollBottom = state.scrollBottom

            const chatsCopy = state.chats.map(chat => {
                if (message.chatId === chat.id) {

                    if (message.User.id === userId) {
                        scrollBottom++
                    } else {
                        newMessage = {
                            chatId: chat.id,
                            seen: false
                        }
                    }

                    if (message.chatId === currentChatCopy.id) {
                        currentChatCopy = {
                            ...currentChatCopy,
                            Messages: [...currentChatCopy.Messages, ...[message]]
                        }
                    }

                    return {
                        ...chat,
                        Messages: [...chat.Messages, ...[message]]
                    }
                }

                return chat
            })

            if (scrollBottom === state.scrollBottom) {
                return {
                    ...state,
                    chats: chatsCopy,
                    currentChat: currentChatCopy,
                    newMessage,
                    senderTyping: { typing: false }
                }
            }

            return {
                ...state,
                chats: chatsCopy,
                currentChat: currentChatCopy,
                newMessage,
                scrollBottom,
                senderTyping: { typing: false }
            }
        }

        case INCREMENT_SCROLL:
            return {
                ...state,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatId: null, seen: true }
            }
        
        case CREATE_CHAT:
            return {
                ...state,
                chats: [...state.chats, ...[payload]]
            }

        default: {
            return state
        }
    }
}

export default chatReducer