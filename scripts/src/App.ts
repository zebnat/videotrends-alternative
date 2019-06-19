import CategoriesFetcher from './CategoriesFetcher'

export interface ILocale {
  language: string
  country: string
}

export interface IConfig {
  apikey: string
  cache: boolean
  regionList: ILocale[]
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

  run(): void {
    this.catFetcher.fetchAll()
  }
}
