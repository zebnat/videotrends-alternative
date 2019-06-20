import { IVideoCategories } from './CategoriesFetcher'
import YoutubeApiFetcher, {
  IVideoCategoryResource,
  IVideoResource,
  IVideoList,
  IVideoCategoriesConfig,
  IVideosFromCategoryConfig,
} from './YoutubeApiFetcher'

export default class VideosFetcher {
  api: YoutubeApiFetcher
  constructor(api: YoutubeApiFetcher) {
    this.api = api
  }

  /**
   *
   * @todo add cache logic
   */
  fetchVideosFromAllCountryCategories(
    categoriesList: IVideoCategories[]
  ): Promise<IVideoResource[][]> {
    let promiseQueue: Promise<IVideoResource[]>[] = []
    categoriesList.forEach(countrySpecificCategories => {
      promiseQueue.push(
        this.fetchVideosFromCategories(
          countrySpecificCategories
        )
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
  ): Promise<IVideoResource[]> {
    let promiseQueue: Promise<IVideoResource[]>[] = []

    categories.items.forEach(category => {
      promiseQueue.push(
        this.fetchVideosFromCategory(
          categories.regionCode,
          categories.hl,
          category
        )
      )
    })

    try {
      let videos: IVideoResource[][] = await Promise.all(
        promiseQueue
      )

      let filteredVideos: IVideoResource[] = this.processAndFilterVideos(
        videos,
        categories.hl,
        categories.regionCode
      )

      // @todo Fetch channelList for each country here ?
      return filteredVideos
    } catch (e) {
      throw new Error(e)
    }
  }

  private processAndFilterVideos(
    listOfVideosPerCategory: IVideoResource[][],
    lang: string,
    region: string
  ): IVideoResource[] {
    let videos = this.mergeVideosAndTheirCategories(
      listOfVideosPerCategory
    )
    let allowLangs = new RegExp(
      '/' + lang + '-([a-zA-Z0-9].+|[a-zA-Z0-9])$/',
      'i'
    )

    let filteredVideos = videos.filter(video => {
      var fromMyLanguage
      const isVideoRegion = video.snippet.defaultAudioLanguage.match(
        /[a-zA-Z0-9]+\-[a-zA-Z0-9]+/
      )
      if (isVideoRegion) {
        fromMyLanguage =
          video.snippet.defaultAudioLanguage.toLowerCase() ==
          lang + '-' + region
      } else {
        fromMyLanguage =
          video.snippet.defaultAudioLanguage == lang
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

      const published =
        video.status.privacyStatus == 'public'
      const processed =
        video.status.uploadStatus == 'processed'
      const notRestricted =
        video.contentDetails.regionRestriction === undefined
      const fresh =
        Math.floor(
          Math.abs(
            (Date.parse(video.snippet.publishedAt) -
              new Date().getTime()) /
              (24 * 60 * 60 * 1000)
          )
        ) < 15

      return (
        fromMyLanguage &&
        published &&
        processed &&
        notRestricted &&
        fresh
      )
    })

    return filteredVideos
  }

  private mergeVideosAndTheirCategories(
    listOfVideosPerCategory: IVideoResource[][]
  ): IVideoResource[] {
    let cleanedVideos = {}
    listOfVideosPerCategory.forEach(list => {
      list.forEach(vid => {
        if (cleanedVideos[vid.id] === undefined) {
          cleanedVideos[vid.id] = vid
        } else {
          cleanedVideos[vid.id]['categories'].push(
            vid.categories
          )
        }
      })
    })

    let mergedVideos: IVideoResource[] = []
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
    category: IVideoCategoryResource
  ): Promise<IVideoResource[]> {
    let allVideos: IVideoResource[] = []

    let videos: IVideoList

    try {
      let hasPagination: boolean = undefined
      while (hasPagination || hasPagination == undefined) {
        let ApiObject: IVideosFromCategoryConfig = {
          part:
            'id,snippet,contentDetails,player,recordingDetails,statistics,status,topicDetails',
          regionCode: region,
          hl: lang,
          videoCategoryId: category.id,
        }

        if (hasPagination) {
          ApiObject = Object.assign(ApiObject, {
            pageToken: videos.nextPageToken,
          })
        }

        videos = await this.api.fetchVideosFromCategory(
          ApiObject
        )

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
        }

        hasPagination =
          videos.nextPageToken !== undefined &&
          videos.nextPageToken.length > 0
      }

      return allVideos
    } catch (e) {
      console.log(e)
    }
  }
}
