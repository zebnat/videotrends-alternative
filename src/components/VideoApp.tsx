import React, { useState, useEffect } from 'react'
import { SelectCountry } from './SelectCountry'
import { RegionList } from '../config/config'
import { VideoListings } from './VideoListings'
import { prepareRegionList } from '../utils'

interface IVideoAppProps {
  country: string
}

const regions = prepareRegionList(RegionList)

export const VideoApp: React.FC<IVideoAppProps> = props => {
  let [country, setCountry] = useState<string>('')

  const allowedCountry = (locale: string) => {
    return regions.includes(locale)
  }

  const changeCountry = async (locale: string): Promise<void> => {
    let countryFound = allowedCountry(locale)
    if (countryFound) {
      setCountry(locale)
    }
  }

  const selectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target !== null) {
      changeCountry(e.currentTarget.value)
    }
  }

  useEffect(() => {
    changeCountry(props.country)
  }, [props.country])

  return (
    <>
      <SelectCountry
        onChange={selectChanged}
        regionList={RegionList}
        country={country}
      />
      <VideoListings country={country} />
    </>
  )
}
