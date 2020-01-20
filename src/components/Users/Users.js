import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as Bookmark } from '../Board/images/bookmark.svg'
import './Users.scss'

const mapStateToProps = state => {
  return { users: state.users }
}

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
              {this.props.currentUserId === it.data().id ? (
                <div className="user__bookmark-container">
                  <Bookmark className="user__bookmark" />
                </div>
              ) : (
                <img
                  className="user__avatar"
                  src={it.data().photoUrl}
                  alt={`${it.data().name} avatar`}
                />
              )}

              <div className="user__info">
                <span className="user__name">
                  {this.props.currentUserId === it.data().id
                    ? 'Saved messages'
                    : it.data().name}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

const ConnectedUsers = connect(mapStateToProps)(Users)

export default ConnectedUsers
