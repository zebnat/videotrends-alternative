import axios, { AxiosResponse } from 'axios'
import { UrlParamEncoder } from './Utils'

export interface IVideoCategoriesConfig {
  part: string
  regionCode: string
  hl: string
}
export interface IVideosFromCategoryConfig extends IVideoCategoriesConfig {
  videoCategoryId: string
  pageToken?: string
}
export type VideoList = {
  items: VideoResource[]
  kind?: string
  etag?: string
  nextPageToken?: string
  pageInfo?: object
}
type PageInfo = {
  totalResults: number
  resultsPerPage: number
}

type Snippet = {
  channelId: string
  title: string
  assignable: boolean
}

export type VideoCategoryResource = {
  kind: string
  etag: string
  id: string
  snippet: Snippet
}

type ThumbnailsData = {
  url: string
  width: number
  height: number
}

type Thumbnails = {
  medium: ThumbnailsData
}

type VideoSnippet = {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: Thumbnails
  channelTitle: string
  tags: [string]
  categoryId: string
  liveBroadcasContent: string
  defaultLanguage: string
  localized: object
  defaultAudioLanguage: string
}
type VideoStatus = {
  privacyStatus: string
  uploadStatus: string
  failureReason: string
  rejectionReason: string
  publishAt: string
  license: string
  embeddable: boolean
  publicStatsViewable: boolean
}
type VideoContentDetails = {
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

type VideoStatistics = {
  viewCount: number
  likeCount: number
  dislikeCount: number
  favoriteCount: number
  commentCount: number
}
export type VideoResource = {
  kind: string
  etag: string
  id: string
  snippet: VideoSnippet
  contentDetails: VideoContentDetails
  status: VideoStatus
  statistics: VideoStatistics
  player: object
  categories?: [string]
}
export interface IVideoCategoriesApiResponse {
  kind: string
  etag: string
  nextPageToken: string
  prevPageToken: string
  pageInfo: PageInfo
  items: VideoCategoryResource[]
}

type ChannelStatistics = {
  subscriberCount: number
  viewCount: number
}

type ChannelSnippet = {
  title: string
}

export type ChannelsResource = {
  id: string
  snippet: ChannelSnippet
  statistics: ChannelStatistics
}

export type ChannelsApiResponse = {
  kind: string
  etag: string
  items: ChannelsResource[]
}

export default class YoutubeApiFetcher {
  apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getApiUrl(): string {
    return 'https://www.googleapis.com/youtube/v3/'
  }

  private getVideoCategoriesUrl(config: IVideoCategoriesConfig): string {
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
      res = await axios.get(this.getVideoCategoriesUrl(config))
    } catch (e) {
      throw e
    }

    return res.data
  }

  private getVideosFromCategoryUrl(config: IVideosFromCategoryConfig): string {
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
  ): Promise<VideoList> {
    let res: AxiosResponse
    try {
      res = await axios.get(this.getVideosFromCategoryUrl(config)).catch(e => {
        throw e
      })
      return res.data
    } catch (e) {
      if (e.response.status !== undefined && e.response.status == 400) {
        throw new Error('videoChartNotFound')
      } else {
        console.log(e)
        throw e
      }
    }
  }

  private getChannelsFromIdUrl(channelIds: [string]): string {
    return (
      this.getApiUrl() +
      'channels?' +
      'part=id,snippet,statistics' +
      '&id=' +
      channelIds.join(',') +
      '&key=' +
      this.apiKey
    )
  }

  public async fetchChannelsFromIds(
    channelIds: [string]
  ): Promise<ChannelsApiResponse> {
    let res: AxiosResponse
    try {
      res = await axios.get(this.getChannelsFromIdUrl(channelIds)).catch(e => {
        throw e
      })
    } catch (e) {
      throw e
    }

    return res.data
  }
}
