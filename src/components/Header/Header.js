import React, { Component, useState } from 'react'
import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import LogoutDialog from '../LogoutDialog/LogoutDialog'
import './Header.scss'

const Header = ({ className, history, notify }) => {
  const [isLogoutDialogOpen, toggleLogoutDialog] = useState(false)

  const currentUser = useSelector(state => state.currentUser)
  const { name, photoUrl } = currentUser || {}

  return (
    <>
      <header className={`${className} header`}>
        <Link className={'link-to-profile'} to="/profile">
          <div className="header__user">
            <img className="header__avatar" src={photoUrl} alt="Avatar" />
            <span className="header__user-name">{name}</span>
          </div>
        </Link>
        <button
          className="logout-button"
          onClick={() => toggleLogoutDialog(true)}
        >
          Log out
        </button>
      </header>

      {!!isLogoutDialogOpen && (
        <LogoutDialog
          cancelLogoutDialog={() => toggleLogoutDialog(false)}
          history={history}
          notify={notify}
        />
      )}
    </>
  )
}

export default Header
