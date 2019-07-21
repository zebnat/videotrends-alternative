import { Video } from '../../src/common/types'
import { VideoResource } from './YoutubeApiFetcher'

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
  likePercentTrust,
}

type VideosDataGroup = {
  videos: VideoResource[]
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

function getVotesTrustBonus(likes: number, likesPercent: number): number {
  var minimum_votes_to_equal_abs_value = 200
  var diff = null
  var trustdiff = null
  var real = null
  var bonus = Math.floor(likes / 200)
  var q =
    likes > minimum_votes_to_equal_abs_value
      ? minimum_votes_to_equal_abs_value
      : likes

  var midpoint = 50
  if (likesPercent > midpoint) {
    // se sumará a 50
    diff = likesPercent - midpoint
    trustdiff = (q * diff) / minimum_votes_to_equal_abs_value + 0.2 * bonus
    real = midpoint + trustdiff
  } else if (likesPercent < midpoint) {
    // se restara a 50
    diff = (likesPercent - midpoint) * -1
    trustdiff = (q * diff) / minimum_votes_to_equal_abs_value - 0.2 * bonus
    real = midpoint - trustdiff
  } else {
    real = midpoint
  }

  return real
}

function detectSpam(str: string): number {
  let total = str.length

  let seoTriggers: string[] = ['!', '¡', '(', ')', '¿', '?', '*']

  const emojiRanges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]', // U+1F680 to U+1F6FF
    ' ', // Also allow spaces
  ].join('|')

  let upperCase = 0
  let triggers = 0

  let letters = str.split('')
  for (let letter of letters) {
    if (letter == letter.toUpperCase()) {
      upperCase++
    }
    if (seoTriggers.indexOf(letter) >= 0) {
      triggers = triggers + 15
    }
    if (letter.match(emojiRanges) !== null) {
      triggers = triggers + 25
    }
  }
  let percentOfUpperCase = (upperCase * 100) / letters.length

  return (percentOfUpperCase > 60 ? 75 : 0) + 0.2 * triggers
}

/** Fills videos with prepared data*/
function fillWithData(videos: Video[], data: VideosDataGroup): void {
  data.videos.forEach((r, index) => {
    let daysAgo = Math.floor(
      Math.abs(
        (Date.parse(r.snippet.publishedAt) - new Date().getTime()) /
          (24 * 60 * 60 * 1000)
      )
    )
    let views = parseInt(r.statistics.viewCount) || 0
    let likes = parseInt(r.statistics.likeCount) || 0
    let dislikes = parseInt(r.statistics.dislikeCount) || 0
    let comments = parseInt(r.statistics.commentCount) || 0
    let subs = parseInt(data.channels[r.snippet.channelId].subs)
    let viewTosubRatio = subs > 0 ? (views / subs > 3 ? 3 : views / subs) : 0
    let likeToDislikeRatio = (likes * 100) / (likes + dislikes + 1)
    let likeToViewRatio = views > 0 && likes > 0 ? likes / views : 0
    let spam = 100000000000 + (0 - detectSpam(r.snippet.title))
    let tags = r.snippet.tags == undefined ? 0 : r.snippet.tags.length
    let commentsToViewRatio = !views || !comments ? 0 : comments / views
    let tagsPenalty = tags >= 15 ? 0 : 1 // with 0 value you will not get any boost, more than 25 = no boost
    let youtubeScore = 0 - index

    // prepare normalized data
    const pNormData: number[] = []
    pNormData[NormSts.likeToViewRatio] = likeToViewRatio
    pNormData[NormSts.likeToDislikeRatio] = likeToDislikeRatio
    pNormData[NormSts.viewTosubRatio] = viewTosubRatio
    pNormData[NormSts.subs] = subs
    pNormData[NormSts.comments] = comments
    pNormData[NormSts.dislikes] = 0 - dislikes
    pNormData[NormSts.likes] = likes
    pNormData[NormSts.views] = views
    pNormData[NormSts.spam] = spam
    pNormData[NormSts.tagsPenalty] = tagsPenalty
    pNormData[NormSts.commentsToViewRatio] = commentsToViewRatio
    pNormData[NormSts.youtubeScore] = youtubeScore
    pNormData[NormSts.likePercentTrust] = getVotesTrustBonus(
      likes,
      likeToDislikeRatio
    )

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
      spam: spam,
      normalize: pNormData,
      visible: true,
    })
  })
}

/** Creates the final rating score and fills videos with it
 * @param nData - Normalized data from IVideo normalize
 * @param videos - Complete list of videos
 */
function applyRankingsToVideos(videos: Video[], nData: number[][]): void {
  videos.forEach((vidData, i) => {
    let importanceRating: number[] = []
    // rate from 1 to 10
    // you can configure this block
    importanceRating[NormSts.likeToViewRatio] = 3
    importanceRating[NormSts.likeToDislikeRatio] = 4
    importanceRating[NormSts.viewTosubRatio] = 1
    importanceRating[NormSts.subs] = 4
    importanceRating[NormSts.comments] = 5
    importanceRating[NormSts.dislikes] = 1
    importanceRating[NormSts.likes] = 5
    importanceRating[NormSts.views] = 10
    importanceRating[NormSts.spam] = 1
    importanceRating[NormSts.tagsPenalty] = 1
    importanceRating[NormSts.commentsToViewRatio] = 2
    importanceRating[NormSts.youtubeScore] = 0.5
    importanceRating[NormSts.likePercentTrust] = 7
    // end algorithm

    let logNormalized: number[] = []

    let totalImportance: number = importanceRating.reduce((a, b) => a + b, 0)

    let scoreFormula: number = 1
    let scoreFormulaAgregatte: number = 1
    let scoreFormulaDirect: number = 1
    for (let z in NormSts) {
      if (!isNaN(Number(z))) {
        logNormalized[z] = nData[z][i]
        scoreFormulaDirect =
          scoreFormulaDirect *
          (1 + nData[z][i] * (importanceRating[z] / totalImportance))
        scoreFormulaAgregatte =
          scoreFormulaAgregatte +
          nData[z][i] * (importanceRating[z] / totalImportance)
      }
    }

    scoreFormula = scoreFormulaAgregatte * 0.75 + scoreFormulaDirect * 0.25

    videos[i].normalize = logNormalized

    //videos[i].rating = videos[i].normalize[NormSts.likeToDislikeRatio]

    videos[i].rating =
      vidData.daysAgo < 1
        ? scoreFormula - scoreFormula * 0.09
        : scoreFormula - scoreFormula * 0.08 * vidData.daysAgo
  })

  let sortScore = function compare(a: Video, b: Video) {
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
function normalizeVideos(videos: Video[]) {
  let len = videos.length
  let toNormalise: number[][] = []
  for (let i in NormSts) {
    if (!isNaN(Number(i))) {
      toNormalise.push(new Array<number>(len))
    }
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
  videoList: VideoResource[],
  channels: object
): Video[] => {
  let videos: Video[] = []

  // prepare data and fill videos
  fillWithData(videos, { videos: videoList, channels: channels })
  let normalizedData = normalizeVideos(videos)
  applyRankingsToVideos(videos, normalizedData)

  return videos
}
