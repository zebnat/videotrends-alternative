import React from 'react'
import { MainTitle } from '../MainTitle'
import { VideoApp } from '../VideoApp'

interface IHomePageProps {
  defaultCountry: string
}

export const HomePage: React.FC<IHomePageProps> = props => {
  return (
    <>
      <MainTitle />
      <VideoApp country={props.defaultCountry} />
    </>
  )
}
