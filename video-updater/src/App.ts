import CategoriesFetcher, {
  IVideoCategories,
} from './CategoriesFetcher'
import CachedCategoriesFetcher from './CachedCategoriesFetcher'
import { ILocale } from '../../src/config/config'
import YoutubeApiFetcher from './YoutubeApiFetcher'
import VideosFetcher from './VideosFetcher'

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
  api: YoutubeApiFetcher
  catFetcher: CategoriesFetcher
  videoFetcher: VideosFetcher

  constructor(config: IConfig) {
    this.config = config
    this.api = new YoutubeApiFetcher(config.apikey)

    this.catFetcher = new CategoriesFetcher(
      this.api,
      config.regionList
    )

    this.videoFetcher = new VideosFetcher(this.api)
  }

  async run(): Promise<void> {
    let categoryPack: IVideoCategories[] = await CachedCategoriesFetcher(
      this.config.cache,
      this.config.cacheFiles,
      this.catFetcher
    )

    try {
      let videoList = await this.videoFetcher.fetchVideosFromAllCountryCategories(
        categoryPack
      )
      console.log(videoList)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}
