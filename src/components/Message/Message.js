import React, { Component } from 'react'
import './Message.scss'

class Message extends Component {
  render() {
    const { type, timestamp, from, content } = this.props.message

    return (
      <div
        key={timestamp}
        className={`message ${
          from === this.props.currentUserId ? 'message_out' : 'message_in'
        }`}
      >
        <div className="message__content">
          {type === 'text' && <p>{content}</p>}

          {type === 'image' && (
            <img className="message__image" src={content} alt="" />
          )}
        </div>
      </div>
    )
  }
}

export default Message
