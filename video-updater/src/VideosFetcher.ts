import { IVideoCategories } from './CategoriesFetcher'
import { splitArrayInChunks } from './Utils'
import YoutubeApiFetcher, {
  ChannelsApiResponse,
  VideoCategoryResource,
  VideoList,
  VideoResource,
  IVideosFromCategoryConfig,
} from './YoutubeApiFetcher'

export default class VideosFetcher {
  api: YoutubeApiFetcher
  constructor(api: YoutubeApiFetcher) {
    this.api = api
  }

  fetchVideosFromAllCountryCategories(
    categoriesList: IVideoCategories[]
  ): Promise<[VideoResource[], object][]> {
    let promiseQueue: Promise<[VideoResource[], object]>[] = []
    categoriesList.forEach(countrySpecificCategories => {
      promiseQueue.push(
        this.fetchVideosFromCategories(countrySpecificCategories)
      )
    })

    try {
      return Promise.all(promiseQueue)
    } catch (e) {
      throw new Error(e)
    }
  }

  private async fetchVideosFromCategories(
    categories: IVideoCategories
  ): Promise<[VideoResource[], object]> {
    let promiseQueue: Promise<VideoResource[]>[] = []

    categories.items.forEach(category => {
      promiseQueue.push(
        this.fetchVideosFromCategory(
          categories.regionCode,
          categories.hl,
          category
        )
      )
    })

    let videos: VideoResource[][] = await Promise.all(promiseQueue)

    let filteredVideos: VideoResource[] = this.processAndFilterVideos(
      videos,
      categories.hl,
      categories.regionCode
    )

    let channels = await this.fetchChannelsFromVideos(filteredVideos)

    return [filteredVideos, channels]
  }

  private async fetchChannelsFromVideos(
    videos: VideoResource[]
  ): Promise<object> {
    try {
      let channelsIndex: object = {}
      videos.forEach(vid => {
        channelsIndex[vid.snippet.channelId] = true
      })

      let channelgroups = splitArrayInChunks(Object.keys(channelsIndex), 10)

      let channelApiCalls: Promise<ChannelsApiResponse>[] = []
      channelgroups.forEach(group => {
        channelApiCalls.push(this.api.fetchChannelsFromIds(group))
      })

      let channels = await Promise.all(channelApiCalls)
      channels.forEach(apiResponse => {
        if (apiResponse.items.length > 0) {
          apiResponse.items.forEach(item => {
            if (channelsIndex[item.id] !== undefined) {
              channelsIndex[item.id] = {
                name: item.snippet.title,
                subs: item.statistics.subscriberCount,
                views: item.statistics.viewCount,
              }
            }
          })
        }
      })

      return channelsIndex
    } catch (e) {
      throw e
    }
  }

  private processAndFilterVideos(
    listOfVideosPerCategory: VideoResource[][],
    lang: string,
    region: string
  ): VideoResource[] {
    let videos = this.mergeVideosAndTheirCategories(listOfVideosPerCategory)
    let allowLangs = new RegExp(
      '/' + lang + '-([a-zA-Z0-9].+|[a-zA-Z0-9])$/',
      'i'
    )

    let filteredVideos = videos.filter(video => {
      var fromMyLanguage: boolean

      var isVideoRegion: RegExpMatchArray = undefined

      // @todo refactor this mess
      if (video.snippet.defaultAudioLanguage !== undefined) {
        isVideoRegion = video.snippet.defaultAudioLanguage.match(
          /[a-zA-Z0-9]+\-[a-zA-Z0-9]+/
        )

        if (isVideoRegion) {
          fromMyLanguage =
            video.snippet.defaultAudioLanguage.toLowerCase() ==
            lang + '-' + region
        } else {
          fromMyLanguage = video.snippet.defaultAudioLanguage == lang
          /* vanilla filter
						fromMyLanguage = (
							video.snippet.defaultAudioLanguage == lang
							|| (
									video.snippet.defaultAudioLanguage !== undefined &&
									video.snippet.defaultAudioLanguage.match(allowLangs)
								 )
							);
							*/
        }
      } else {
        if (video.snippet.defaultLanguage !== undefined) {
          if (
            video.snippet.defaultLanguage.match(/[a-zA-Z0-9]+\-[a-zA-Z0-9]+/)
          ) {
            fromMyLanguage =
              video.snippet.defaultLanguage.toLowerCase() == lang + '-' + region
          } else {
            fromMyLanguage = video.snippet.defaultLanguage == lang
          }
        } else {
          fromMyLanguage = false
        }
      }

      const published = video.status.privacyStatus == 'public'
      const processed = video.status.uploadStatus == 'processed'
      const notRestricted = video.contentDetails.regionRestriction === undefined
      const fresh =
        Math.floor(
          Math.abs(
            (Date.parse(video.snippet.publishedAt) - new Date().getTime()) /
              (24 * 60 * 60 * 1000)
          )
        ) < 15

      return fromMyLanguage && published && processed && notRestricted && fresh
    })

    return filteredVideos
  }

  private mergeVideosAndTheirCategories(
    listOfVideosPerCategory: VideoResource[][]
  ): VideoResource[] {
    let cleanedVideos = {}
    listOfVideosPerCategory.forEach(list => {
      list.forEach(vid => {
        if (cleanedVideos[vid.id] === undefined) {
          cleanedVideos[vid.id] = vid
        } else {
          if (vid.categories.length > 0) {
            vid.categories.forEach(category => {
              cleanedVideos[vid.id]['categories'].push(category)
            })
          }
        }
      })
    })

    let mergedVideos: VideoResource[] = []
    for (let prop in cleanedVideos) {
      if (Object.hasOwnProperty.call(cleanedVideos, prop)) {
        mergedVideos.push(cleanedVideos[prop])
      }
    }

    return mergedVideos
  }
  private async fetchVideosFromCategory(
    region: string,
    lang: string,
    category: VideoCategoryResource
  ): Promise<VideoResource[]> {
    let allVideos: VideoResource[] = []

    let videos: VideoList

    let hasPagination: boolean = undefined
    while (hasPagination || hasPagination == undefined) {
      let ApiObject: IVideosFromCategoryConfig = {
        part: 'id,snippet,contentDetails,player,statistics,status',
        regionCode: region,
        hl: lang,
        videoCategoryId: category.id,
      }

      if (hasPagination === true) {
        ApiObject = Object.assign(ApiObject, {
          pageToken: videos.nextPageToken,
        })
      }

      try {
        videos = await this.api.fetchVideosFromCategory(ApiObject)
      } catch (e) {
        if (e.message == 'videoChartNotFound') {
          videos = undefined
          break
        } else {
          throw e
        }
      }

      if (videos.items !== undefined) {
        videos.items.forEach(video => {
          let videoIsValid: boolean =
            video.snippet !== undefined &&
            video.snippet.thumbnails !== undefined &&
            video.contentDetails !== undefined
          if (videoIsValid) {
            allVideos.push(
              Object.assign(video, {
                categories: [category.snippet.title],
              })
            )
          }
        })
      } else {
        // No more videos, force out of while loop
        break
      }

      hasPagination =
        videos.nextPageToken !== undefined && videos.nextPageToken.length > 0
    }

    return allVideos
  }
}
