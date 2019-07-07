import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

const jsonFirebaseCFG: string | undefined = process.env.REACT_APP_FIREBASECFG

if (jsonFirebaseCFG !== undefined) {
  const serviceAccount = JSON.parse(jsonFirebaseCFG)
  console.log(serviceAccount)
  firebase.initializeApp(serviceAccount)
  window.db = firebase.firestore() // sets Firebase db in window.db
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
