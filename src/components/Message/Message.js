import React, { Component } from 'react'
import './Message.scss'

class Message extends Component {
  render() {
    const { type, timestamp, from, content } = this.props.message

    return (
      <>
        {type === 'text' && (
          <div
            key={timestamp}
            className={`message ${
              from === this.props.currentUserId ? 'message_out' : 'message_in'
            }`}
          >
            <p>{content}</p>
          </div>
        )}
      </>
    )
  }
}

export default Message
