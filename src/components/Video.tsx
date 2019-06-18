import React from 'react'

export interface IVideo {
  categoryId: string
  title: string
  rating: number
  daysAgo: number
  trendCategoryPosition: number
  channelId: string
  subs: number
  spam: number
  normalize: Array<number>
  thumb: iThumb
  href: string
  videoId: string
  stats: any
  details: any
  lang: string
  status: any
}

interface iThumb {
  url: string
  width: number
  height: number
}

const Video: React.FC<IVideo> = (props: IVideo) => {
  let cleanTitle: string =
    props.title.length > 60
      ? props.title.substring(0, 60) + ' ...'
      : props.title

  return (
    <li className="trend-video">
      <img
        src={props.thumb.url}
        width={props.thumb.width}
        height={props.thumb.height}
        alt={props.title}
      />
      <a className="tl" href={props.href}>
        {cleanTitle}
      </a>
    </li>
  )
}

export default Video
