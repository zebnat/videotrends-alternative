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

        console.log('videos from cache')
        resolve(videos)
      } catch (error) {
        // there is no cache file yet
        if (error.code == 'ENOENT') {
          console.log('no cache file for videos!!!')
          //re-runs function without cache
          resolve(
            CachedVideoFetcher(
              false,
              cfg,
              categoryPack,
              videoFetcher
            )
          )
        } else {
          reject(error)
        }
      }
    } else {
      console.log('fetching Videos')

      videos = await videoFetcher.fetchVideosFromAllCountryCategories(
        categoryPack
      )

      try {
        writeFileSync(cfg.videos, JSON.stringify(videos))
      } catch (error) {
        throw Error
      }

      console.log('videos without cache')
      resolve(videos)
    }
  })
}

export default CachedVideoFetcher
