type Thumb = {
  url: string
  width: number
  height: number
}

export type Video = {
  visible?: boolean
  categoryId?: string
  title?: string
  rating?: number
  daysAgo?: number
  trendCategoryPosition?: number
  channelId?: string
  subs?: number
  spam?: number
  normalize?: number[]
  thumb?: Thumb
  href?: string
  videoId?: string
  stats?: any
  details?: any
  lang?: string
  status?: any
  categories?: string[]
  lazyIndex?: number

  v?: boolean // visible
  t?: string // title
  r?: number // rating
  d?: number // days ago
  tm?: Thumb // thumb
  h?: string // href
  c?: string[] // categories
  s?: number // subs
  l?: number // lazyIndex
}

export type Locale = {
  language: string
  country: string
  screenName: string
}
