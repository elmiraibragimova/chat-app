import React, { Component } from 'react'
import moment from 'moment'
import { firebaseApp } from '../../database'
import './Form.scss'

class Form extends Component {
  state = {
    text: '',
    photoFile: null,
    isLoading: false
  }

  updateText = event => {
    this.setState({ text: event.target.value })
  }

  onSendText = event => {
    event.preventDefault()

    if (this.state.text.trim() === '') {
      return
    }

    this.props.sendMessage(this.state.text, 'text')
    this.setState({ text: '' })
  }

  onChoosePhoto = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        isLoading: true
      })
      const fileType = event.target.files[0].type.toString()
      if (fileType.includes('image/')) {
        this.uploadPhoto(event.target.files[0])
      } else {
        this.setState({ isLoading: false })
        console.error('This file is not an image')
      }
    } else {
      this.setState({ isLoading: false })
    }
  }

  uploadPhoto = photoFile => {
    const timestamp = moment()
      .valueOf()
      .toString()

    const storageRef = firebaseApp.storage().ref()
    const uploadTask = storageRef.child(timestamp).put(photoFile)

    uploadTask.on(
      'state_changed',
      null,
      err => {
        this.setState({ isLoading: false })
        console.error(`error in uploadPhoto: ${err}`)
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.setState({ isLoading: false })
          this.props.sendMessage(downloadURL, 'image')
        })
      }
    )
  }

  render() {
    return (
      <form className="board__form form" action="">
        <input
          accept="image/*"
          className="form__add-image"
          type="file"
          onChange={this.onChoosePhoto}
        />
        <button onClick={this.onSendSticker} className="form__send-button">
          Send sticker
        </button>
        <input
          value={this.state.text}
          onChange={this.updateText}
          className="form__field"
          name=""
        />
        <button onClick={this.onSendText} className="form__send-button">
          Send
        </button>
      </form>
    )
  }
}

export default Form
