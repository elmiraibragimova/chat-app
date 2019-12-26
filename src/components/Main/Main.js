import React, { Component } from 'react'
import firebase from 'firebase'
import Header from '../Header/Header'
import Intro from '../Intro/Intro'
import Users from '../Users/Users'
import Board from '../Board/Board'
import { App } from '../../app'
import './Main.scss'

class Main extends Component {
  state = {
    isLoading: false,
    currentPeerUser: null,
    users: []
  }

  componentDidMount() {
    this.updateUsersList()
  }

  updateUsersList = async () => {
    const res = await firebase
      .firestore()
      .collection(App.USERS)
      .get()

    if (res.docs.length > 0) {
      const users = [...res.docs]
      this.setState({ users })
    }
  }

  selectPeerUser = currentPeerUser => {
    this.setState({ currentPeerUser: currentPeerUser.data() })
  }

  render() {
    return (
      <section className="layout">
        <Header className="layout__header" history={this.props.history} />

        <aside className="layout__sidebar">
          <Users
            users={this.state.users}
            selectPeerUser={this.selectPeerUser}
          />
        </aside>

        <main className="layout__main">
          {/* <section>
            <Intro />
          </section> */}

          <section>
            <Board />
          </section>
        </main>
      </section>
    )
  }
}

export default Main
