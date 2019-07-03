import React from 'react'
import { IVideo } from '../common/types'
import LazyLoad from 'react-lazyload'

interface VideoImage {
  lazyIndex?: number
  url: string
  width: number
  height: number
  alt: string
}

const Video: React.FC<IVideo> = props => {
  let cleanTitle: string =
    props.title.length > 60
      ? props.title.substring(0, 60) + ' ...'
      : props.title

  const ImageLazy: React.FC<VideoImage> = props => {
    if (props.lazyIndex == undefined || props.lazyIndex <= 7) {
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
  return (
    <>
      <li className="trend-video">
        <a
          className="tl container"
          href={props.href}
          title={JSON.stringify([
            props.rating,
            props.daysAgo,
            props.stats,
            props.normalize,
            props.categories,
          ])}
        >
          <ImageLazy
            lazyIndex={props.lazyIndex}
            url={props.thumb.url}
            width={props.thumb.width}
            height={props.thumb.height}
            alt={props.title}
          />
          <p className="is-size-6 has-text-white">{cleanTitle}</p>
          <div style={{ display: 'none' }}>
            {props.normalize.map((e, i) => (
              <pre key={i}>{e}</pre>
            ))}
            {props.categories.map((e, i) => (
              <pre key={i}>{e}</pre>
            ))}
          </div>
        </a>
      </li>
    </>
  )
}

export default Video
