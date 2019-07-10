import React from 'react'
import { ContactForm } from '../ContactForm'

export const ContactPage = () => {
  return (
    <>
      <section className="section has-text-centered">
        <h1 className="title">Contact Us</h1>
        <h2 className="subtitle">Ask us anything</h2>
      </section>

      <section className="section is-small">
        <ContactForm firebase={undefined} />
      </section>
    </>
  )
}
