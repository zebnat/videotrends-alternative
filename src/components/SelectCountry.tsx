import React from 'react'
import { Locale } from '../common/types'

type SelectCountryProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  regionList: Locale[]
  country: string
}

export const SelectCountry = (props: SelectCountryProps): JSX.Element => {
  return (
    <section className="section is-small has-text-centered">
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
    </section>
  )
}
