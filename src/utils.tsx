import { Locale } from './common/types'

/**
 * convert region list to an array with values es-es or en-us
 * @param regions ILocale[]
 */
export const prepareRegionList = (regions: Locale[]): string[] => {
  let acceptedCountries: string[] = []
  for (let x in regions) {
    acceptedCountries.push(regions[x].language + '-' + regions[x].country)
  }

  return acceptedCountries
}
