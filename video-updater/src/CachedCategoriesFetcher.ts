import { ICacheFiles } from './App'
import { IVideoCategoriesApiResponse } from './YoutubeApiFetcher'
import { readFileSync, writeFileSync } from 'fs'
import CategoriesFetcher from './CategoriesFetcher'

const CachedCategoriesFetcher = async (
  cache: boolean,
  cfg: ICacheFiles,
  catFetcher: CategoriesFetcher
) => {
  return new Promise(async (resolve, reject) => {
    let categories: IVideoCategoriesApiResponse[]

    if (cache) {
      try {
        let jsonFile: any = readFileSync(cfg.categories)
        categories = JSON.parse(jsonFile)
      } catch (error) {
        // there is no cache file yet
        if (error.code == 'ENOENT') {
          //re-runs function without cache
          resolve(
            CachedCategoriesFetcher(false, cfg, catFetcher)
          )
        } else {
          reject(error)
        }
      }

      resolve(categories)
    } else {
      categories = await catFetcher.fetchAll()

      try {
        writeFileSync(
          cfg.categories,
          JSON.stringify(categories)
        )
      } catch (error) {
        throw Error
      }

      resolve(categories)
    }
  })
}

export default CachedCategoriesFetcher
