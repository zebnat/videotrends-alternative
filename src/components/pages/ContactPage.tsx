import React from 'react'
import { ContactForm } from '../ContactForm'
import Helmet from 'react-helmet'

export const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact us - Ytrends</title>
        <meta
          name="description"
          content="You can contact us and ask for anything related to the service itself, bugs or anything else."
        />
      </Helmet>
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
