import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { GlobalProvider } from './GlobalContext'

const jsonFirebaseCFG: string | undefined = process.env.REACT_APP_FIREBASECFG

var fstore: firebase.firestore.Firestore | undefined

if (jsonFirebaseCFG !== undefined) {
  const serviceAccount = JSON.parse(jsonFirebaseCFG)
  firebase.initializeApp(serviceAccount)
  fstore = firebase.firestore() // sets Firebase db in window.db
}

ReactDOM.render(
  <GlobalProvider value={{ fstore: fstore }}>
    <App />
  </GlobalProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
