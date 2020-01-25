import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import firebase from 'firebase'
import 'react-toastify/dist/ReactToastify.css'
import ConnectedLogin from './Login/Login'
import Main from './Main/Main'
import ConnectedProfile from './Profile/Profile'
import { connect } from 'react-redux'
import { updateUsers } from '../actions/index'
import { updateCurrentUser } from '../actions/index'

const mapStateToProps = state => {
  return {
    users: state.users,
    currentUser: state.currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateCurrentUser: currentUser => dispatch(updateCurrentUser(currentUser)),
    updateUsers: () => dispatch(updateUsers())
  }
}

class Router extends Component {
  componentDidMount() {
    this.init()
  }

  async init() {
    await this.props.updateUsers()

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const currentUser = this.props.users.find(it => {
          return it.id === user.uid
        })

        this.props.updateCurrentUser(currentUser)
      }
    })
  }

  notify = (type, message) => {
    switch (type) {
      case 'warning':
        toast.warning(message)
        break
      case 'success':
        toast.success(message)
        break
      default:
        break
    }
  }

  render() {
    return (
      <BrowserRouter>
        <ToastContainer autoClose={2500} />
        <Switch>
          <Route
            exact
            path="/"
            render={props => <ConnectedLogin {...props} notify={this.notify} />}
          />
          <Route
            exact
            path="/main"
            render={props => <Main {...props} notify={this.notify} />}
          />
          <Route
            exact
            path="/profile"
            render={props => (
              <ConnectedProfile {...props} notify={this.notify} />
            )}
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

const ConnecedRouter = connect(mapStateToProps, mapDispatchToProps)(Router)

export default ConnecedRouter
