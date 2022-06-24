import Decimal from 'decimal.js-light'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './index.scss'
import './theme.scss'

Decimal.set({ toExpPos: 999 })

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
