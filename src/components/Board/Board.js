import React, { Component } from 'react'
import './Board.scss'

class Board extends Component {
  render() {
    return (
      <article className="board">
        <header className="board__header">
          <img className="" src="" alt="" />
          <span className=""></span>
        </header>

        <section className="board__messages">
          <div className="message message_in">
            <p>Some text for me</p>
          </div>
          <div className="message message_out">
            <p>Some text from me</p>
          </div>
        </section>

        <form className="board__form form" action="">
          <textarea className="form__field" name=""></textarea>
          <button className="form__send-button">Send</button>
        </form>
      </article>
    )
  }
}

export default Board
