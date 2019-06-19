import axios from 'axios'
import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react'
import './App.css'
import Video, { IVideo } from './components/Video'
import { RegionList } from './config/config'

const App: React.FC = () => {
  let [videos, setVideos] = useState<Array<IVideo>>([])
  let [smallChannel, setSmallChannel] = useState<boolean>(
    false
  )
  let [country, setCountry] = useState<string>('select')
  /*
  const acceptedCountries: Array<string> = [
    'es-es',
    'en-us',
    'fr-fr',
    'en-gb',
    'es-mx',
    'es-ar',
    'es-cl',
    'ar-kw',
    'ar-qa',
    'de-de',
    'it-it',
    'ja-jp',
    'ko-kr',
    'nl-nl',
    'zh-hk',
	]
	*/

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
            <option value="es-es">España (Spain)</option>
            <option value="en-us">United States</option>
            <option value="fr-fr">La France</option>
            <option value="en-gb">United Kingdom</option>
            <option value="es-mx">México</option>
            <option value="es-ar">Argentina</option>
            <option value="es-cl">Chile</option>
            <option value="de-de">
              Deutschland (Germany)
            </option>
            <option value="it-it">Italia (Italy)</option>
            <option value="nl-nl">
              Nederland (Netherlands)
            </option>
            <option value="zh-hk">
              香港粵語 (Hong Kong)
            </option>
            <option value="ja-jp">日本 (Japan)</option>
            <option value="ko-kr">
              대한민국 (S.Korea)
            </option>
            <option value="ar-qa">قطر (Qatar)</option>
            <option value="ar-kw">الكويت (Kuwait)</option>
          </select>
        </div>
      </div>
      {videoBlock}
    </div>
  )
}

export default App
