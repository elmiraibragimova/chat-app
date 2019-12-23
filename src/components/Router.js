import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './Login'
import Main from './Main'
import Profile from './Profile'

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/main" component={Main} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router
