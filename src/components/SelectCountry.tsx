import React from 'react'
import { ILocale } from '../common/types'
import './SelectCountry.scss'

interface ISelectCountryProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  regionList: ILocale[]
  country: string
}

export const SelectCountry = (props: ISelectCountryProps): JSX.Element => {
  return (
    <div className="select is-medium is-primary">
      <select onChange={props.onChange} value={props.country}>
        <option disabled value="">
          -- Select --
        </option>
        {props.regionList.map((e, i) => (
          <option key={i} value={e.language + '-' + e.country}>
            {e.screenName}
          </option>
        ))}
      </select>
    </div>
  )
}
