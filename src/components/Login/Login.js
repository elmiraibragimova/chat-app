import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import firebase from 'firebase'
import { firebaseApp } from '../../database'
import { App } from '../../constants/app'
import { connect } from 'react-redux'
import { updateCurrentUser } from '../../actions/index'
import './Login.scss'

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: currentUser => dispatch(updateCurrentUser(currentUser))
  }
}

class Login extends Component {
  state = {
    isLoading: false
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler({ user })
      }
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  authenticate = () => {
    this.setState({ isLoading: true })
    const provider = new firebase.auth.GoogleAuthProvider()
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .catch(err => {
        this.setState({ isLoading: false })
        this.props.notify('warning', err.message)
      })
  }

  authHandler = async res => {
    const currentUser = res.user
    if (currentUser) {
      const querySnapshot = await firebaseApp
        .firestore()
        .collection(App.USERS)
        .where(App.ID, '==', currentUser.uid)
        .get()

      querySnapshot.forEach(doc => {
        const user = doc.data()
        this.props.updateCurrentUser(user)
      })

      if (!querySnapshot.empty) {
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
              this.props.notify('success', 'Login success')
            })
          })
      } else {
        this.setState({ isLoading: false }, () => {
          this.props.history.push(`/main`)
          this.props.notify('success', 'Login success')
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

        {!!this.state.isLoading && (
          <div className="login-page__loader">
            <ReactLoading
              type="spokes"
              color="#ccc"
              height="30px"
              width="30px"
            />
          </div>
        )}
      </article>
    )
  }
}

const connectedLogin = connect(null, mapDispatchToProps)(Login)
export default connectedLogin
