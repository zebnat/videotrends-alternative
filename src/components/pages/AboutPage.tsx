import React from 'react'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

export const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Ytrends</title>
        <meta
          name="description"
          content="What is Ytrends? It's an alternative to official algorithms for video trends. You can learn more by entering this site."
        />
      </Helmet>
      <div className="column is-8 is-offset-2">
        <section className="section has-text-centered is-small">
          <h1 className="title is-size-2">About Ytrends</h1>
          <h2 className="subtitle is-size-4">Motivation, Features, etc</h2>
        </section>
        <section className="section is-small">
          <div className="content">
            <h3>What is Ytrends?</h3>
            <p>
              It's a web application where you can view a list of trending
              videos. You can also view a list of trending videos from different
              countries.
            </p>
            <h3>Motivation</h3>
            <p>
              Ytrends was created in order to have an alternative to the
              official source of trending videos. As a consumer of trends from
              Youtube I was not pleased with the algorithm. Ytrends makes use of
              the official Youtube API and applies a custom algorithm in order
              to have a list of best videos. We don't discriminate any kind of
              videos, nor do we censor any, instead, we let the user choose. We
              don't use any artificial inteligence for the algorithm, we let the
              statistics and a few simple mathematical formulas decide the
              results.
            </p>
            <h3>Features</h3>
            <ul>
              <li>
                You will see an alternative list of country specific trending
                videos.
              </li>
              <li>You can switch the country at any time.</li>
              <li>
                You can configure your own list by discarding the categories you
                don't like.
              </li>
              <li>
                You can activate a filter to view only the best videos from
                smaller channels. Sometimes smaller channels shine!
              </li>
            </ul>
            <h3>Disclaimer</h3>
            <p>
              This list does not claim to be better than the official. It is not
              guaranteed that the algorithm shows the best videos from your
              perspective, defining the best is something complex so take it
              just as another alternative for video trends. Try it and use it if
              you like!
            </p>
            <p>
              This project has been created by a single person as a hobby and to
              practice with new web development technologies. It might have bugs
              or any other issues. If you have something to say use the{' '}
              <Link to="/contact">contact form</Link>.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
