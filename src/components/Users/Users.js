import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReactComponent as Bookmark } from '../Board/images/bookmark.svg'
import './Users.scss'

const mapStateToProps = state => {
  return { users: state.users }
}

class Users extends Component {
  componentDidMount() {}

  render() {
    return (
      <ul className="users">
        {this.props.users.map((it, index) => {
          return (
            <li
              className={
                this.props.currentPeerUser &&
                this.props.currentPeerUser.id === it.id
                  ? 'user user_active'
                  : 'user'
              }
              key={index}
              onClick={() => this.props.selectPeerUser(it)}
            >
              {this.props.currentUserId === it.id ? (
                <div className="user__bookmark-container">
                  <Bookmark className="user__bookmark" />
                </div>
              ) : (
                <img
                  className="user__avatar"
                  src={it.photoUrl}
                  alt={`${it.name} avatar`}
                />
              )}

              <div className="user__info">
                <span className="user__name">
                  {this.props.currentUserId === it.id
                    ? 'Saved messages'
                    : it.name}
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
