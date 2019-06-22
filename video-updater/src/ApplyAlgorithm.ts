import { IVideo } from '../../src/common/types'
import { IVideoResource } from './YoutubeApiFetcher'

function normalise(max, min, value, x = 0, y = 1) {
  var range2 = y - x
  var range = max - min

  if (range == 0) {
    return x
  } else {
    return ((value - min) / range) * range2 + x
  }
}

function detectSpam(str) {
  let total = str.length

  let seoTriggers = ['!', '¡', '(', ')', '¿', '?']

  let uppercase = 0
  let triggers = 0

  for (let x in str) {
    if (str[x] == str[x].toUpperCase()) {
      uppercase++
    }
    if (seoTriggers.indexOf(str[x]) >= 0) {
      triggers++
    }
  }

  return ((uppercase * 100) / total) * (1 + 0.2 * triggers)
}

function getVotesTrustBonus(quantity, percent) {
  let minimum_votes_to_equal_abs_value = 200
  let diff = null
  let trustdiff = null
  let real = null
  let bonus = Math.floor(quantity / 200)
  let q =
    quantity > minimum_votes_to_equal_abs_value
      ? minimum_votes_to_equal_abs_value
      : quantity

  let midpoint = 50
  if (percent > midpoint) {
    // se sumará a 50
    diff = percent - midpoint
    trustdiff =
      (q * diff) / minimum_votes_to_equal_abs_value +
      0.2 * bonus
    real = midpoint + trustdiff
  } else if (percent < midpoint) {
    // se restara a 50
    diff = (percent - midpoint) * -1
    trustdiff =
      (q * diff) / minimum_votes_to_equal_abs_value -
      0.2 * bonus
    real = midpoint - trustdiff
  } else {
    real = midpoint
  }

  return real
}

export const applyAlgorithm = (
  videoList: IVideoResource[],
  channels: object
): IVideo[] => {
  let videos: IVideo[] = []

  videoList.forEach((r, index: number) => {
    let daysAgo = Math.floor(
      Math.abs(
        (Date.parse(r.snippet.publishedAt) -
          new Date().getTime()) /
          (24 * 60 * 60 * 1000)
      )
    )
    let views = r.statistics.viewCount || 0
    let likes = r.statistics.likeCount || 0
    let dislikes = 0 - r.statistics.dislikeCount || 0
    let comments = r.statistics.commentCount || 0
    let subs =
      parseInt(channels[r.snippet.channelId].subs) || 0
    let viewTosubRatio =
      subs > 0 ? (views / subs > 3 ? 3 : views / subs) : 0
    let likeToDislikeRatio = getVotesTrustBonus(
      likes + r.statistics.dislikeCount,
      likes + r.statistics.dislikeCount > 0
        ? (likes / (likes + r.statistics.dislikeCount)) *
            100
        : 50
    )
    let likeToViewRatio = views > 0 ? likes / views : 0
    let spam = detectSpam(r.snippet.title)
    let tags =
      typeof r.snippet.tags == 'undefined'
        ? 0
        : r.snippet.tags.length
    let commentsToViewRatio =
      views > 0 ? comments / views : 0
    let tagsPenalty = tags >= 25 ? 1 : 0
    let youtubeScore = 0 - index

    const powPawah = 8 // compress vector distance

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
      normalize: [
        likeToViewRatio,
        likeToDislikeRatio,
        viewTosubRatio,
        Math.pow(subs, 1 / powPawah),
        Math.pow(comments, 1 / powPawah),
        dislikes,
        Math.pow(likes, 1 / powPawah),
        Math.pow(views, 1 / powPawah),
        Math.pow(spam, 1 / powPawah),
        tagsPenalty,
        commentsToViewRatio,
        youtubeScore,
      ],
    })
  })

  let len = videos.length
  //normalize all
  let likeToViewRatio = new Array(len)
  let likeToDislikeRatio = new Array(len)
  let viewTosubRatio = new Array(len)
  let subs = new Array(len)
  let comments = new Array(len)
  let dislikes = new Array(len)
  let likes = new Array(len)
  let views = new Array(len)
  let spam = new Array(len)
  let tagsPenalty = new Array(len)
  let commentsToViewRatio = new Array(len)
  let youtubeScore = new Array(len)

  let toNormalise = [
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
  ]

  let normalized = toNormalise.map((arData, i) => {
    let trueData = videos.map(v => v.normalize[i])
    let max = Math.max(...trueData)
    let min = Math.min(...trueData)
    let normalizedOutput = []

    for (let z = 0; z < arData.length; z++) {
      normalizedOutput.push(
        normalise(max, min, videos[z].normalize[i], 0, 1)
      )
    }

    return normalizedOutput
  })

  videos.forEach((vidData, index) => {
    const sumaValoresDelUnoAlDiez = 28

    let scoreFormula =
      normalized[0][index] *
        (10 / sumaValoresDelUnoAlDiez) + // likeToViewRatio [10]
      normalized[1][index] * (6 / sumaValoresDelUnoAlDiez) + // likeToDislikeRatio [6]
      normalized[2][index] * (1 / sumaValoresDelUnoAlDiez) + // viewTosubRatio [1]
      normalized[3][index] * (2 / sumaValoresDelUnoAlDiez) + // subs [2]
      normalized[4][index] * (1 / sumaValoresDelUnoAlDiez) + // comments [1]
      normalized[5][index] * (1 / sumaValoresDelUnoAlDiez) + // dislikes [1]
      normalized[6][index] * (2 / sumaValoresDelUnoAlDiez) + // likes [2]
      normalized[7][index] * (2 / sumaValoresDelUnoAlDiez) + // views [2]
      normalized[8][index] * (0 / sumaValoresDelUnoAlDiez) + // spam [0]
      normalized[10][index] * (3 / sumaValoresDelUnoAlDiez) // commentsToViewRatio [3]
    videos[index].rating =
      scoreFormula - scoreFormula * 0.09 * vidData.daysAgo
  })

  let sortScore = function compare(a, b) {
    if (a.rating < b.rating) return 1
    if (a.rating > b.rating) return -1
    return 0
  }
  videos.sort(sortScore)
  return videos
}
