import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LogoutDialog from '../LogoutDialog/LogoutDialog'
import './Header.scss'

class Header extends Component {
  state = {
    isLogoutDialogOpen: false
  }

  openLogoutDialog = async () => {
    this.setState({ isLogoutDialogOpen: true })
  }

  cancelLogoutDialog = () => {
    this.setState({ isLogoutDialogOpen: false })
  }

  render() {
    const { currentUserName, currentUserPhotoUrl } = this.props
    return (
      <>
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
          <button className="logout-button" onClick={this.openLogoutDialog}>
            Log out
          </button>
        </header>

        {!!this.state.isLogoutDialogOpen && (
          <LogoutDialog
            cancelLogoutDialog={this.cancelLogoutDialog}
            history={this.props.history}
            notify={this.props.notify}
          />
        )}
      </>
    )
  }
}

export default Header
