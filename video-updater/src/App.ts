import { writeFileSync } from 'fs'
import { resolve } from 'path'
import {
  Locale,
  Video,
  ProdVideoJSON,
  DevVideoJSON,
} from '../../src/common/types'
import { applyAlgorithm } from './ApplyAlgorithm'
import CachedCategoriesFetcher from './CachedCategoriesFetcher'
import CachedVideoFetcher from './CachedVideoFetcher'
import CategoriesFetcher from './CategoriesFetcher'
import VideosFetcher from './VideosFetcher'
import YoutubeApiFetcher, { VideoResource } from './YoutubeApiFetcher'

export type CacheFiles = {
  categories: string
  videos: string
}
export type Config = {
  apikey: string
  cache: boolean
  prodReady: boolean
  regionList: Locale[]
  cacheFiles: CacheFiles
}

export class App {
  config: Config
  catFetcher: CategoriesFetcher
  videoFetcher: VideosFetcher

  constructor(config: Config) {
    this.config = config
    let api: YoutubeApiFetcher = new YoutubeApiFetcher(config.apikey)
    this.catFetcher = new CategoriesFetcher(api, config.regionList)
    this.videoFetcher = new VideosFetcher(api)
  }

  async run(): Promise<void> {
    let videoDataPack = await this.getDataFromYoutube()
    this.saveDataToJsonLocalizedFiles(videoDataPack)
    return
  }

  private async getDataFromYoutube() {
    // First we fetch all the categories (from all regions)
    let categoryPack = await CachedCategoriesFetcher(
      this.config.cache,
      this.config.cacheFiles,
      this.catFetcher
    )

    // We can fetch now a full list of videos for each category and each region
    let videoDataPack = await CachedVideoFetcher(
      this.config.cache,
      this.config.cacheFiles,
      categoryPack,
      this.videoFetcher
    )

    return videoDataPack
  }

  private saveDataToJsonLocalizedFiles(
    videoDataPack: [VideoResource[], object][]
  ) {
    this.config.regionList.forEach((element, index) => {
      let videos = applyAlgorithm(
        videoDataPack[index][0],
        videoDataPack[index][1]
      )

      let saveVideos: Array<ProdVideoJSON | DevVideoJSON>

      if (this.config.prodReady) {
        saveVideos = videos.map(v => {
          const json: ProdVideoJSON = {
            v: v.visible,
            t: v.title,
            r: v.rating,
            d: v.daysAgo,
            tm: v.thumb,
            h: v.href,
            c: v.categories,
            s: v.subs,
          }
          return json
        })

        saveVideos = saveVideos.slice(0, 250)
      } else {
        saveVideos = videos.map(v => {
          const json: DevVideoJSON = {
            categories: v.categories,
            categoryId: v.categoryId,
            channelId: v.channelId,
            daysAgo: v.daysAgo,
            details: v.details,
            href: v.href,
            lang: v.lang,
            normalize: v.normalize,
            rating: v.rating,
            spam: v.spam,
            stats: v.stats,
            status: v.status,
            subs: v.subs,
            thumb: v.thumb,
            title: v.title,
            trendCategoryPosition: v.trendCategoryPosition,
            videoId: v.videoId,
            visible: v.visible,
          }
          return json
        })
      }

      writeFileSync(
        resolve(
          './public/data/dataset-' +
            element.language +
            '-' +
            element.country +
            '.json'
        ),
        JSON.stringify(saveVideos)
      )
    })
  }
}
