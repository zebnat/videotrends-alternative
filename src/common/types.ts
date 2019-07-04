type Thumb = {
  url: string
  width: number
  height: number
}

export type Video = {
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
  thumb: Thumb
  href: string
  videoId: string
  stats: any
  details: any
  lang: string
  status: any
  categories: string[]
  lazyIndex?: number
}

export type Locale = {
  language: string
  country: string
  screenName: string
}
