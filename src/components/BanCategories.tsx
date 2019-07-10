import React, { useState } from 'react'
import { Video } from '../common/types'
import './BanCategories.scss'

export type BannedCategory = {
  name: string
  banned: boolean
}

type BanCategoriesProps = {
  categories: BannedCategory[]
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}

// Component
export const BanCategories = (props: BanCategoriesProps): JSX.Element => {
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
  BannedCategory[],
  React.Dispatch<React.SetStateAction<BannedCategory[]>>,
  (event: React.MouseEvent<HTMLButtonElement>) => void
] => {
  let [categoriesBanList, setCategoriesBanList] = useState<BannedCategory[]>([])

  const banCategory = (event: React.MouseEvent<HTMLSpanElement>) => {
    let nextCategoriesBanList: BannedCategory[] = categoriesBanList.map(c => {
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
export const prepareBanList = (videos: Video[]): BannedCategory[] => {
  let list: string[] = []

  videos.forEach(v => {
    let categories: string[] = []
    if (process.env.NODE_ENV === 'production') {
      if (v.c !== undefined) categories = v.c
    } else if (process.env.NODE_ENV === 'development') {
      if (v.categories !== undefined) categories = v.categories
    }

    categories.forEach(c => {
      list.push(c)
    })
  })

  let filteredList = list.filter((value, index, self) => {
    return self.indexOf(value) === index
  })

  let Banlist: BannedCategory[] = []
  filteredList.forEach(c => {
    Banlist.push({
      name: c,
      banned: false,
    })
  })

  return Banlist
}
