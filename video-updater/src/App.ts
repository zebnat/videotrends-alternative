import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { ILocale, IVideo } from '../../src/common/types'
import { applyAlgorithm } from './ApplyAlgorithm'
import CachedCategoriesFetcher from './CachedCategoriesFetcher'
import CachedVideoFetcher from './CachedVideoFetcher'
import CategoriesFetcher from './CategoriesFetcher'
import VideosFetcher from './VideosFetcher'
import YoutubeApiFetcher, { IVideoResource } from './YoutubeApiFetcher'

export interface ICacheFiles {
  categories: string
  videos: string
}
export interface IConfig {
  apikey: string
  cache: boolean
  regionList: ILocale[]
  cacheFiles: ICacheFiles
}

export class App {
  config: IConfig
  catFetcher: CategoriesFetcher
  videoFetcher: VideosFetcher

  constructor(config: IConfig) {
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
    videoDataPack: [IVideoResource[], object][]
  ) {
    this.config.regionList.forEach((element, index) => {
      let videos = applyAlgorithm(
        videoDataPack[index][0],
        videoDataPack[index][1]
      )

      writeFileSync(
        resolve(
          './public/data/dataset-' +
            element.language +
            '-' +
            element.country +
            '.json'
        ),
        JSON.stringify(videos)
      )
    })
  }
}
