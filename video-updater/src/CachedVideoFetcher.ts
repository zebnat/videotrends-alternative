import { readFileSync, writeFileSync } from 'fs'
import { ICacheFiles } from './App'
import { IVideoCategories } from './CategoriesFetcher'
import VideosFetcher from './VideosFetcher'
import { IVideoResource } from './YoutubeApiFetcher'

export const CachedVideoFetcher = (
  cache: boolean,
  cfg: ICacheFiles,
  categoryPack: IVideoCategories[],
  videoFetcher: VideosFetcher
): Promise<[IVideoResource[], object][]> => {
  return new Promise(async (resolve, reject) => {
    let videos: [IVideoResource[], object][]

    if (cache) {
      try {
        let jsonFile: any = readFileSync(cfg.videos)
        videos = JSON.parse(jsonFile)
        resolve(videos)
      } catch (error) {
        // there is no cache file yet
        if (error.code == 'ENOENT') {
          //re-runs function without cache
          resolve(CachedVideoFetcher(false, cfg, categoryPack, videoFetcher))
        } else {
          reject(error)
        }
      }
    } else {
      videos = await videoFetcher.fetchVideosFromAllCountryCategories(
        categoryPack
      )

      try {
        writeFileSync(cfg.videos, JSON.stringify(videos))
      } catch (error) {
        throw Error
      }

      resolve(videos)
    }
  })
}

export default CachedVideoFetcher
