import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import firebase from 'firebase'
import { firebaseApp } from '../../database'
import Header from '../Header/Header'
import Intro from '../Intro/Intro'
import Users from '../Users/Users'
import Board from '../Board/Board'
import { App } from '../../app'
import './Main.scss'

class Main extends Component {
  state = {
    isLoading: true,
    currentPeerUser: null,
    users: [],
    currentUserName: '',
    currentUserPhotoUrl: ''
  }

  async componentDidMount() {
    this.updateUsersList()

    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          currentUserName: user.displayName,
          currentUserPhotoUrl: user.photoURL
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  updateUsersList = async () => {
    const res = await firebaseApp
      .firestore()
      .collection(App.USERS)
      .get()

    if (res.docs.length > 0) {
      const users = [...res.docs]
      this.setState({ users })
    }

    this.setState({ isLoading: false })
  }

  selectPeerUser = currentPeerUser => {
    this.setState({ currentPeerUser })
  }

  render() {
    return (
      <section className="layout">
        <Header
          className="layout__header"
          currentUserName={this.state.currentUserName}
          currentUserPhotoUrl={this.state.currentUserPhotoUrl}
          history={this.props.history}
        />

        <aside className="layout__sidebar">
          <Users
            users={this.state.users}
            selectPeerUser={this.selectPeerUser}
            currentPeerUser={this.state.currentPeerUser}
          />
        </aside>

        <main className="layout__main">
          {this.state.currentPeerUser ? (
            <Board currentPeerUser={this.state.currentPeerUser} />
          ) : (
            <Intro />
          )}
        </main>

        {!!this.state.isLoading && (
          <div className="layout__loader">
            <ReactLoading
              type="spokes"
              color="#ccc"
              height="30px"
              width="30px"
            />
          </div>
        )}
      </section>
    )
  }
}

export default Main
