import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import moment from 'moment'
import { firebaseApp } from '../../database'
import { App } from '../../constants/app'
import { hashString } from '../../helpers'
import Form from '../Form/Form'
import Message from '../Message/Message'
import { ReactComponent as Bookmark } from './images/bookmark.svg'
import './Board.scss'

class Board extends Component {
  messageEnd = React.createRef()

  constructor(props) {
    super(props)
    this.unsubscribe = null
    const currentUser = firebaseApp.auth().currentUser
    this.currentUserId = currentUser.uid
    this.chatId = null
  }

  state = {
    isLoading: false,
    messages: []
  }

  componentDidMount() {
    this.updateMessages()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPeerUser.id !== this.props.currentPeerUser.id) {
      this.updateMessages()
    }

    this.scrollToBottom()
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  updateLoadingState = isLoading => {
    this.setState({ isLoading })
  }

  updateMessages = () => {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    this.setState({ isLoading: true, messages: [] })

    if (
      hashString(this.currentUserId) <=
      hashString(this.props.currentPeerUser.id)
    ) {
      this.chatId = `${this.currentUserId}-${this.props.currentPeerUser.id}`
    } else {
      this.chatId = `${this.props.currentPeerUser.id}-${this.currentUserId}`
    }

    this.unsubscribe = firebaseApp
      .firestore()
      .collection(App.MESSAGES)
      .doc(this.chatId)
      .collection(this.chatId)
      .onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const messages = [...this.state.messages]
              messages.push(change.doc.data())
              this.setState({ messages })
            }
            this.setState({ isLoading: false })
          })
        },
        err => {
          this.props.notify('warning', `Error: ${err.toString()}`)
        }
      )
  }

  sendMessage = (content, type) => {
    const timestamp = moment()
      .valueOf()
      .toString()

    const message = {
      content,
      type,
      timestamp,
      from: this.currentUserId,
      to: this.props.currentPeerUser.id
    }

    firebaseApp
      .firestore()
      .collection(App.MESSAGES)
      .doc(this.chatId)
      .collection(this.chatId)
      .doc(timestamp)
      .set(message)
      .then(() => {})
      .catch(err => {
        this.props.notify('warning', `Error: ${err.toString()}`)
      })
  }

  scrollToBottom = () => {
    if (this.messageEnd) {
      this.messageEnd.current.scrollIntoView()
    }
  }

  devideMessagesByDays = () => {
    const allDays = this.state.messages.reduce((days, it, index, messages) => {
      let isNewDay
      let day = []

      if (index === 0) {
        day.push(it)
        return [day]
      }

      if (index > 0) {
        isNewDay = moment(parseInt(it.timestamp, 10)).isAfter(
          parseInt(messages[index - 1].timestamp, 10),
          'day'
        )

        if (isNewDay) {
          day.push(it)
          return [...days, day]
        } else {
          days[days.length - 1].push(it)
          return [...days]
        }
      }
    }, [])

    return allDays
  }

  renderMessages = () => {
    let messages = this.devideMessagesByDays()

    messages = messages.map((it, index) => {
      const now = moment()
      const messageTime = parseInt(it[0].timestamp)
      const isNotCurrentYear = moment(messageTime).isBefore(now, 'year')
      let day

      if (isNotCurrentYear) {
        day = moment(messageTime).format('DD MMMM YYYY')
      } else {
        day = moment(messageTime).format('DD MMMM')
      }

      return (
        <div className="board__day" key={`${index}-${it[0].timestamp}`}>
          <div className="board__date">{day}</div>
          {it.map(message => {
            return (
              <Message
                currentPeerUser={this.props.currentPeerUser}
                currentUserId={this.currentUserId}
                message={message}
                key={message.timestamp}
              />
            )
          })}
        </div>
      )
    })

    return messages
  }

  render() {
    return (
      <article className="board">
        <header className="board__header">
          {this.props.currentPeerUser.id === this.currentUserId ? (
            <div className="board__bookmark-container">
              <Bookmark className="board__bookmark" />
            </div>
          ) : (
            <img
              className="board__user-avatar"
              src={this.props.currentPeerUser.photoUrl}
              alt={`${this.props.currentPeerUser.photoUrl} avatar`}
            />
          )}

          <span className="">
            {this.props.currentPeerUser.id === this.currentUserId
              ? 'Saved messages'
              : this.props.currentPeerUser.name}
          </span>
        </header>

        <section className="board__messages">
          {this.renderMessages()}

          <div className="board__message-end" ref={this.messageEnd}></div>

          {this.state.messages.length === 0 && !this.state.isLoading && (
            <div className="board__empty">
              <div className="board__empty-text">No messages here yet</div>
            </div>
          )}

          {!!this.state.isLoading && (
            <div className="board__loader">
              <ReactLoading
                type="spokes"
                color="#ccc"
                height="30px"
                width="30px"
              />
            </div>
          )}
        </section>

        <Form
          sendMessage={this.sendMessage}
          updateLoadingState={this.updateLoadingState}
        />
      </article>
    )
  }
}

export default Board
