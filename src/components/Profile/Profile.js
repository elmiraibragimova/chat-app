import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { firebaseApp } from '../../database'
import './Profile.scss'

class Profile extends Component {
  state = {
    name: '',
    photoUrl: ''
  }

  async componentDidMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          name: user.displayName,
          photoUrl: user.photoURL
        })
      }
    })
  }

  render() {
    return (
      <article className="profile">
        <div className="profile__back">
          <Link className={'profile__back-link'} to="/main">
            Back
          </Link>
        </div>
        <div className="profile__group">
          <img className="profile__pic" src={this.state.photoUrl} alt="" />
          <div>
            <label className="profile__label" htmlFor="">
              Name
            </label>
            <input
              className="profile__field"
              type="text"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </div>
          <button className="profile__update-button">Save</button>
        </div>
      </article>
    )
  }
}

export default Profile
