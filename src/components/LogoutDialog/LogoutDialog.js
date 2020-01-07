import React, { Component } from 'react'
import firebase from 'firebase'
import './LogoutDialog.scss'

class LogoutDialog extends Component {
  logout = async () => {
    await firebase.auth().signOut()
    this.props.history.push(`/`)
    this.props.notify('success', 'Logout success')
  }

  render() {
    return (
      <div className="dialog">
        <div className="dialog__container">
          <div className="dialog__title">Are you sure to logout?</div>
          <div className="dialog__controls">
            <button className="dialog__btn-yes" onClick={this.logout}>
              Yes
            </button>
            <button
              className="dialog__btn-cancel"
              onClick={this.props.cancelLogoutDialog}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default LogoutDialog
