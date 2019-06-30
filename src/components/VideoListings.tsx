import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IVideo } from '../common/types'
import {
  BanCategories,
  IBannedCategory,
  prepareBanList,
  useBanCategories,
} from './BanCategories'
import Video from './Video'
import './VideoListings.css'

export const VideoListings = (props: IVideoListingsProps): JSX.Element => {
  let [videos, setVideos] = useState<IVideo[]>([])
  let [smallChannel, setSmallChannel] = useState<boolean>(false)
  let [
    categoriesBanList,
    setCategoriesBanList,
    banCategory,
  ] = useBanCategories()

  const toogleSmall = () => {
    setSmallChannel(!smallChannel)
  }

  const fetchVideoDataset = async (country: string) => {
    let res = await axios.get('../data/dataset-' + country + '.json')

    let videos = res.data
    let categories = prepareBanList(videos)
    setVideos(videos)
    setCategoriesBanList(categories)
  }

  useEffect(() => {
    if (props.country !== '') fetchVideoDataset(props.country)
  }, [props.country])

  // user changed wanted/unwanted categories
  useEffect(() => {
    let updatedVideos = updateCategories(videos, categoriesBanList)
    setVideos(updatedVideos)
  }, [categoriesBanList])

  const videoList = smallChannel ? videos.filter(v => v.subs < 100000) : videos

  let videoBlock: JSX.Element

  if (props.country === '') {
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
    <div>
      <label>Canales Pequeños</label>
      <input type="checkbox" onClick={toogleSmall} />
      <BanCategories categories={categoriesBanList} onClick={banCategory} />
      {videoBlock}
    </div>
  )
}

interface IVideoListingsProps {
  country: string
}

/**
 * Toggles visibility for each video considering unwanted categories
 * @param videos
 * @param unwantedCategories
 */
const updateCategories = (
  videos: IVideo[],
  unwantedCategories: IBannedCategory[]
): IVideo[] => {
  let simpleCategoryList: string[] = unwantedCategories
    .filter(c => {
      return c.banned === true
    })
    .map(c => c.name)

  let newVideos = videos.map(vid => {
    let foundCategory: boolean = false
    for (let x in simpleCategoryList) {
      if (vid.categories.includes(simpleCategoryList[x])) {
        foundCategory = true
        break
      }
    }

    // if a banned category is found, set visible to false, true otherwise
    return Object.assign(vid, { visible: !foundCategory })
  })

  return newVideos
}
