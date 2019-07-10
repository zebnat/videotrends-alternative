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
  let cleanTitle: string = ''

  if (process.env.NODE_ENV == 'production') {
    if (props.t !== undefined)
      cleanTitle =
        props.t.length > 60 ? props.t.substring(0, 60) + ' ...' : props.t
  } else if (process.env.NODE_ENV == 'development') {
    if (props.title !== undefined)
      cleanTitle =
        props.title.length > 60
          ? props.title.substring(0, 60) + ' ...'
          : props.title
  }

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

  let render: any = ''

  if (process.env.NODE_ENV == 'production') {
    if (props.t !== undefined && props.tm !== undefined) {
      render = (
        <>
          <li className="trend-video">
            <a className="tl container" href={props.h}>
              <ImageLazy
                lazyIndex={props.lazyIndex}
                url={props.tm.url}
                width={props.tm.width}
                height={props.tm.height}
                alt={props.t}
              />
              <p className="is-size-6 has-text-white">{cleanTitle}</p>
            </a>
          </li>
        </>
      )
    }
  } else if (process.env.NODE_ENV == 'development') {
    if (
      props.thumb !== undefined &&
      props.normalize !== undefined &&
      props.lazyIndex !== undefined &&
      props.categories !== undefined &&
      props.title !== undefined
    ) {
      render = (
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
              <div>
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
  }

  return render
}

export default Video
