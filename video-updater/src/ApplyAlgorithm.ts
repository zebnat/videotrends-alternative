import { IVideo } from '../../src/common/types'
import { IVideoResource } from './YoutubeApiFetcher'

/** Represents data normalization list for IVideo normalize */
enum NormSts {
  likeToViewRatio,
  likeToDislikeRatio,
  viewTosubRatio,
  subs,
  comments,
  dislikes,
  likes,
  views,
  spam,
  tagsPenalty,
  commentsToViewRatio,
  youtubeScore,
}

interface IVideosDataGroup {
  videos: IVideoResource[]
  channels: object
}

function normalise(
  max: number,
  min: number,
  value: number,
  x: number = 0,
  y: number = 1
): number {
  let range2: number = y - x
  let range: number = max - min

  if (range === 0) {
    return x
  } else {
    return ((value - min) / range) * range2 + x
  }
}

function detectSpam(str: string): number {
  let total = str.length

  let seoTriggers: string[] = ['!', '¡', '(', ')', '¿', '?']

  let uppercase = 0
  let triggers = 0

  let letters = str.split('')
  for (let letter of letters) {
    if (letter == letter.toUpperCase()) {
      uppercase++
    }
    if (seoTriggers.indexOf(letter) >= 0) {
      triggers++
    }
  }

  return ((uppercase * 100) / total) * (1 + 0.2 * triggers)
}

function getVotesTrustBonus(quantity: number, percent: number): number {
  let minimum_votes_to_equal_abs_value = 200
  let diff: number
  let trustdiff: number
  let real: number
  let bonus = Math.floor(quantity / 200)
  let q =
    quantity > minimum_votes_to_equal_abs_value
      ? minimum_votes_to_equal_abs_value
      : quantity

  let midpoint = 50
  if (percent > midpoint) {
    // se sumará a 50
    diff = percent - midpoint
    trustdiff = (q * diff) / minimum_votes_to_equal_abs_value + 0.2 * bonus
    real = midpoint + trustdiff
  } else if (percent < midpoint) {
    // se restara a 50
    diff = (percent - midpoint) * -1
    trustdiff = (q * diff) / minimum_votes_to_equal_abs_value - 0.2 * bonus
    real = midpoint - trustdiff
  } else {
    real = midpoint
  }

  return real
}

/** Fills videos with prepared data*/
function fillWithData(videos: IVideo[], data: IVideosDataGroup): void {
  data.videos.forEach((r, index) => {
    let daysAgo = Math.floor(
      Math.abs(
        (Date.parse(r.snippet.publishedAt) - new Date().getTime()) /
          (24 * 60 * 60 * 1000)
      )
    )
    let views = r.statistics.viewCount || 0
    let likes = r.statistics.likeCount || 0
    let dislikes = 0 - (r.statistics.dislikeCount || 0)
    let comments = r.statistics.commentCount || 0
    let subs = parseInt(data.channels[r.snippet.channelId].subs)
    let viewTosubRatio = subs > 0 ? (views / subs > 3 ? 3 : views / subs) : 0
    let likeToDislikeRatio = getVotesTrustBonus(
      likes + r.statistics.dislikeCount,
      likes + r.statistics.dislikeCount > 0
        ? (likes / (likes + r.statistics.dislikeCount)) * 100
        : 50
    )
    let likeToViewRatio = views > 0 ? likes / views : 0
    let spam = detectSpam(r.snippet.title)
    let tags = r.snippet.tags == undefined ? 0 : r.snippet.tags.length
    let commentsToViewRatio = views > 0 ? comments / views : 0
    let tagsPenalty = tags >= 25 ? 0 : 1 // with 0 value you will not get any boost, more than 25 = no boost
    let youtubeScore = 0 - index

    const powPawah = 8 // compress vector distance

    // prepare normalized data
    const pNormData: number[] = []
    pNormData[NormSts.likeToViewRatio] = likeToViewRatio
    pNormData[NormSts.likeToDislikeRatio] = likeToDislikeRatio
    pNormData[NormSts.viewTosubRatio] = viewTosubRatio
    pNormData[NormSts.subs] = Math.pow(subs, 1 / powPawah)
    pNormData[NormSts.comments] = Math.pow(comments, 1 / powPawah)
    pNormData[NormSts.dislikes] = dislikes
    pNormData[NormSts.likes] = Math.pow(likes, 1 / powPawah)
    pNormData[NormSts.views] = Math.pow(views, 1 / powPawah)
    pNormData[NormSts.spam] = Math.pow(spam, 1 / powPawah)
    pNormData[NormSts.tagsPenalty] = tagsPenalty
    pNormData[NormSts.commentsToViewRatio] = commentsToViewRatio
    pNormData[NormSts.youtubeScore] = youtubeScore

    for (let x in pNormData) {
      if (pNormData[x] == null) throw Error('null data in pNormData index ' + x)
    }

    videos.push({
      categories: r.categories,
      thumb: r.snippet.thumbnails.medium,
      videoId: r.id,
      channelId: r.snippet.channelId,
      subs: subs,
      categoryId: r.snippet.categoryId,
      href: 'https://www.youtube.com/watch?v=' + r.id,
      title: r.snippet.title,
      daysAgo: daysAgo,
      stats: r.statistics,
      rating: 0,
      lang: r.snippet.defaultAudioLanguage,
      trendCategoryPosition: index + 1,
      status: r.status,
      details: r.contentDetails,
      spam: commentsToViewRatio,
      normalize: pNormData,
    })
  })
}

/** Creates the final rating score and fills videos with it
 * @param nData - Normalized data from IVideo normalize
 * @param videos - Complete list of videos
 */
function applyRankingsToVideos(videos: IVideo[], nData: number[][]): void {
  videos.forEach((vidData, i) => {
    const sumaValoresDelUnoAlDiez = 28

    let scoreFormula =
      nData[NormSts.likeToViewRatio][i] * (10 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.likeToDislikeRatio][i] * (6 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.viewTosubRatio][i] * (1 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.subs][i] * (2 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.comments][i] * (1 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.dislikes][i] * (1 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.likes][i] * (2 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.views][i] * (2 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.spam][i] * (0 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.tagsPenalty][i] * (0 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.commentsToViewRatio][i] * (3 / sumaValoresDelUnoAlDiez) +
      nData[NormSts.youtubeScore][i] * (0 / sumaValoresDelUnoAlDiez)

    videos[i].rating = scoreFormula - scoreFormula * 0.09 * vidData.daysAgo
  })

  let sortScore = function compare(a: IVideo, b: IVideo) {
    if (a.rating < b.rating) return 1
    if (a.rating > b.rating) return -1
    return 0
  }
  videos.sort(sortScore)
}

/**
 * normalizes all the data for each video and returns it
 * @param videos - List of videos
 * @return A list with lists of normalized data
 */
function normalizeVideos(videos: IVideo[]) {
  let len = videos.length
  let toNormalise: number[][] = []
  for (let _i in NormSts) {
    toNormalise.push(new Array<number>(len))
  }

  let normalizedData = toNormalise.map((arData, i) => {
    let listWithNormalizableValue = videos.map(video => video.normalize[i])
    let maxValue = Math.max(...listWithNormalizableValue)
    let minValue = Math.min(...listWithNormalizableValue)
    let normalizedOutput: number[] = []

    for (let z = 0; z < arData.length; z++) {
      normalizedOutput.push(
        normalise(maxValue, minValue, videos[z].normalize[i], 0, 1)
      )
    }

    return normalizedOutput
  })

  return normalizedData
}

/**
 * returns a proper sorted list of videos with the ranking applied
 * @param videoList - A video resource list with data from api
 * @param channels - A object with channels information
 */
export const applyAlgorithm = (
  videoList: IVideoResource[],
  channels: object
): IVideo[] => {
  let videos: IVideo[] = []

  // prepare data and fill videos
  fillWithData(videos, { videos: videoList, channels: channels })
  let normalizedData = normalizeVideos(videos)
  applyRankingsToVideos(videos, normalizedData)

  return videos
}
