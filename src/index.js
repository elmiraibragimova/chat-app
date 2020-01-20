import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import ConnectedRouter from './components/Router'
import './styles/index.scss'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter />
  </Provider>,
  document.getElementById('root')
)
