import UrlParamEncoder from './UrlParamEncoder'
import axios from 'axios'

export interface IVideoCategoriesConfig {
  part: string
  regionCode: string
  hl: string
}

interface IPageInfo {
  totalResults: number
  resultsPerPage: number
}

interface ISnippet {
  channelId: string
  title: string
  assignable: boolean
}

interface IVideoCategoryResource {
  kind: string
  etag: string
  id: string
  snippet: ISnippet
}

export interface IVideoCategoriesApiResponse {
  kind: string
  etag: string
  nextPageToken: string
  prevPageToken: string
  pageInfo: IPageInfo
  items: IVideoCategoryResource[]
}

export default class YoutubeApiFetcher {
  apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getApiUrl(): string {
    return 'https://www.googleapis.com/youtube/v3/'
  }

  private getVideoCategoriesUrl(
    config: IVideoCategoriesConfig
  ): string {
    return (
      this.getApiUrl() +
      'videoCategories?' +
      UrlParamEncoder(config) +
      '&key=' +
      this.apiKey
    )
  }

  public fetchVideoCategories(
    config: IVideoCategoriesConfig
  ): Promise<IVideoCategoriesApiResponse> {
    return axios.get(this.getVideoCategoriesUrl(config))
  }
}
