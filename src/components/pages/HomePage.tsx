import React from 'react'
import { MainTitle } from '../MainTitle'
import { VideoApp } from '../VideoApp'
import Helmet from 'react-helmet'

type HomePageProps = {
  defaultCountry: string
}

export const HomePage: React.FC<HomePageProps> = props => {
  return (
    <>
      <Helmet>
        <title>Ytrends - The best trending videos!</title>
        <meta
          name="description"
          content="Explore the latest trending videos from an alternative algorithm. Configure your preferences as you like. Discores small content creators."
        />
      </Helmet>
      <MainTitle />
      <VideoApp country={props.defaultCountry} />
    </>
  )
}
