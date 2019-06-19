import YoutubeApiFetcher, {
  IVideoCategoriesApiResponse,
} from './YoutubeApiFetcher'
import { ILocale } from './App'

export default class CategoriesFetcher {
  regionList: ILocale[]
  api: YoutubeApiFetcher

  constructor(apiKey: string, regionList: ILocale[]) {
    this.regionList = regionList
    this.api = new YoutubeApiFetcher(apiKey)
  }

  public async fetchAll() {
    let p: Promise<any>[]

    this.regionList.forEach((l: ILocale) => {
      p.push(this.fetchOne(l))
    })

    let data: any = await Promise.all(p)

    console.log(data)
  }

  private fetchOne(l: ILocale) {
    return new Promise(async (resolve, reject) => {
      try {
        var data = await this.api.fetchVideoCategories({
          part: 'id,snippet',
          regionCode: l.country,
          hl: l.language,
        })
      } catch (error) {
        reject('Fetching VideoCategories failed')
      }

      resolve(data)
    })
  }
}
