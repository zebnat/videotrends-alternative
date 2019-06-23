import React from 'react'
import { IVideo } from '../common/types'

const Video: React.FC<IVideo> = props => {
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
      <a
        className="tl"
        href={props.href}
        title={JSON.stringify([props.stats, props.normalize, props.categories])}
      >
        {cleanTitle}
      </a>
    </li>
  )
}

export default Video
