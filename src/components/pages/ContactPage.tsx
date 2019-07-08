import React from 'react'
import { GlobalConsumer } from '../../GlobalContext'
import { ContactForm } from '../ContactForm'

export const ContactPage = () => {
  return (
    <>
      <section className="section has-text-centered">
        <h1 className="title">Contact Us</h1>
        <h2 className="subtitle">Ask us anything</h2>
      </section>
      <GlobalConsumer>
        {contextProps => {
          if (contextProps.fstore === undefined) {
            return (
              <section className="section is-large has-text-centered">
                <p className="is-size-1">
                  Unable to use the contact form at this moment
                </p>
              </section>
            )
          } else {
            return (
              <section className="section is-small">
                <ContactForm firebase={contextProps.fstore} />
              </section>
            )
          }
        }}
      </GlobalConsumer>
    </>
  )
}
