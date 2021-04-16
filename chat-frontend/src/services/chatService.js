import API from './api'

const ChatService = {

    fetchChats: () => {
        return API.get('/chats')
            .then(({ data }) => {
                return data
            })
            .catch(err => {
                console.log(err);
                throw err
            })
    },
    searchUsers: (term) => {
        return API.get('/users/search-users', {
            params: {
                term
            }
        })
            .then(({ data }) => {
                return data
            })
            .catch(err => {
                throw err
            })
    },
    createChat: (partnerId) => {
        return API.post('/chats/create', { partnerId })
            .then(({ data }) => {
                return data
            })
            .catch(err => {
                throw err
            })
    }
}

export default ChatService