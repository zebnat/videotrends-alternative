export type Thumb = {
  url: string
  width: number
  height: number
}

export interface Video {
  visible: boolean
  categoryId?: string
  title: string
  rating: number
  daysAgo: number
  trendCategoryPosition?: number
  channelId?: string
  subs: number
  spam?: number
  normalize?: number[]
  thumb: Thumb
  href: string
  videoId?: string
  stats?: any
  details?: any
  lang?: string
  status?: any
  categories: string[]
  lazyIndex?: number
}

/**
 * @v video.visible
 * @t video.title
 * @r video.rating
 * @d video.number
 * @tm video.thumb
 * @h video.href
 * @c video.categories
 * @s video.subs
 */
export type ProdVideoJSON = {
  v: boolean // visible
  t: string // title
  r: number // rating
  d: number // days ago
  tm: Thumb // thumb
  h: string // href
  c: string[] // categories
  s: number // subs
}

export type DevVideoJSON = {
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
}

export type Locale = {
  language: string
  country: string
  screenName: string
}
