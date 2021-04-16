import React, { Fragment, useState } from 'react'
import './ChatHeader.scss'

const ChatHeader = ({ chat }) => {

    return (
        <Fragment>
            <div id='chatter'>
                {
                    chat.Users.map(user => {
                        return <div className='chatter-info' key={user.id}>
                            <h3>{user.username}</h3>
                        </div>
                    })
                }
            </div>
        </Fragment>
    )
}

export default ChatHeader