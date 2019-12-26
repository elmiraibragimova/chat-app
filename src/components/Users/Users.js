import React, { Component } from 'react'
import './Users.scss'

class Users extends Component {
  render() {
    return (
      <ul className="users">
        {this.props.users.map((it, index) => {
          return (
            <li
              className="user"
              key={index}
              onClick={() => this.props.selectPeerUser(it.data())}
            >
              <img
                className="user__pic"
                src={it.data().photoUrl}
                alt="avatar"
              />
              <div className="user__info">
                <span className="user__name">{it.data().name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default Users
