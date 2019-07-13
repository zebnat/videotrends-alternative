import React, { useState } from 'react'
import { Video } from '../common/types'
import './BanCategories.scss'
import { MAX_VIDEOS_SHOWN } from '../config/config'

export type BannedCategory = {
  name: string
  banned: boolean
  percentile: number
}

type BanCategoriesProps = {
  categories: BannedCategory[]
  onClick(event: React.MouseEvent<HTMLSpanElement>, catName: string): void
}

// Component
export const BanCategories = (props: BanCategoriesProps): JSX.Element => {
  let { categories, onClick } = props
  let clonedcats = categories.slice(0)
  let cols = 3
  let cut = Math.floor(categories.length / cols)

  let categoriesPack = []
  while (clonedcats.length > 0) {
    categoriesPack.push(clonedcats.splice(0, cut))
  }

  const OcurrenceLevel = (props: { percentile: number }) => {
    let color: string = '#fff'
    let bars: number = 0
    if (props.percentile < 10) {
      color = '#acfff4'
      bars = 1
    } else if (props.percentile < 20) {
      color = '#58e27d'
      bars = 2
    } else if (props.percentile < 30) {
      bars = 2
      color = 'orange'
    } else if (props.percentile < 40) {
      bars = 3
      color = '#ff0000'
    } else {
      bars = 3
      color = '#e2e2e2'
    }

    let squares = []
    for (let i = 0; i < bars; i++) {
      squares.push(
        <div
          key={i}
          style={{
            margin: '1px',
            background: color,
            width: '12px',
            height: '15px',
            display: 'inline-block',
          }}
        ></div>
      )
    }

    return (
      <div
        style={{
          width: '42px',
          marginLeft: '5px',
          height: '17px',
          background: '#000',
          textAlign: 'left',
          borderRadius: '2px',
        }}
      >
        {squares}
      </div>
    )
  }

  return (
    <div className="tags columns">
      {categoriesPack.map((pack, i) => {
        return (
          <div key={'catpack' + i} className="column">
            {pack.map((c, z) => (
              <span
                key={z}
                className={
                  'tag is-light is-medium ' + (c.banned ? 'banned' : '')
                }
                onClick={e => {
                  onClick(e, c.name)
                }}
              >
                {c.name} <OcurrenceLevel percentile={c.percentile} />
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// Custom Hook
export const useBanCategories = (): [
  BannedCategory[],
  React.Dispatch<React.SetStateAction<BannedCategory[]>>,
  (event: React.MouseEvent<HTMLButtonElement>, catName: string) => void
] => {
  let [categoriesBanList, setCategoriesBanList] = useState<BannedCategory[]>([])

  const banCategory = (
    event: React.MouseEvent<HTMLSpanElement>,
    catName: string
  ) => {
    let nextCategoriesBanList: BannedCategory[] = categoriesBanList.map(c => {
      if (c.name === catName) {
        c.banned = !c.banned
      }
      return c
    })

    nextCategoriesBanList.sort(sortCategoriesDesc)
    setCategoriesBanList(nextCategoriesBanList)
  }

  return [categoriesBanList, setCategoriesBanList, banCategory]
}

/**
 * takes a list of videos and returns a list of unique categories
 * @param videos
 */
export const prepareBanList = (videos: Video[]): BannedCategory[] => {
  let list: string[] = []
  let firstVideosList: string[] = []
  videos.forEach((v, i) => {
    v.categories.forEach(c => {
      if (i < MAX_VIDEOS_SHOWN) {
        firstVideosList.push(c)
      }
      list.push(c)
    })
  })

  let filteredList = list.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  const findOcurrences = (category: string, list: string[]) => {
    let total = 0

    list.forEach(c => {
      if (c === category) total++
    })

    return total
  }

  const findPercentileOfTotal = (
    totalInList: number,
    totalOcurrences: number
  ) => {
    return Math.round((totalOcurrences * 100) / totalInList)
  }

  let Banlist: BannedCategory[] = []
  filteredList.forEach(c => {
    Banlist.push({
      name: c,
      banned: false,
      percentile: findPercentileOfTotal(
        firstVideosList.length,
        findOcurrences(c, firstVideosList)
      ),
    })
  })

  return Banlist
}

export const sortCategoriesDesc = (a: BannedCategory, b: BannedCategory) => {
  if (a.percentile > b.percentile) {
    return -1
  } else if (a.percentile < b.percentile) {
    return 1
  } else {
    return 0
  }
}
