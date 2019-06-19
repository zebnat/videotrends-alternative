import CategoriesFetcher from './CategoriesFetcher'
import CachedCategoriesFetcher from './CachedCategoriesFetcher'
import IVideoCategoriesApiResponse from './YoutubeApiFetcher'
import { ILocale } from '../../src/config/config'

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

  constructor(config: IConfig) {
    this.config = config
    this.catFetcher = new CategoriesFetcher(
      config.apikey,
      config.regionList
    )
  }

  async run(): Promise<void> {
    CachedCategoriesFetcher(
      this.config.cache,
      this.config.cacheFiles,
      this.catFetcher
    ).then(
      (packCategories: IVideoCategoriesApiResponse[]) => {
        console.log(packCategories)
      }
    )
  }
}
