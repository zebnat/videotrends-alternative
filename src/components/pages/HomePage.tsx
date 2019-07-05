import React from 'react'
import { MainTitle } from '../MainTitle'
import { VideoApp } from '../VideoApp'

type HomePageProps = {
  defaultCountry: string
}

export const HomePage: React.FC<HomePageProps> = props => {
  console.log(props)
  return (
    <>
      <MainTitle />
      <VideoApp country={props.defaultCountry} />
    </>
  )
}
