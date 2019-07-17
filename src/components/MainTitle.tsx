import React from 'react'
import { Link } from 'react-router-dom'

export const MainTitle = () => {
  return (
    <section className="section is-small has-text-centered">
      <h1 className="title is-size-2">
        Welcome to <span className="pink">Y</span>
        <span className="green">trends</span>
      </h1>
      <div className="subtitle is-size-4">
        An alternative list of trending videos{' '}
        <Link to={'/about'}>Learn more</Link>
        <p className="is-size-6">
          Alpha version {process.env.REACT_APP_VERSION}
        </p>
      </div>
    </section>
  )
}
