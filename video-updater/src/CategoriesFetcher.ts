import YoutubeApiFetcher, {
  IVideoCategoriesApiResponse,
} from './YoutubeApiFetcher'
import { ILocale } from '../../src/config/config'

export interface IVideoCategories
  extends IVideoCategoriesApiResponse {
  regionCode: string
  hl: string
}

export default class CategoriesFetcher {
  regionList: ILocale[]
  api: YoutubeApiFetcher

  constructor(
    api: YoutubeApiFetcher,
    regionList: ILocale[]
  ) {
    this.regionList = regionList
    this.api = api
  }

  public async fetchAll(): Promise<IVideoCategories[]> {
    let p: Promise<IVideoCategories>[] = []

    this.regionList.forEach((l: ILocale) => {
      p.push(this.fetchOne(l))
    })

    let data: IVideoCategories[]

    try {
      data = await Promise.all(p)
    } catch (error) {
      throw error
    }

    return data
  }

  private fetchOne(l: ILocale): Promise<IVideoCategories> {
    return new Promise(async (resolve, reject) => {
      let list: IVideoCategories

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

        list = Object.assign(apiData, {
          regionCode: l.country,
          hl: l.language,
        })
      } catch (error) {
        reject(error)
      }

      resolve(list)
    })
  }
}
