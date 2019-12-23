import React, { Component } from 'react'
import firebase from 'firebase'
import { firebaseApp } from '../database'

class Login extends Component {
  state = {
    isLoading: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler({ user })
      }
    })
  }

  authenticate = () => {
    this.setState({ isLoading: true })
    const provider = new firebase.auth.GoogleAuthProvider()
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then(this.authHandler)
      .catch(err => {
        this.setState({ isLoading: false })
      })
  }

  authHandler = async res => {
    let user = res.user
    if (user) {
      this.props.history.push(`/main`)
    }
  }

  render() {
    return (
      <article>
        <button onClick={this.authenticate}>Sign In With Google</button>
      </article>
    )
  }
}

export default Login
