import React, { Component } from 'react'
import firebase from 'firebase'
import { App } from '../../app'
import './Board.scss'

class Board extends Component {
  constructor(props) {
    super(props)

    this.unsubscribe = null

    const currentUser = firebase.auth().currentUser
    this.currentUserId = currentUser.uid

    this.chatId = null

    this.messages = []
  }

  state = {
    isLoading: false
  }

  componentDidMount() {
    this.updateMessages()
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  updateMessages = () => {
    this.setState({ isLoading: true })

    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.props.currentPeerUser.id)
    ) {
      this.chatId = `${this.currentUserId}-${this.props.currentPeerUser.id}`
    } else {
      this.chatId = `${this.props.currentPeerUser.id}-${this.currentUserId}`
    }

    this.messageListener = firebase
      .firestore()
      .collection(App.MESSAGES)
      .doc(this.chatId)
      .collection(this.chatId)
      .onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.messages.push(change.doc.data())
            }
            this.setState({ isLoading: false })
          })
        },
        err => {
          console.error(`error in updateMessages function: ${err.toString()}`)
        }
      )
  }

  hashString = str => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash += (str.charCodeAt(i) * 31) ** (str.length - i)
      hash = hash & hash
    }
    return hash
  }

  render() {
    return (
      <article className="board">
        <header className="board__header">
          <img className="" src="" alt="" />
          <span className=""></span>
        </header>

        <section className="board__messages">
          <div className="message message_in">
            <p>Some text for me</p>
          </div>
          <div className="message message_out">
            <p>Some text from me</p>
          </div>
        </section>

        <form className="board__form form" action="">
          <textarea className="form__field" name=""></textarea>
          <button className="form__send-button">Send</button>
        </form>
      </article>
    )
  }
}

export default Board
