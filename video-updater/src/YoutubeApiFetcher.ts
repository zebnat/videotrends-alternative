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
export interface IVideoList {
  items: IVideoResource[]
  kind?: string
  etag?: string
  nextPageToken?: string
  pageInfo?: object
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

interface IThumbnailsData {
  url: string
  width: number
  height: number
}

interface IThumbnails {
  medium: IThumbnailsData
}

interface IVideoSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: IThumbnails
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

interface IChannelStatistics {
  subscriberCount: number
  viewCount: number
}

interface IChannelSnippet {
  title: string
}

export interface IChannelsResource {
  id: string
  snippet: IChannelSnippet
  statistics: IChannelStatistics
}

export interface IChannelsApiResponse {
  kind: string
  etag: string
  items: IChannelsResource[]
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
  ): Promise<IVideoList> {
    let res: AxiosResponse
    try {
      res = await axios.get(this.getVideosFromCategoryUrl(config)).catch(e => {
        console.log('Errors happen brah')
        throw e
      })
      return res.data
    } catch (e) {
      if (e.response.status !== undefined && e.response.status == 400) {
        console.log('Is this cached right?')
        throw new Error('videoChartNotFound')
      } else {
        console.log('OHHHHH FUCKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK')
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
  ): Promise<IChannelsApiResponse> {
    let res: AxiosResponse
    try {
      res = await axios.get(this.getChannelsFromIdUrl(channelIds)).catch(e => {
        throw e
      })
    } catch (e) {
      console.log('channels kaboom!')
      console.log(e)
      throw e
    }

    return res.data
  }
}
