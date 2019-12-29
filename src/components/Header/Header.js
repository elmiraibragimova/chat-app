import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import './Header.scss'

class Header extends Component {
  logout = async () => {
    await firebase.auth().signOut()
    this.props.history.push(`/`)
  }

  render() {
    const { currentUserName, currentUserPhotoUrl } = this.props
    return (
      <header className={`${this.props.className} header`}>
        <Link className={'link-to-profile'} to="/profile">
          <div className="header__user">
            <img
              className="header__user-pic"
              src={currentUserPhotoUrl}
              alt="Avatar"
            />
            <span className="header__user-name">{currentUserName}</span>
          </div>
        </Link>
        <button className="logout-button" onClick={this.logout}>
          Log out
        </button>
      </header>
    )
  }
}

export default Header
