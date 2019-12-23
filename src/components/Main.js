import React, { Component } from 'react'
import firebase from 'firebase'

class Main extends Component {
  logout = async () => {
    await firebase.auth().signOut()
    this.props.history.push(`/`)
  }

  render() {
    return (
      <article>
        <header>
          <button onClick={this.logout}>Log out</button>
        </header>
        <main>Main</main>
      </article>
    )
  }
}

export default Main
