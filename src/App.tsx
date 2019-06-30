import React, { useEffect, useState } from 'react'
import './App.css'
import { SelectCountry } from './components/SelectCountry'
import { VideoListings } from './components/VideoListings'
import { RegionList } from './config/config'
import { prepareRegionList } from './utils'

const regions = prepareRegionList(RegionList)

const App: React.FC = (): JSX.Element => {
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

  const forceScroll = () => {
    setTimeout(() => {
      window.scroll(0, window.scrollY + 1)
    }, 200)
  }

  useEffect(() => {
    forceScroll()
    if (window.navigator.language !== undefined) {
      changeCountry(window.navigator.language.toLocaleLowerCase())
    }
  }, [])

  return (
    <div className="App">
      <div className="App-header">
        <h1>VideoTrends Alternative</h1>
        <SelectCountry
          onChange={selectChanged}
          regionList={RegionList}
          country={country}
        />
      </div>
      <VideoListings country={country} />
    </div>
  )
}

export default App
