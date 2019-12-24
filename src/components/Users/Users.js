import React, { Component } from 'react'
import './Users.scss'

class Users extends Component {
  render() {
    return (
      <ul className="users">
        <li className="user">
          <img className="user__pic" src="" alt="" />
          <div className="user__info">
            <span className="user__name">Name Lastname</span>
          </div>
        </li>
      </ul>
    )
  }
}

export default Users
