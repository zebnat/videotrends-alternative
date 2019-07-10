import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Video as VideoType } from '../common/types'
import {
  BanCategories,
  BannedCategory,
  prepareBanList,
  useBanCategories,
} from './BanCategories'
import Video from './Video'
import './VideoListings.scss'
import Switch from 'react-switch'

export const VideoListings = (props: VideoListingsProps): JSX.Element => {
  let [videos, setVideos] = useState<VideoType[]>([])
  let [smallChannel, setSmallChannel] = useState<boolean>(false)
  let [loading, setLoading] = useState<boolean>(true)
  let [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  let [
    categoriesBanList,
    setCategoriesBanList,
    banCategory,
  ] = useBanCategories()

  const toogleSmall = () => {
    setSmallChannel(!smallChannel)
  }

  const fetchVideoDataset = async (country: string) => {
    setLoading(true)
    setFiltersOpen(false)
    setSmallChannel(false)

    let res = await axios.get('../data/dataset-' + country + '.json')

    let videos = res.data
    let categories = prepareBanList(videos)
    setVideos(videos)
    setCategoriesBanList(categories)
    setLoading(false)
  }

  useEffect(() => {
    if (props.country !== '') fetchVideoDataset(props.country)
  }, [props.country])

  // user changed wanted/unwanted categories
  useEffect(() => {
    let updatedVideos = updateCategories(videos, categoriesBanList)
    setVideos(updatedVideos)
  }, [categoriesBanList])

  let videoList: VideoType[] = []

  if (process.env.NODE_ENV === 'production') {
    videoList = smallChannel
      ? videos.filter(v => {
          if (v.s !== undefined) {
            return v.s < 100000
          }
        })
      : videos
  } else if (process.env.NODE_ENV === 'development') {
    videoList = smallChannel
      ? videos.filter(v => {
          if (v.subs !== undefined) {
            return v.subs < 100000
          }
        })
      : videos
  }

  let videoBlock: JSX.Element

  if (props.country === '') {
    videoBlock = (
      <div className="container has-text-centered section is-large">
        <p className="is-size-2">Select country</p>
      </div>
    )
  } else {
    videoBlock = (
      <ol className="video-list">
        {videoList.map((video, index) => {
          let visibleVideo: boolean = true
          if (process.env.NODE_ENV === 'production') {
            if (video.v !== undefined) visibleVideo = video.v
          } else if (process.env.NODE_ENV === 'development') {
            if (video.visible !== undefined) visibleVideo = video.visible
          }

          if (index < 60 && visibleVideo) {
            return <Video key={index} lazyIndex={index} {...video} />
          } else {
            return null
          }
        })}
      </ol>
    )
  }

  const stillLoading = (
    <div className="container has-text-centered	section is-large">
      <p className="is-size-2">Loading ...</p>
    </div>
  )

  const loaded = () => {
    const openFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setFiltersOpen(true)
    }

    const OpenFilters = () => {
      return (
        <section className="section container">
          <BanCategories categories={categoriesBanList} onClick={banCategory} />
          <div className="is-pulled-left">
            <Switch onChange={toogleSmall} checked={smallChannel} />
          </div>
          <div className="is-pulled-left" style={{ margin: '5px 15px' }}>
            Discover Small Channels
          </div>
        </section>
      )
    }

    const ClosedFilters = () => {
      return (
        <button className="button is-primary" onClick={openFilter}>
          Manage filters
        </button>
      )
    }

    return (
      <>
        <div className="has-text-centered">
          {filtersOpen ? OpenFilters() : ClosedFilters()}
        </div>
        {videoBlock}
      </>
    )
  }

  return loading ? stillLoading : loaded()
}

type VideoListingsProps = {
  country: string
}

/**
 * Toggles visibility for each video considering unwanted categories
 * @param videos
 * @param unwantedCategories
 */
const updateCategories = (
  videos: VideoType[],
  unwantedCategories: BannedCategory[]
): VideoType[] => {
  let simpleCategoryList: string[] = unwantedCategories
    .filter(c => {
      return c.banned === true
    })
    .map(c => c.name)

  let newVideos = videos.map(vid => {
    let foundCategory: boolean = false
    for (let x in simpleCategoryList) {
      let includesCategory: boolean = false

      if (process.env.NODE_ENV === 'production') {
        if (vid.c !== undefined) {
          includesCategory = vid.c.includes(simpleCategoryList[x])
        }
      } else if (process.env.NODE_ENV === 'development') {
        if (vid.categories !== undefined) {
          includesCategory = vid.categories.includes(simpleCategoryList[x])
        }
      }

      if (includesCategory) {
        foundCategory = true
        break
      }
    }

    let returnModifiedVideo: VideoType = {}

    if (process.env.NODE_ENV === 'production') {
      returnModifiedVideo = Object.assign(vid, { v: !foundCategory })
    } else if (process.env.NODE_ENV === 'development') {
      returnModifiedVideo = Object.assign(vid, { visible: !foundCategory })
    }

    // if a banned category is found, set visible to false, true otherwise
    return returnModifiedVideo
  })

  return newVideos
}
