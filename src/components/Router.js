import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './Login/Login'
import Main from './Main/Main'
import Profile from './Profile/Profile'

class Router extends Component {
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
            render={props => <Login {...props} notify={this.notify} />}
          />
          <Route
            exact
            path="/main"
            render={props => <Main {...props} notify={this.notify} />}
          />
          <Route
            exact
            path="/profile"
            render={props => <Profile {...props} notify={this.notify} />}
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router
