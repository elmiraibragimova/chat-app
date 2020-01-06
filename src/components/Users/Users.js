import React, { Component } from 'react'
import './Users.scss'

class Users extends Component {
  render() {
    return (
      <ul className="users">
        {this.props.users.map((it, index) => {
          return (
            <li
              className={
                this.props.currentPeerUser &&
                this.props.currentPeerUser.id === it.data().id
                  ? 'user user_active'
                  : 'user'
              }
              key={index}
              onClick={() => this.props.selectPeerUser(it.data())}
            >
              <img
                className="user__avatar"
                src={it.data().photoUrl}
                alt={`${it.data().name} avatar`}
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
