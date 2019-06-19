import YoutubeApiFetcher, {
  IVideoCategoriesApiResponse,
} from './YoutubeApiFetcher'
import { ILocale } from '../../src/config/config'

export default class CategoriesFetcher {
  regionList: ILocale[]
  api: YoutubeApiFetcher

  constructor(apiKey: string, regionList: ILocale[]) {
    this.regionList = regionList
    this.api = new YoutubeApiFetcher(apiKey)
  }

  public async fetchAll(): Promise<[]> {
    let p: Promise<IVideoCategoriesApiResponse>[] = []

    this.regionList.forEach((l: ILocale) => {
      p.push(this.fetchOne(l))
    })

    let data: any
    try {
      data = await Promise.all(p)
    } catch (error) {
      throw error
    }

    return data
  }

  private fetchOne(
    l: ILocale
  ): Promise<IVideoCategoriesApiResponse> {
    return new Promise(async (resolve, reject) => {
      let list: IVideoCategoriesApiResponse

      try {
        let apiData = await this.api.fetchVideoCategories({
          part: 'id,snippet',
          regionCode: l.country,
          hl: l.language,
        })

        // filter and clean the resultset
        apiData.items
          .filter(item => item.snippet.assignable === true)
          .map(item => ({
            id: item.id,
            name: item.snippet.title,
          }))

        apiData['regionCode'] = l.country
        apiData['hl'] = l.language

        list = apiData
      } catch (error) {
        reject(error)
      }

      resolve(list)
    })
  }
}
