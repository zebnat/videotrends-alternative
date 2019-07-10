import React from 'react'
import { Video as VideoType } from '../common/types'
import LazyLoad from 'react-lazyload'

type VideoImage = {
  lazyIndex?: number
  url: string
  width: number
  height: number
  alt: string
}

const Video: React.FC<VideoType> = props => {
  let cleanTitle: string =
    props.title.length > 60
      ? props.title.substring(0, 60) + ' ...'
      : props.title

  const ImageLazy: React.FC<VideoImage> = props => {
    if (props.lazyIndex === undefined || props.lazyIndex <= 7) {
      return (
        <img
          src={props.url}
          width={props.width}
          height={props.height}
          alt={props.alt}
        />
      )
    } else {
      return (
        <LazyLoad height={100} once offset={100}>
          <img
            src={props.url}
            width={props.width}
            height={props.height}
            alt={props.alt}
          />
        </LazyLoad>
      )
    }
  }

  const debugInfo = () => {
    if (props.normalize !== undefined) {
      const data: JSX.Element[] = props.normalize.map((e, i) => (
        <pre key={i}>{e}</pre>
      ))

      const cats: JSX.Element[] = props.categories.map((e, i) => (
        <pre key={i}>{e}</pre>
      ))

      return (
        <>
          <div
            title={JSON.stringify([
              props.rating,
              props.daysAgo,
              props.stats,
              props.normalize,
              props.categories,
            ])}
          >
            {data}
            {cats}
          </div>
        </>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <li className="trend-video">
        <a className="tl container" href={props.href}>
          <ImageLazy
            lazyIndex={props.lazyIndex}
            url={props.thumb.url}
            width={props.thumb.width}
            height={props.thumb.height}
            alt={props.title}
          />
          <p className="is-size-6 has-text-white">{cleanTitle}</p>
        </a>
        {debugInfo()}
      </li>
    </>
  )
}

export default Video
