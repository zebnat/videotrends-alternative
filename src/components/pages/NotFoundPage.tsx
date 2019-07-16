import React from 'react'
import Helmet from 'react-helmet'

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found</title>
        <meta name="description" content="404 Page not found" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="section is-medium is-size-2 has-text-centered">
        Error 404 Page Not Found
      </section>
    </>
  )
}
