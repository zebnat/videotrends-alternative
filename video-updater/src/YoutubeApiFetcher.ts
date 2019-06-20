import UrlParamEncoder from './UrlParamEncoder'
import axios, { AxiosResponse } from 'axios'
import { id } from 'postcss-selector-parser'

export interface IVideoCategoriesConfig {
  part: string
  regionCode: string
  hl: string
}
export interface IVideosFromCategoryConfig
  extends IVideoCategoriesConfig {
  videoCategoryId: string
  pageToken?: string
}
export interface IVideoList {
  kind: string
  etag: string
  nextPageToken: string
  pageInfo: object
  items: IVideoResource[]
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

export interface IVideoCategoryResource {
  kind: string
  etag: string
  id: string
  snippet: ISnippet
}

interface IVideoSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: object
  channelTitle: string
  tags: [string]
  categoryId: string
  liveBroadcasContent: string
  defaultLanguage: string
  localized: object
  defaultAudioLanguage: string
}
interface IVideoStatus {
  privacyStatus: string
  uploadStatus: string
  failureReason: string
  rejectionReason: string
  publishAt: string
  license: string
  embeddable: boolean
  publicStatsViewable: boolean
}
interface IVideoContentDetails {
  regionRestriction: object
  duration: string
  dimension: string
  definition: string
  caption: string
  licensedContent: boolean
  contentRating: object
  projection: string
  hasCustomThumbnail: boolean
}

interface IVideoStatistics {
  viewCount: number
  likeCount: number
  dislikeCount: number
  favoriteCount: number
  commentCount: number
}
export interface IVideoResource {
  kind: string
  etag: string
  id: string
  snippet: IVideoSnippet
  contentDetails: IVideoContentDetails
  status: IVideoStatus
  statistics: IVideoStatistics
  player: object
  topicDetails: object
  recordingDetails: object
  fileDetails: object
  processingDetails: object
  suggestions: object
  liveStreamingDetails: object
  localizations: object
  categories?: [string]
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

  public async fetchVideoCategories(
    config: IVideoCategoriesConfig
  ): Promise<IVideoCategoriesApiResponse> {
    let res: AxiosResponse
    try {
      res = await axios.get(
        this.getVideoCategoriesUrl(config)
      )
    } catch (e) {
      throw e
    }

    return res.data
  }

  private getVideosFromCategoryUrl(
    config: IVideosFromCategoryConfig
  ) {
    console.log(
      this.getApiUrl() +
        'videos?' +
        UrlParamEncoder(config) +
        '&chart=mostPopular' +
        '&maxResults=50' +
        '&key=' +
        this.apiKey
    )
    return (
      this.getApiUrl() +
      'videos?' +
      UrlParamEncoder(config) +
      '&chart=mostPopular' +
      '&maxResults=50' +
      '&key=' +
      this.apiKey
    )
  }

  public async fetchVideosFromCategory(
    config: IVideosFromCategoryConfig
  ): Promise<IVideoList> {
    let res: AxiosResponse
    try {
      res = await axios.get(
        this.getVideosFromCategoryUrl(config)
      )
    } catch (e) {
      throw e
    }

    return res.data
  }
}
