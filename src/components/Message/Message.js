import React, { Component } from 'react'
import moment from 'moment'
import './Message.scss'

class Message extends Component {
  render() {
    const { type, timestamp, from, content } = this.props.message
    const dateTime = moment(parseInt(timestamp, 10)).format('MM-DD-YYYY hh:mm')
    const time = moment(parseInt(timestamp, 10)).format('hh:mm')

    return (
      <div
        key={timestamp}
        className={`message ${
          from === this.props.currentUserId ? 'message_out' : 'message_in'
        }`}
      >
        <div className="message__content">
          <time className="message__time" dateTime={dateTime}>
            {time}
          </time>
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
