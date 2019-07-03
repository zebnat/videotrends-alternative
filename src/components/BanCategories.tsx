import React, { useState } from 'react'
import { IVideo } from '../common/types'
import './BanCategories.scss'

export interface IBannedCategory {
  name: string
  banned: boolean
}

interface IPropsBanCategories {
  categories: IBannedCategory[]
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}

// Component
export const BanCategories = (props: IPropsBanCategories): JSX.Element => {
  let { categories, onClick } = props
  return (
    <div className="tags">
      {categories.map((c, i) => (
        <span
          key={i}
          className={'tag is-light is-medium ' + (c.banned ? 'banned' : '')}
          onClick={onClick}
        >
          {c.name}
        </span>
      ))}
    </div>
  )
}

// Custom Hook
export const useBanCategories = (): [
  IBannedCategory[],
  React.Dispatch<React.SetStateAction<IBannedCategory[]>>,
  (event: React.MouseEvent<HTMLButtonElement>) => void
] => {
  let [categoriesBanList, setCategoriesBanList] = useState<IBannedCategory[]>(
    []
  )

  const banCategory = (event: React.MouseEvent<HTMLSpanElement>) => {
    let nextCategoriesBanList: IBannedCategory[] = categoriesBanList.map(c => {
      if (c.name === event.currentTarget.innerText) {
        c.banned = !c.banned
      }
      return c
    })

    setCategoriesBanList(nextCategoriesBanList)
  }

  return [categoriesBanList, setCategoriesBanList, banCategory]
}

/**
 * takes a list of videos and returns a list of unique categories
 * @param videos
 */
export const prepareBanList = (videos: IVideo[]): IBannedCategory[] => {
  let list: string[] = []

  videos.forEach(v => {
    v.categories.forEach(c => {
      list.push(c)
    })
  })

  let filteredList = list.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  let Banlist: IBannedCategory[] = []
  filteredList.forEach(c => {
    Banlist.push({
      name: c,
      banned: false,
    })
  })

  return Banlist
}
