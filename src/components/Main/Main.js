import React, { Component } from 'react'
import Header from '../Header/Header'
import Intro from '../Intro/Intro'
import Users from '../Users/Users'
import Board from '../Board/Board'
import './Main.scss'

class Main extends Component {
  render() {
    return (
      <section className="layout">
        <Header className="layout__header" />

        <aside className="layout__sidebar">
          <Users />
        </aside>

        <main className="layout__main">
          <section>
            <Intro />
          </section>

          {/* <section>
            <Board />
          </section> */}
        </main>
      </section>
    )
  }
}

export default Main
