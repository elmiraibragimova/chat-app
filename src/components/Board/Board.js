import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import moment from 'moment'
import { firebaseApp } from '../../database'
import { App } from '../../app'
import { hashString } from '../../helpers'
import Form from '../Form/Form'
import Message from '../Message/Message'
import './Board.scss'

class Board extends Component {
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

  render() {
    return (
      <article className="board">
        <header className="board__header">
          <img
            className="board__user-pic"
            src={this.props.currentPeerUser.photoUrl}
            alt=""
          />
          <span className="">{this.props.currentPeerUser.name}</span>
        </header>

        <section className="board__messages">
          {this.state.messages.map(it => {
            return (
              <Message
                currentUserId={this.currentUserId}
                key={it.timestamp}
                message={it}
              />
            )
          })}

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
