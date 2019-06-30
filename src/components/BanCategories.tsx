import React, { useState } from 'react'
import { IVideo } from '../common/types'

export interface IBannedCategory {
  name: string
  banned: boolean
}

interface IPropsBanCategories {
  categories: IBannedCategory[]
  onClick(event: React.MouseEvent<HTMLButtonElement>): void
}

// Component
export const BanCategories = (props: IPropsBanCategories) => {
  let { categories, onClick } = props
  return (
    <div className="banList">
      {categories.map((c, i) => (
        <button
          key={i}
          className={c.banned ? 'banned' : ''}
          value={c.name}
          onClick={onClick}
        >
          {c.name}
        </button>
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

  const banCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    let nextCategoriesBanList: IBannedCategory[] = categoriesBanList.map(c => {
      if (c.name == event.currentTarget.value) {
        c.banned = !c.banned
      }
      return c
    })

    setCategoriesBanList(nextCategoriesBanList)
  }

  return [categoriesBanList, setCategoriesBanList, banCategory]
}

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
