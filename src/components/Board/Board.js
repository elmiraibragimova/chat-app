import React, { Component } from 'react'
import { firebaseApp } from '../../database'
import moment from 'moment'
import { App } from '../../app'
import Form from '../Form/Form'
import Message from '../Message/Message'
import { hashString } from '../../helpers'
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
          console.error(`error in updateMessages function: ${err.toString()}`)
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
        console.error(`error in sendMessage: ${err.toString()}`)
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
        </section>

        <Form sendMessage={this.sendMessage} />
      </article>
    )
  }
}

export default Board
