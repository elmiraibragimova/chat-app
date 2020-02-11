import React from 'react'
import { useSelector } from 'react-redux'
import { ReactComponent as Bookmark } from '../Board/images/bookmark.svg'
import './Users.scss'

const Users = props => {
  const users = useSelector(state => state.users)

  return (
    <ul className="users">
      {users.map((it, index) => {
        return (
          <li
            className={
              props.currentPeerUser && props.currentPeerUser.id === it.id
                ? 'user user_active'
                : 'user'
            }
            key={index}
            onClick={() => props.selectPeerUser(it)}
          >
            {props.currentUserId === it.id ? (
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
                {props.currentUserId === it.id ? 'Saved messages' : it.name}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default Users
