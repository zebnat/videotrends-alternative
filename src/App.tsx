import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import { IVideo } from './common/types'
import Video from './components/Video'
import { RegionList } from './config/config'

interface IBannedCategory {
  name: string
  banned: boolean
}

const prepareBanList = (videos: IVideo[]): IBannedCategory[] => {
  let list: string[] = []

  videos.forEach(v => {
    v.categories.forEach(c => {
      list.push(c)
    })
  })

  let filteredList = list.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  let Banlist: IBannedCategory[] = []
  filteredList.forEach(c => {
    Banlist.push({
      name: c,
      banned: false,
    })
  })

  return Banlist
}

const App: React.FC = () => {
  let [videos, setVideos] = useState<Array<IVideo>>([])
  let [smallChannel, setSmallChannel] = useState<boolean>(false)
  let [country, setCountry] = useState<string>('select')
  let [categoriesBanList, setCategoriesBanList] = useState<IBannedCategory[]>(
    []
  )

  var acceptedCountries: Array<string> = []
  for (let x in RegionList) {
    acceptedCountries.push(RegionList[x].language + '-' + RegionList[x].country)
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

  const changeCountry = async (locale: string): Promise<void> => {
    let countryFound = allowedCountry(locale)
    if (countryFound) {
      const videos = await axios.get('../data/dataset-' + locale + '.json')
      setCountry(locale)
      setVideos(videos.data)

      let categories = prepareBanList(videos.data)
      setCategoriesBanList(categories)
    }
  }

  // when BanList changes
  useEffect(() => {
    let bannedList = categoriesBanList
      .filter(c => {
        return c.banned === true
      })
      .map(c => c.name)

    let newVideos = videos.map(v => {
      return { ...v }
    })

    newVideos = videos.map(vid => {
      let foundCategory: boolean = false
      bannedList.forEach(c => {
        if (vid.categories.includes(c)) {
          foundCategory = true
        }
      })

      // if a banned category is found, set visible to false
      vid.visible = !foundCategory

      return vid
    })

    setVideos(newVideos)
  }, [categoriesBanList])

  const banCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    let nextCategoriesBanList: IBannedCategory[] = categoriesBanList.map(c => {
      if (c.name == event.currentTarget.value) {
        c.banned = !c.banned
      }
      return c
    })

    setCategoriesBanList(nextCategoriesBanList)
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

  const videoList = smallChannel ? videos.filter(v => v.subs < 100000) : videos

  let videoBlock
  if (country === 'select') {
    videoBlock = <p>Please select your Country first</p>
  } else {
    videoBlock = (
      <ol className="video-list">
        {videoList.map((video, index) => {
          if (index < 60 && video.visible) {
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
            {RegionList.map((e, i) => (
              <option key={i} value={e.language + '-' + e.country}>
                {e.screenName}
              </option>
            ))}
          </select>
        </div>
        <div className="banList">
          {categoriesBanList.map((c, i) => (
            <button
              key={i}
              className={c.banned ? 'banned' : ''}
              value={c.name}
              onClick={banCategory}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      {videoBlock}
    </div>
  )
}

export default App
