import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import { Provider } from 'react-redux'
import store from './store'
import Router from './routes'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
