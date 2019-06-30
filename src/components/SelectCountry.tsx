import React from 'react'
import { ILocale } from '../common/types'
import './SelectCountry.css'

interface ISelectCountryProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  regionList: ILocale[]
  country: string
}

export const SelectCountry = (props: ISelectCountryProps): JSX.Element => {
  return (
    <div className="selectBlock">
      <label>Country: </label>
      <select onChange={props.onChange} value={props.country}>
        <option disabled value="">
          -- Select your country --
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
