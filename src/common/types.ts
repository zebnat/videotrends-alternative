interface IThumb {
  url: string
  width: number
  height: number
}

export interface IVideo {
  visible: boolean
  categoryId: string
  title: string
  rating: number
  daysAgo: number
  trendCategoryPosition: number
  channelId: string
  subs: number
  spam: number
  normalize: number[]
  thumb: IThumb
  href: string
  videoId: string
  stats: any
  details: any
  lang: string
  status: any
  categories: string[]
}

export interface ILocale {
  language: string
  country: string
  screenName: string
}
