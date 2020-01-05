import React, { Component } from 'react'
import moment from 'moment'
import { firebaseApp } from '../../database'
import { ReactComponent as Send } from './images/send.svg'
import { ReactComponent as Paperclip } from './images/paperclip.svg'
import './Form.scss'

class Form extends Component {
  attachmentRef = React.createRef()

  state = {
    text: ''
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
      this.props.updateLoadingState(true)

      const fileType = event.target.files[0].type.toString()
      if (fileType.includes('image/')) {
        this.uploadPhoto(event.target.files[0])
      } else {
        this.props.updateLoadingState(false)
        this.props.notify('warning', 'This file is not an image')
      }
    } else {
      this.props.updateLoadingState(false)
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
        this.props.updateLoadingState(false)
        this.props.notify('warning', `Error: ${err.toString()}`)
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          this.props.updateLoadingState(false)
          this.props.sendMessage(downloadURL, 'image')
        })
      }
    )
  }

  render() {
    return (
      <form className="board__form form" action="">
        <Paperclip
          className="form__add-image-icon"
          onClick={() => this.attachmentRef.current.click()}
        />
        <input
          className="form__add-image"
          accept="image/*"
          type="file"
          ref={this.attachmentRef}
          onChange={this.onChoosePhoto}
        />
        <input
          className="form__field"
          placeholder="Write a message..."
          value={this.state.text}
          onChange={this.updateText}
        />
        <button className="form__send-button" onClick={this.onSendText}>
          <Send className="form__send-icon" />
        </button>
      </form>
    )
  }
}

export default Form
