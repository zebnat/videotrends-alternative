import axios from 'axios'
import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react'
import './App.css'
import { IVideo } from './common/types'
import Video from './components/Video'
import { RegionList } from './config/config'

const App: React.FC = () => {
  let [videos, setVideos] = useState<Array<IVideo>>([])
  let [smallChannel, setSmallChannel] = useState<boolean>(
    false
  )
  let [country, setCountry] = useState<string>('select')

  var acceptedCountries: Array<string> = []
  for (let x in RegionList) {
    acceptedCountries.push(
      RegionList[x].language + '-' + RegionList[x].country
    )
  }

  const toogleSmall = () => {
    setSmallChannel(!smallChannel)
  }
  const allowedCountry = (locale: string) => {
    let countryFound: boolean = false
    for (let x in acceptedCountries) {
      if (acceptedCountries[x] === locale) {
        countryFound = true
        break
      }
    }
    return countryFound
  }

  const changeCountry = async (
    locale: string
  ): Promise<void> => {
    let countryFound = allowedCountry(locale)
    if (countryFound) {
      const videos = await axios.get(
        '../data/dataset-' + locale + '.json'
      )
      setCountry(locale)
      setVideos(videos.data)
    }
  }

  const selectChanged = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target !== null) {
      changeCountry(e.target.value)
    }
  }

  const forceScroll = () => {
    setTimeout(() => {
      window.scroll(0, window.scrollY + 1)
    }, 200)
  }

  useEffect(() => {
    forceScroll()
  }, [])

  const videoList = smallChannel
    ? videos.filter(v => v.subs < 200000)
    : videos

  let videoBlock
  if (country === 'select') {
    videoBlock = <p>Please select your Country first</p>
  } else {
    videoBlock = (
      <ol className="video-list">
        {videoList.map((video, index) => {
          if (index < 60) {
            return <Video key={video.videoId} {...video} />
          } else {
            return null
          }
        })}
      </ol>
    )
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>VideoTrends Alternative</h1>
      </div>
      <div className="formOpts">
        <label>Canales Pequeños</label>
        <input type="checkbox" onClick={toogleSmall} />
        <div className="selectBlock">
          <label>Country: </label>
          <select onChange={selectChanged} value={country}>
            <option value="select">Select</option>
            {RegionList.map(e => (
              <option value={e.language + '-' + e.country}>
                {e.screenName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {videoBlock}
    </div>
  )
}

export default App
