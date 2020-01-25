import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'
import { firebaseApp } from '../../database'
import './Profile.scss'
import { connect } from 'react-redux'
import { updateCurrentUser } from '../../actions/index'

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentUser: currentUser => dispatch(updateCurrentUser(currentUser))
  }
}

class Profile extends Component {
  photoInputRef = React.createRef()
  nameInputRef = React.createRef()

  constructor(props) {
    super(props)
    this.newPhoto = null
  }

  state = {
    isLoading: false,
    isDisabled: false,
    currentPhoto: ''
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.currentPhoto) {
      return {
        currentPhoto: props.currentUser.photoUrl
      }
    }

    return null
  }

  onChangePhoto = event => {
    if (event.target.files && event.target.files[0]) {
      const fileType = event.target.files[0].type.toString()
      const file = event.target.files[0]
      if (fileType.includes('image/')) {
        this.setState({ currentPhoto: URL.createObjectURL(file) }, () => {
          this.newPhoto = file
        })
      } else {
        this.props.notify('warning', 'This file is not an image')

        return
      }
    } else {
      this.props.notify('warning', 'Something wrong with input file')
    }
  }

  saveUserInfo = () => {
    this.setState({
      isLoading: true,
      isDisabled: true
    })

    if (this.newPhoto) {
      const storageRef = firebaseApp.storage().ref()
      const uploadTask = storageRef
        .child(this.props.currentUser.id)
        .put(this.newPhoto)
      uploadTask.on(
        'state_changed',
        null,
        err => {
          this.props.notify('warning', `Error: ${err}`)
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
        name: this.nameInputRef.current.value,
        photoUrl: downloadURL
      }
    } else {
      newUserInfo = {
        name: this.nameInputRef.current.value
      }
    }

    firebaseApp
      .firestore()
      .collection('users')
      .doc(this.props.currentUser.id)
      .update(newUserInfo)
      .then(data => {
        this.setState({
          isLoading: false,
          isDisabled: false
        })

        this.props.updateCurrentUser({
          ...this.props.currentUser,
          name: this.nameInputRef.current.value,
          photoUrl: this.state.currentPhoto
        })

        this.props.notify('success', 'Profile info has been updated')
      })
  }

  render() {
    const { name } = this.props.currentUser || {}

    return (
      <article className="profile">
        <div className="profile__back">
          <Link className={'profile__back-link'} to="/main">
            Back
          </Link>
        </div>
        <div className="profile__group">
          <div className="profile__avatar-group">
            <img
              className="profile__avatar"
              src={this.state.currentPhoto}
              alt={`${name} avatar. Click to change it`}
              onClick={() => this.photoInputRef.current.click()}
            />
            <input
              className="profile__file-input"
              type="file"
              accept="image/*"
              ref={this.photoInputRef}
              onChange={this.onChangePhoto}
            />
          </div>

          <div>
            <label className="profile__label" htmlFor="">
              Name
            </label>
            <input
              className="profile__field"
              type="text"
              defaultValue={name}
              ref={this.nameInputRef}
            />
          </div>

          <button
            className="profile__update-button"
            disabled={this.state.isDisabled}
            onClick={this.saveUserInfo}
          >
            Save
          </button>
          <div className="profile__loader">
            {!!this.state.isLoading && (
              <ReactLoading
                type="spokes"
                color="#ccc"
                height="30px"
                width="30px"
              />
            )}
          </div>
        </div>
      </article>
    )
  }
}

const ConnectedProfile = connect(mapStateToProps, mapDispatchToProps)(Profile)

export default ConnectedProfile
