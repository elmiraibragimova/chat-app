import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { firebaseApp } from '../../database'
import './Profile.scss'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.newPhoto = null
  }

  state = {
    isLoading: false,
    name: '',
    photoUrl: '',
    id: ''
  }

  async componentDidMount() {
    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          name: user.displayName,
          photoUrl: user.photoURL,
          id: user.uid
        })
      }
    })
  }

  onChangePhoto = event => {
    if (event.target.files && event.target.files[0]) {
      const fileType = event.target.files[0].type.toString()
      const file = event.target.files[0]
      if (fileType.includes('image/')) {
        this.setState({ photoUrl: URL.createObjectURL(file) }, () => {
          this.newPhoto = file
        })
      } else {
        console.error('This file is not an image')
        return
      }
    } else {
      console.error('error in updateUserInfo function')
    }
  }

  saveUserInfo = () => {
    this.setState({ isLoading: true })

    if (this.newPhoto) {
      const storageRef = firebaseApp.storage().ref()
      const uploadTask = storageRef.child(this.state.id).put(this.newPhoto)
      uploadTask.on(
        'state_changed',
        null,
        err => {
          console.log(err)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.updateUserInfo(true, downloadURL)
          })
        }
      )
    } else {
      this.updateUserInfo(false, null)
    }
  }

  updateUserInfo = (isNewPhoto, downloadURL) => {
    let newUserInfo

    if (isNewPhoto) {
      newUserInfo = {
        name: this.state.name,
        photoUrl: downloadURL
      }
    } else {
      newUserInfo = {
        name: this.state.name
      }
    }

    firebaseApp
      .firestore()
      .collection('users')
      .doc(this.state.id)
      .update(newUserInfo)
      .then(data => {
        this.setState({ isLoading: false })
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
          <div className="profile__pic-group">
            <img className="profile__pic" src={this.state.photoUrl} alt="" />
            <input type="file" accept="image/*" onChange={this.onChangePhoto} />
          </div>

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
          <button
            onClick={this.saveUserInfo}
            className="profile__update-button"
          >
            Save
          </button>
        </div>
      </article>
    )
  }
}

export default Profile
