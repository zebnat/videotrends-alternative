import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Video as VideoType } from '../common/types'
import {
  BanCategories,
  BannedCategory,
  prepareBanList,
  useBanCategories,
  sortCategoriesDesc,
} from './BanCategories'
import Video from './Video'
import './VideoListings.scss'
import Switch from 'react-switch'
import ProdjsonToVideoAdapter from '../lib/ProdjsonToVideoAdapter'
import DevjsonToVideoAdapter from '../lib/devjsonToVideoAdapter'
import { MAX_VIDEOS_SHOWN } from '../config/config'

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

    let videos: VideoType[]
    let jsonList: Array<any> = res.data
    if (process.env.NODE_ENV === 'production') {
      videos = jsonList.map(e => new ProdjsonToVideoAdapter(e))
    } else if (process.env.NODE_ENV === 'development') {
      videos = jsonList.map(e => new DevjsonToVideoAdapter(e))
    } else {
      videos = jsonList.map(e => new ProdjsonToVideoAdapter(e))
    }

    let categories = prepareBanList(videos)
    categories.sort(sortCategoriesDesc)
    setVideos(videos)
    setCategoriesBanList(categories)
    setLoading(false)
  }

  useEffect(() => {
    if (props.country !== '') fetchVideoDataset(props.country)
    // eslint-disable-next-line
  }, [props.country])

  // user changed wanted/unwanted categories
  useEffect(() => {
    let updatedVideos = updateCategories(videos, categoriesBanList)
    // eslint-disable-next-line
    setVideos(updatedVideos)
    // eslint-disable-next-line
  }, [categoriesBanList])

  let videoList: VideoType[] = smallChannel
    ? videos.filter(v => v.subs < 100000)
    : videos

  let videoBlock: JSX.Element

  if (props.country === '') {
    videoBlock = (
      <div className="container has-text-centered section is-large">
        <p className="is-size-2">Select country</p>
      </div>
    )
  } else {
    const passPropsToVideo = (
      video: VideoType,
      index: number
    ): JSX.Element | null => {
      const videoProps: VideoType = {
        visible: video.visible,
        categories: video.categories,
        categoryId: video.categoryId,
        channelId: video.channelId,
        daysAgo: video.daysAgo,
        details: video.details,
        href: video.href,
        lang: video.lang,
        lazyIndex: video.lazyIndex,
        normalize: video.normalize,
        rating: video.rating,
        spam: video.spam,
        stats: video.stats,
        status: video.status,
        subs: video.subs,
        thumb: video.thumb,
        title: video.title,
        trendCategoryPosition: video.trendCategoryPosition,
        videoId: video.videoId,
      }

      return index < MAX_VIDEOS_SHOWN ? (
        <Video key={index} lazyIndex={index} {...videoProps} />
      ) : null
    }

    videoBlock = (
      <ol className="video-list">
        {videoList.filter(v => v.visible).map(passPropsToVideo)}
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
          <h3 className="title is-size-5">Disable unwanted categories</h3>
          <hr />
          <BanCategories categories={categoriesBanList} onClick={banCategory} />
          <hr />
          <div className="has-text-centered">
            <div className="small-channels">
              <div className="is-pulled-left">
                <Switch onChange={toogleSmall} checked={smallChannel} />
              </div>
              <div className="is-pulled-left" style={{ margin: '5px 15px' }}>
                Discover Small Channels
              </div>
              <div className="is-clearfix"></div>
            </div>
          </div>
        </section>
      )
    }

    const ClosedFilters = () => {
      return (
        <button className="button is-primary" onClick={openFilter}>
          Customize
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
