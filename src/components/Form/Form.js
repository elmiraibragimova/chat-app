import React, { Component } from 'react'
import './Form.scss'

class Form extends Component {
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

  render() {
    return (
      <form className="board__form form" action="">
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
