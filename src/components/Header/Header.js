import React, { Component } from 'react'
import firebase from 'firebase'
import './Header.scss'

class Header extends Component {
  logout = async () => {
    // await firebase.auth().signOut()
    // this.props.history.push(`/`)
  }

  render() {
    return (
      <header className={`${this.props.className} header`}>
        {/* <div className="user">
          <img className="user__pic" src="" alt="" />
          <span className="user__name"></span>
        </div> */}
        <button className="logout-button" onClick={this.logout}>
          Log out
        </button>
      </header>
    )
  }
}

export default Header
