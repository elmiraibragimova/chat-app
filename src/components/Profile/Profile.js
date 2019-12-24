import React, { Component } from 'react'
import './Profile.scss'

class Profile extends Component {
  render() {
    return (
      <article className="profile">
        <div className="profile__group">
          <img className="profile__pic" src="" alt="" />
          <div>
            <label className="profile__label" htmlFor="">
              Name
            </label>
            <input className="profile__field" type="text" />
          </div>
          <button className="profile__update-button">Save</button>
        </div>
      </article>
    )
  }
}

export default Profile
