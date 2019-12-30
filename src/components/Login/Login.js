import React, { Component } from 'react'
import firebase from 'firebase'
import { firebaseApp } from '../../database'
import { App } from '../../app'
import './Login.scss'

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
    const currentUser = res.user
    if (currentUser) {
      const user = await firebaseApp
        .firestore()
        .collection(App.USERS)
        .where(App.ID, '==', currentUser.uid)
        .get()

      if (user.docs.length === 0) {
        firebaseApp
          .firestore()
          .collection('users')
          .doc(currentUser.uid)
          .set({
            id: currentUser.uid,
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL
          })
          .then(data => {
            this.setState({ isLoading: false }, () => {
              this.props.history.push(`/main`)
            })
          })
      } else {
        this.setState({ isLoading: false }, () => {
          this.props.history.push(`/main`)
        })
      }
    }
  }

  render() {
    return (
      <article className="login-page">
        <button className="sign-in-button" onClick={this.authenticate}>
          Sign In With Google
        </button>
      </article>
    )
  }
}

export default Login
