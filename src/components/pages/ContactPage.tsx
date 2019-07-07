import React from 'react'
import firebase from 'firebase'

export const ContactPage = () => {
  const testFirebase = () => {
    let now = firebase.firestore.Timestamp.fromDate(new Date())

    window.db
      .collection('contacts')
      .add({
        email: 'example@example.com',
        category: 'other',
        message: 'Hey!!',
        timestamp: now.toDate(),
      })
      .then(function(docRef: any) {
        console.log('Document written with ID: ', docRef.id)
      })
      .catch(function(error: any) {
        console.error('Error adding document: ', error)
      })
  }

  return (
    <>
      <div className="container">This is the Contact Page</div>
      <button className="button" onClick={testFirebase}>
        Firebase Test
      </button>
    </>
  )
}
